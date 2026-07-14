import { Router, type IRouter, type Request, type Response } from "express";
import { SubmitContactMessageBody, SubmitSupportRequestBody } from "@workspace/api-zod";
import { db, contactMessagesTable, supportRequestsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/contact-messages", async (req: Request, res: Response) => {
  const parsed = SubmitContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid contact message payload" });
    return;
  }

  const [created] = await db
    .insert(contactMessagesTable)
    .values(parsed.data)
    .returning();

  req.log.info({ contactMessageId: created.id }, "Contact message received");
  res.status(201).json(created);
});

router.post("/support-requests", async (req: Request, res: Response) => {
  const parsed = SubmitSupportRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid support request payload" });
    return;
  }

  const [created] = await db
    .insert(supportRequestsTable)
    .values(parsed.data)
    .returning();

  req.log.info({ supportRequestId: created.id }, "Support request received");
  res.status(201).json(created);
});

export default router;
