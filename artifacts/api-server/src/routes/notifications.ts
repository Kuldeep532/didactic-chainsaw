import { Router, type IRouter, type Request, type Response } from "express";
import { CreateNotificationBody } from "@workspace/api-zod";
import { db, notificationsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

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

router.post("/notifications", async (req: Request, res: Response) => {
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

export default router;
