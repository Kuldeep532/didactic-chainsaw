import { Router, type IRouter, type Request, type Response } from "express";
import { db, contactMessagesTable, supportRequestsTable, blogPostsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { scrapeRssArticles, slugify } from "../lib/rss-scraper";

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

router.post("/admin/scrape-blog", async (req: Request, res: Response) => {
  const feeds = req.body?.feeds || undefined;
  const articles = await scrapeRssArticles(feeds);

  const inserted = [];
  for (const article of articles) {
    const slug = slugify(article.title);
    if (!slug) continue;

    // Skip if slug already exists
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

export default router;
