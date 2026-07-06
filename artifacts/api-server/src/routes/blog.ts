import { Router, type IRouter, type Request, type Response } from "express";
import { CreateBlogPostBody } from "@workspace/api-zod";
import { db, blogPostsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/blog-posts", async (req: Request, res: Response) => {
  const items = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.published, true))
    .orderBy(desc(blogPostsTable.createdAt))
    .limit(50);
  res.json(items);
});

router.get("/blog-posts/:slug", async (req: Request, res: Response) => {
  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, String(req.params.slug)));

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(post);
});

router.post("/blog-posts", async (req: Request, res: Response) => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid blog post payload" });
    return;
  }

  const [created] = await db
    .insert(blogPostsTable)
    .values(parsed.data)
    .returning();

  req.log.info({ blogPostId: created.id }, "Blog post created");
  res.status(201).json(created);
});

export default router;
