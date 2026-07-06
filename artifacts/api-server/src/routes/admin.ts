import { Router, type IRouter, type Request, type Response } from "express";
import { db, contactMessagesTable, supportRequestsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nexus-admin-2024";

function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer admin:")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const password = authHeader.slice(13);
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

const router: IRouter = Router();
router.use(requireAdmin);

router.get("/admin/contact-messages", async (req: Request, res: Response) => {
  const items = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(desc(contactMessagesTable.createdAt));
  res.json(items);
});

router.get("/admin/support-requests", async (req: Request, res: Response) => {
  const items = await db
    .select()
    .from(supportRequestsTable)
    .orderBy(desc(supportRequestsTable.createdAt));
  res.json(items);
});

export default router;
