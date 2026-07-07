import { Router, type IRouter, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod/v4";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { attachAuth, requireAuth, requireAdmin } from "../middlewares/require-auth";
import { getFirebaseAuth } from "../lib/firebase";

const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret";
const TOKEN_EXPIRY = "7d";
const SETUP_KEY = process.env.FIREBASE_ADMIN_SETUP_KEY;

const router: IRouter = Router();
router.use(attachAuth);

function signToken(userId: number, email: string, isAdmin: boolean, firebaseUid: string): string {
  return jwt.sign({ userId, email, isAdmin, firebaseUid }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

function safeUser(user: { id: number; email: string; name: string | null; picture: string | null; isAdmin: boolean; username: string | null; firebaseUid: string | null }) {
  return { id: user.id, email: user.email, name: user.name, picture: user.picture, isAdmin: user.isAdmin, username: user.username, firebaseUid: user.firebaseUid };
}

interface FirebaseTokenPayload {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  admin?: boolean;
}

async function verifyFirebaseToken(idToken: string): Promise<FirebaseTokenPayload | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  try {
    const decoded = await auth.verifyIdToken(idToken, true);
    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      admin: decoded.admin === true,
    };
  } catch (err) {
    logger.warn({ err }, "Firebase token verification failed");
    return null;
  }
}

async function syncFirebaseUser(firebase: FirebaseTokenPayload): Promise<{ user: typeof usersTable.$inferSelect; isNew: boolean }> {
  let user = (await db.select().from(usersTable).where(eq(usersTable.firebaseUid, firebase.uid)))[0];
  let isNew = false;

  const email = firebase.email ?? "";
  const name = firebase.name ?? null;
  const picture = firebase.picture ?? null;
  const isAdmin = firebase.admin === true;

  if (!user) {
    // Check if a legacy email-only user exists and link it to the Firebase UID.
    const byEmail = email ? (await db.select().from(usersTable).where(eq(usersTable.email, email)))[0] : undefined;
    if (byEmail) {
      const [updated] = await db
        .update(usersTable)
        .set({ firebaseUid: firebase.uid, name: byEmail.name ?? name, picture: byEmail.picture ?? picture, isAdmin: byEmail.isAdmin || isAdmin, updatedAt: new Date() })
        .where(eq(usersTable.id, byEmail.id))
        .returning();
      user = updated!;
    } else {
      const [created] = await db
        .insert(usersTable)
        .values({ firebaseUid: firebase.uid, email, name, picture, isAdmin, username: null })
        .returning();
      user = created!;
      isNew = true;
    }
  } else if (user.name !== name || user.picture !== picture || user.isAdmin !== isAdmin) {
    const [updated] = await db
      .update(usersTable)
      .set({ name, picture, isAdmin, updatedAt: new Date() })
      .where(eq(usersTable.id, user.id))
      .returning();
    user = updated!;
  }

  return { user, isNew };
}

// ─── Firebase Session Exchange ────────────────────────────────────────────────

const FirebaseSessionBodySchema = z.object({ idToken: z.string().min(1) });

router.post("/auth/session", async (req: Request, res: Response) => {
  const parsed = FirebaseSessionBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Firebase ID token is required" });
    return;
  }

  const firebase = await verifyFirebaseToken(parsed.data.idToken);
  if (!firebase) {
    res.status(401).json({ error: "Invalid Firebase credentials" });
    return;
  }

  try {
    const { user, isNew } = await syncFirebaseUser(firebase);
    const token = signToken(user.id, user.email, user.isAdmin, user.firebaseUid ?? firebase.uid);
    req.log.info({ userId: user.id, firebaseUid: firebase.uid }, isNew ? "Firebase user registered" : "Firebase sign-in successful");
    res.json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    req.log.error({ err }, "Firebase session creation failed");
    res.status(500).json({ error: "Sign-in failed. Please try again." });
  }
});

// Legacy Google route — now expects a Firebase ID token obtained from Google sign-in.
router.post("/auth/google", async (req: Request, res: Response) => {
  const parsed = FirebaseSessionBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Firebase ID token is required" });
    return;
  }

  const firebase = await verifyFirebaseToken(parsed.data.idToken);
  if (!firebase) {
    res.status(401).json({ error: "Invalid Firebase credentials" });
    return;
  }

  try {
    const { user, isNew } = await syncFirebaseUser(firebase);
    const token = signToken(user.id, user.email, user.isAdmin, user.firebaseUid ?? firebase.uid);
    req.log.info({ userId: user.id, firebaseUid: firebase.uid }, isNew ? "Google user registered via Firebase" : "Google sign-in via Firebase successful");
    res.json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    req.log.error({ err }, "Google/Firebase session creation failed");
    res.status(500).json({ error: "Sign-in failed. Please try again." });
  }
});

// ─── Bootstrap Admin ──────────────────────────────────────────────────────────

const BootstrapAdminBodySchema = z.object({ uid: z.string().min(1), setupKey: z.string().min(1) });

router.post("/auth/admin/bootstrap", async (req: Request, res: Response) => {
  const parsed = BootstrapAdminBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "UID and setup key are required" });
    return;
  }

  if (!SETUP_KEY) {
    res.status(503).json({ error: "Admin bootstrap is not enabled. Set FIREBASE_ADMIN_SETUP_KEY." });
    return;
  }
  if (parsed.data.setupKey !== SETUP_KEY) {
    res.status(403).json({ error: "Invalid setup key" });
    return;
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    res.status(503).json({ error: "Authentication service is not configured" });
    return;
  }

  try {
    await auth.setCustomUserClaims(parsed.data.uid, { admin: true });
    // Sync local DB if the user already exists.
    const user = (await db.select().from(usersTable).where(eq(usersTable.firebaseUid, parsed.data.uid)))[0];
    if (user) {
      await db.update(usersTable).set({ isAdmin: true, updatedAt: new Date() }).where(eq(usersTable.id, user.id));
    }
    logger.info({ uid: parsed.data.uid }, "Admin bootstrapped via setup key");
    res.json({ success: true, message: "Admin claim set" });
  } catch (err) {
    req.log.error({ err }, "Admin bootstrap failed");
    res.status(500).json({ error: "Failed to set admin claim" });
  }
});

// ─── Admin User Management ──────────────────────────────────────────────────────

router.post("/auth/admin/users/:uid/set-admin", requireAdmin, async (req: Request, res: Response) => {
  const uid = Array.isArray(req.params.uid) ? req.params.uid[0] : req.params.uid;
  if (!uid) { res.status(400).json({ error: "UID is required" }); return; }
  const auth = getFirebaseAuth();
  if (!auth) {
    res.status(503).json({ error: "Authentication service is not configured" });
    return;
  }

  try {
    await auth.setCustomUserClaims(uid, { admin: true });
    const user = (await db.select().from(usersTable).where(eq(usersTable.firebaseUid, uid)))[0];
    if (user) {
      await db.update(usersTable).set({ isAdmin: true, updatedAt: new Date() }).where(eq(usersTable.id, user.id));
    }
    logger.info({ uid, adminId: req.auth!.userId }, "Admin claim set by admin");
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Set admin claim failed");
    res.status(500).json({ error: "Failed to set admin claim" });
  }
});

router.post("/auth/admin/users/:uid/revoke-admin", requireAdmin, async (req: Request, res: Response) => {
  const uid = Array.isArray(req.params.uid) ? req.params.uid[0] : req.params.uid;
  if (!uid) { res.status(400).json({ error: "UID is required" }); return; }
  const auth = getFirebaseAuth();
  if (!auth) {
    res.status(503).json({ error: "Authentication service is not configured" });
    return;
  }

  // Prevent self-revocation.
  if (req.auth!.firebaseUid === uid) {
    res.status(400).json({ error: "You cannot revoke your own admin access" });
    return;
  }

  try {
    await auth.setCustomUserClaims(uid, { admin: false });
    const user = (await db.select().from(usersTable).where(eq(usersTable.firebaseUid, uid)))[0];
    if (user) {
      await db.update(usersTable).set({ isAdmin: false, updatedAt: new Date() }).where(eq(usersTable.id, user.id));
    }
    logger.info({ uid, adminId: req.auth!.userId }, "Admin claim revoked");
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Revoke admin claim failed");
    res.status(500).json({ error: "Failed to revoke admin claim" });
  }
});

// ─── Current User ───────────────────────────────────────────────────────────────

router.get("/auth/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const users = await db.select().from(usersTable).where(eq(usersTable.id, req.auth!.userId));
    const user = users[0];
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(safeUser(user));
  } catch (err) {
    req.log.error({ err }, "Auth/me failed");
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
