/**
 * Universal API Gateway
 *
 * Single endpoint: POST /api/v1/gateway
 * All business operations are action-based.
 *
 * Security:
 *  - All requests are validated against an allowlisted action registry
 *  - No arbitrary URL proxying
 *  - SSRF prevented — all external calls go through registered adapters
 *  - Secret values are never returned to callers
 */

import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod/v4";
import { db, blogPostsTable, notificationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { chat } from "../lib/ai-adapters";
import { getProviderStatus, resolveProvider } from "../lib/provider-registry";
import { attachAuth } from "../middlewares/require-auth";

const router: IRouter = Router();
router.use(attachAuth);

const GatewayBodySchema = z.object({
  action: z.string().min(1).max(64),
  payload: z.record(z.string(), z.unknown()).optional().default({}),
});

router.post("/v1/gateway", async (req: Request, res: Response) => {
  const parsed = GatewayBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Invalid gateway request" });
    return;
  }

  const { action, payload } = parsed.data;
  const handler = ACTION_REGISTRY[action];

  if (!handler) {
    res.status(404).json({ success: false, error: `Unknown action: ${action}` });
    return;
  }

  // Check auth requirement
  if (handler.requireAuth && !req.auth) {
    res.status(401).json({ success: false, error: "Authentication required" });
    return;
  }
  if (handler.requireAdmin && !req.auth?.isAdmin) {
    res.status(403).json({ success: false, error: "Admin access required" });
    return;
  }

  try {
    const result = await handler.execute(payload, req);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    req.log.error({ err, action }, "Gateway action failed");
    const message = err instanceof Error ? err.message : "Action failed";
    res.status(500).json({ success: false, error: message });
  }
});

// ─── Action Registry ──────────────────────────────────────────────────────────

interface ActionHandler {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  execute: (payload: Record<string, unknown>, req: Request) => Promise<unknown>;
}

const PUBLIC_CONFIG_DATA = {
  company: {
    name: "Nexus Wave Technologies",
    tagline: "High-efficiency barrier-free utilities for everyone",
    email: "info@nexusweb.co.in",
    founder: "Kuldeep Kumar Yadav",
  },
  social: {
    x: "https://x.com/NexusWaveApps",
    linkedin: "https://www.linkedin.com/company/nexus-wave-technologies/",
    instagram: "https://www.instagram.com/nexuswave_technologies",
    whatsapp: "https://whatsapp.com/channel/0029VbDI2cL42Dcc9m6nfm3T",
    telegram: "https://t.me/NexusWave5",
    discord: "https://discord.gg/3yp8MMwJe",
    facebook: "https://facebook.com/profile.php?id=61590971301245",
    github: "https://github.com/Kuldeep532/refactored-octo-couscous",
  },
  apps: [
    {
      id: "nexus-plus",
      name: "Nexus Plus",
      packageId: "com.nexuswavetech.nexusplus",
      description: "Enhanced features and seamless integration",
      apkFile: "nexus-plus.apk",
      releaseSource: "https://github.com/Kuldeep532/refactored-octo-couscous/releases",
    },
    {
      id: "geeta-nexus",
      name: "Geeta Nexus",
      packageId: "com.nexuswavetech.geetanexus",
      description: "Spiritual wisdom meets modern technology",
      apkFile: "geeta-nexus.apk",
      releaseSource: "https://github.com/Kuldeep532/refactored-octo-couscous/releases",
    },
  ],
};

const ACTION_REGISTRY: Record<string, ActionHandler> = {
  GET_PUBLIC_CONFIG: {
    execute: async () => PUBLIC_CONFIG_DATA,
  },

  GET_COMPANY_INFO: {
    execute: async () => PUBLIC_CONFIG_DATA.company,
  },

  GET_SOCIAL_LINKS: {
    execute: async () => PUBLIC_CONFIG_DATA.social,
  },

  GET_APPS: {
    execute: async () => PUBLIC_CONFIG_DATA.apps,
  },

  GET_APP_DETAILS: {
    execute: async (payload) => {
      const id = String(payload.appId ?? "");
      const app = PUBLIC_CONFIG_DATA.apps.find((a) => a.id === id);
      if (!app) throw new Error("App not found");
      return app;
    },
  },

  GET_LATEST_RELEASE: {
    execute: async () => ({
      releaseSource: "https://github.com/Kuldeep532/refactored-octo-couscous/releases",
      message: "Download the latest APK from our GitHub Releases page.",
    }),
  },

  GET_BLOG_POSTS: {
    execute: async (payload) => {
      const limit = Math.min(Number(payload.limit ?? 20), 50);
      return db.select().from(blogPostsTable).where(eq(blogPostsTable.published, true)).orderBy(desc(blogPostsTable.createdAt)).limit(limit);
    },
  },

  GET_NOTIFICATIONS: {
    execute: async (payload) => {
      const channel = String(payload.channel ?? "");
      const base = db.select().from(notificationsTable).orderBy(desc(notificationsTable.createdAt)).limit(20);
      if (channel) {
        return db.select().from(notificationsTable).where(eq(notificationsTable.targetChannel, channel)).orderBy(desc(notificationsTable.createdAt)).limit(20);
      }
      return base;
    },
  },

  GET_AI_PROVIDERS: {
    execute: async () => getProviderStatus(),
  },

  AI_CHAT: {
    requireAuth: true,
    execute: async (payload) => {
      const message = String(payload.message ?? "").slice(0, 4000);
      if (!message) throw new Error("Message is required");

      const provider = resolveProvider("chat");
      if (!provider) throw new Error("AI service is not configured");

      const response = await chat([
        { role: "system", content: "You are Nexus Mitra, the assistant for Nexus Wave Technologies." },
        { role: "user", content: message },
      ]);
      return { reply: response.text, provider: response.provider };
    },
  },

  CHECK_APP_VERSION: {
    execute: async (payload) => {
      const packageId = String(payload.packageId ?? "");
      const currentVersion = String(payload.version ?? "");
      // In production, query a versions table; for now return current status
      return {
        packageId,
        currentVersion,
        latestVersion: null,
        updateRequired: false,
        updateAvailable: false,
        message: "Check GitHub releases for the latest version.",
        releaseSource: "https://github.com/Kuldeep532/refactored-octo-couscous/releases",
      };
    },
  },

  GET_MAINTENANCE_STATUS: {
    execute: async () => ({
      maintenance: false,
      message: null,
    }),
  },
};

export default router;
