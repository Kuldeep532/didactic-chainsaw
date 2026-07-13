import { Router, type IRouter, type Request, type Response } from "express";
import { db, contactMessagesTable, supportRequestsTable, blogPostsTable, usersTable, datasetsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { scrapeRssArticles, slugify } from "../lib/rss-scraper";
import { attachAuth, requireAdmin } from "../middlewares/require-auth";

const router: IRouter = Router();
const guard = [attachAuth, requireAdmin] as const;

// ─── Contact Messages ─────────────────────────────────────────────────────────

router.get("/admin/contact-messages", ...guard, async (_req: Request, res: Response) => {
  const items = await db.select().from(contactMessagesTable).orderBy(desc(contactMessagesTable.createdAt));
  res.json(items);
});

// ─── Support Requests ─────────────────────────────────────────────────────────

router.get("/admin/support-requests", ...guard, async (_req: Request, res: Response) => {
  const items = await db.select().from(supportRequestsTable).orderBy(desc(supportRequestsTable.createdAt));
  res.json(items);
});

// ─── Blog Scraping ────────────────────────────────────────────────────────────

router.post("/admin/scrape-blog", ...guard, async (req: Request, res: Response) => {
  const feeds = req.body?.feeds || undefined;
  const articles = await scrapeRssArticles(feeds);

  const inserted = [];
  for (const article of articles) {
    const slug = slugify(article.title);
    if (!slug) continue;

    const [existing] = await db
      .select({ id: blogPostsTable.id })
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, slug))
      .limit(1);
    if (existing) continue;

    const [created] = await db
      .insert(blogPostsTable)
      .values({
        title: article.title,
        slug,
        content: `${article.description}\n\n*Source: [${article.title}](${article.link})*`,
        excerpt: article.description.slice(0, 240),
        category: "News",
        published: true,
      })
      .returning();
    inserted.push(created);
  }

  req.log.info({ insertedCount: inserted.length }, "RSS blog scrape completed");
  res.json({ insertedCount: inserted.length, posts: inserted });
});

// ─── Blog Management ─────────────────────────────────────────────────────────

router.patch("/admin/blog-posts/:id/publish", ...guard, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid post id" }); return; }
  const published = Boolean(req.body?.published ?? true);
  const [updated] = await db.update(blogPostsTable).set({ published }).where(eq(blogPostsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Post not found" }); return; }
  res.json(updated);
});

router.delete("/admin/blog-posts/:id", ...guard, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid post id" }); return; }
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
  res.json({ success: true });
});

// ─── Users ────────────────────────────────────────────────────────────────────

router.get("/admin/users", ...guard, async (_req: Request, res: Response) => {
  const users = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      username: usersTable.username,
      name: usersTable.name,
      isAdmin: usersTable.isAdmin,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt));
  res.json(users);
});

router.patch("/admin/users/:id/role", ...guard, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid user id" }); return; }
  const isAdmin = Boolean(req.body?.isAdmin);
  const [updated] = await db.update(usersTable).set({ isAdmin }).where(eq(usersTable.id, id)).returning({
    id: usersTable.id, email: usersTable.email, isAdmin: usersTable.isAdmin,
  });
  if (!updated) { res.status(404).json({ error: "User not found" }); return; }
  res.json(updated);
});

// ─── AI Training: Datasets ────────────────────────────────────────────────────

router.get("/admin/datasets", ...guard, async (_req: Request, res: Response) => {
  const items = await db.select().from(datasetsTable).orderBy(desc(datasetsTable.createdAt));
  res.json(items);
});

router.patch("/admin/datasets/:id/status", ...guard, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid dataset id" }); return; }
  const status = req.body?.status;
  if (!["active", "inactive"].includes(status)) { res.status(400).json({ error: "Status must be active or inactive" }); return; }
  const [updated] = await db.update(datasetsTable).set({ status, updatedAt: new Date() }).where(eq(datasetsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Dataset not found" }); return; }
  res.json(updated);
});

router.delete("/admin/datasets/:id", ...guard, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) { res.status(400).json({ error: "Invalid dataset id" }); return; }
  await db.delete(datasetsTable).where(eq(datasetsTable.id, id));
  res.json({ success: true });
});

export default router;
