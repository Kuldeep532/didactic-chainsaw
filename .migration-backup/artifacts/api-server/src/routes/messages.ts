import { Router, type IRouter, type Request, type Response } from "express";
import { db, globalMessagesTable } from "@workspace/db";
import { desc, eq, and, gte, lte } from "drizzle-orm";
import { insertGlobalMessageSchema } from "@workspace/db/schema";
import { attachAuth, requireAdmin } from "../middlewares/require-auth";

const router: IRouter = Router();
const guard = [attachAuth, requireAdmin] as const;

// ─── Public: Active Messages ─────────────────────────────────────────────────
// Returns only messages that are enabled, started, and not yet expired.
// Clients may optionally pass `?target=website` to filter by target audience.

router.get("/messages", async (req: Request, res: Response) => {
  const target = typeof req.query.target === "string" ? req.query.target : "all";
  const now = new Date();

  const items = await db
    .select()
    .from(globalMessagesTable)
    .where(
      and(
        eq(globalMessagesTable.enabled, true),
        lte(globalMessagesTable.startsAt, now),
        gte(globalMessagesTable.expiresAt, now),
        target === "all" ? undefined : eq(globalMessagesTable.target, "all")
      )
    )
    .orderBy(desc(globalMessagesTable.createdAt));

  // Additional filter: keep messages that target the requested audience or all
  const filtered = target === "all"
    ? items
    : items.filter((m) => m.target === "all" || m.target === target);

  res.json(filtered);
});

// ─── Admin: List All Messages ────────────────────────────────────────────────

router.get("/admin/messages", ...guard, async (_req: Request, res: Response) => {
  const items = await db
    .select()
    .from(globalMessagesTable)
    .orderBy(desc(globalMessagesTable.createdAt));
  res.json(items);
});

// ─── Admin: Create Message ───────────────────────────────────────────────────

router.post("/admin/messages", ...guard, async (req: Request, res: Response) => {
  const parsed = insertGlobalMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid message payload" });
    return;
  }

  const [created] = await db
    .insert(globalMessagesTable)
    .values(parsed.data)
    .returning();

  req.log.info({ messageId: created.id }, "Global message created");
  res.status(201).json(created);
});

// ─── Admin: Update Message ───────────────────────────────────────────────────

router.patch("/admin/messages/:id", ...guard, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid message id" }); return; }

  const raw = req.body as Partial<{
    title: string;
    message: string;
    target: string;
    enabled: boolean;
    startsAt: string;
    expiresAt: string;
    actionUrl: string;
    kind: string;
  }>;

  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (raw.title !== undefined) update.title = raw.title;
  if (raw.message !== undefined) update.message = raw.message;
  if (raw.target !== undefined) update.target = raw.target;
  if (raw.enabled !== undefined) update.enabled = raw.enabled;
  if (raw.actionUrl !== undefined) update.actionUrl = raw.actionUrl;
  if (raw.kind !== undefined) update.kind = raw.kind;
  if (raw.startsAt !== undefined) update.startsAt = new Date(raw.startsAt);
  if (raw.expiresAt !== undefined) update.expiresAt = new Date(raw.expiresAt);

  const [updated] = await db
    .update(globalMessagesTable)
    .set(update)
    .where(eq(globalMessagesTable.id, id))
    .returning();

  if (!updated) { res.status(404).json({ error: "Message not found" }); return; }
  res.json(updated);
});

// ─── Admin: Delete Message ───────────────────────────────────────────────────

router.delete("/admin/messages/:id", ...guard, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid message id" }); return; }
  await db.delete(globalMessagesTable).where(eq(globalMessagesTable.id, id));
  res.json({ success: true });
});

export default router;
