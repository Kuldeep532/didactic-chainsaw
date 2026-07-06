import { Router, type IRouter, type Request, type Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { GoogleSignInBody } from "@workspace/api-zod";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID;
const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret";

const router: IRouter = Router();

router.post("/auth/google", async (req: Request, res: Response) => {
  const parsed = GoogleSignInBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid Google token payload" });
    return;
  }

  if (!GOOGLE_CLIENT_ID) {
    logger.warn("GOOGLE_WEB_CLIENT_ID is not set");
    res.status(500).json({ error: "Google Sign-In is not configured" });
    return;
  }

  try {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: parsed.data.idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      res.status(401).json({ error: "Invalid Google token" });
      return;
    }

    const googleSub = payload.sub;
    const email = payload.email || "";
    const name = payload.name || "";
    const picture = payload.picture || "";

    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.googleSub, googleSub));

    let user = existing[0];
    if (!user) {
      const created = await db
        .insert(usersTable)
        .values({ googleSub, email, name, picture, isAdmin: false })
        .returning();
      user = created[0];
    } else if (user.name !== name || user.picture !== picture) {
      const updated = await db
        .update(usersTable)
        .set({ name, picture })
        .where(eq(usersTable.id, user.id))
        .returning();
      user = updated[0];
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    req.log.info({ userId: user.id }, "Google sign-in successful");
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    req.log.warn({ err }, "Google token verification failed");
    res.status(401).json({ error: "Invalid Google token" });
  }
});

router.get("/auth/me", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      isAdmin: boolean;
    };
    res.json({
      id: decoded.userId,
      email: decoded.email,
      isAdmin: decoded.isAdmin,
    });
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;
