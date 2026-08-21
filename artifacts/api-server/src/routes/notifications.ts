import { Router, type IRouter, type Request, type Response } from "express";
import { CreateNotificationBody } from "@workspace/api-zod";
import { db, notificationsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { attachAuth, requireAuth, requireAdmin } from "../middlewares/require-auth";
import { z } from "zod/v4";
import { userDevicesTable } from "@workspace/db";
import { dispatchNotification, removeDeviceToken } from "../lib/notification-service";
import { eq } from "drizzle-orm";

type SseClient = { res: Response; channel: string | null };
const sseClients: SseClient[] = [];

export function broadcastNotification(channel: string, notification: unknown): void {
  const payload = JSON.stringify(notification);
  for (const client of sseClients) {
    if (!client.channel || client.channel === channel) {
      client.res.write(`event: notification\n`);
      client.res.write(`data: ${payload}\n\n`);
    }
  }
}

const router: IRouter = Router();

/**
 * GET /ws/notifications
 * Returns the WebSocket/SSE URL and supported channels for real-time notifications.
 * Implements the OpenAPI operationId `getWsUrl`.
 */
router.get("/ws/notifications", (req: Request, res: Response) => {
  const base = process.env.BASE_URL ?? `${req.protocol}://${req.get("host")}`;
  res.json({
    wsUrl: `${base}/api/notifications/stream`,
    channels: ["all", "nexus_plus", "geeta_nexus", "system"],
  });
});

router.get("/notifications/stream", (req: Request, res: Response) => {
  const channel = req.query.channel as string | undefined;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const client: SseClient = { res, channel: channel || null };
  sseClients.push(client);

  res.write(`event: connected\n`);
  res.write(
    `data: ${JSON.stringify({ message: "Connected", channel: channel || "all" })}\n\n`
  );

  req.on("close", () => {
    const index = sseClients.indexOf(client);
    if (index !== -1) sseClients.splice(index, 1);
  });
});

router.get("/notifications", async (req: Request, res: Response) => {
  const items = await db
    .select()
    .from(notificationsTable)
    .orderBy(desc(notificationsTable.createdAt))
    .limit(50);
  res.json(items);
});

router.post("/notifications", attachAuth, requireAdmin, async (req: Request, res: Response) => {
  const parsed = CreateNotificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid notification payload" });
    return;
  }

  const [created] = await db
    .insert(notificationsTable)
    .values(parsed.data)
    .returning();

  broadcastNotification(created.targetChannel, created);

  req.log.info(
    { notificationId: created.id, channel: created.targetChannel },
    "Notification created and broadcast"
  );
  res.status(201).json(created);
});

const deviceSchema = z.object({
  appId: z.enum(["web", "geeta_nexus", "nexus_plus"]),
  platform: z.enum(["web", "ios", "android"]),
  pushToken: z.string().min(10).max(512),
  origin: z.string().max(512).optional(),
});

router.get("/v1/app/config", async (req: Request, res: Response) => {
  res.json({ apiVersion: "v1", appId: req.query.appId ?? "web", notifications: { stream: "/api/notifications/stream", polling: "/api/v1/notifications" } });
});

router.post("/v1/devices", attachAuth, requireAuth, async (req: Request, res: Response) => {
  const parsed = deviceSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid device registration" }); return; }
  const [existing] = await db.select().from(userDevicesTable).where(eq(userDevicesTable.pushToken, parsed.data.pushToken));
  const values = { ...parsed.data, userId: req.auth!.userId, lastSeenAt: new Date(), updatedAt: new Date() };
  const device = existing ? (await db.update(userDevicesTable).set(values).where(eq(userDevicesTable.id, existing.id)).returning())[0] : (await db.insert(userDevicesTable).values(values).returning())[0];
  res.status(existing ? 200 : 201).json({ deviceId: device?.id });
});

router.delete("/v1/devices/:token", attachAuth, requireAuth, async (req: Request, res: Response) => {
  const token = Array.isArray(req.params.token) ? req.params.token[0] : req.params.token;
  if (token) await removeDeviceToken(decodeURIComponent(token));
  res.status(204).send();
});

const dispatchSchema = z.object({ appId: z.enum(["web", "geeta_nexus", "nexus_plus"]), title: z.string().min(1).max(120), body: z.string().min(1).max(1000), actionUrl: z.string().url().optional(), data: z.record(z.string(), z.unknown()).optional(), audience: z.object({ userIds: z.array(z.number().int()).optional(), pushTokens: z.array(z.string()).optional() }).optional() });
router.post("/v1/notifications/send", attachAuth, requireAdmin, async (req: Request, res: Response) => {
  const parsed = dispatchSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid notification payload" }); return; }
  try { const result = await dispatchNotification(parsed.data); broadcastNotification(parsed.data.appId, result.notification); res.status(201).json(result); } catch (error) { req.log.error({ error }, "Notification dispatch failed"); res.status(502).json({ error: "Notification delivery failed" }); }
});

export default router;
