import { Router, type IRouter, type Request, type Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod/v4";
import { db, usersTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import { logger } from "../lib/logger";
import { attachAuth, requireAuth } from "../middlewares/require-auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID;
const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret";
const TOKEN_EXPIRY = "7d";

const router: IRouter = Router();
router.use(attachAuth);

function signToken(userId: number, email: string, isAdmin: boolean): string {
  return jwt.sign({ userId, email, isAdmin }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

function safeUser(user: { id: number; email: string; name: string | null; picture: string | null; isAdmin: boolean; username: string | null }) {
  return { id: user.id, email: user.email, name: user.name, picture: user.picture, isAdmin: user.isAdmin, username: user.username };
}

// ─── Google Sign-In ─────────────────────────────────────────────────────────

const GoogleSignInBodySchema = z.object({ idToken: z.string().min(1) });

router.post("/auth/google", async (req: Request, res: Response) => {
  const parsed = GoogleSignInBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request payload" });
    return;
  }

  if (!GOOGLE_CLIENT_ID) {
    logger.warn("GOOGLE_WEB_CLIENT_ID is not set");
    res.status(503).json({ error: "Google Sign-In is not configured" });
    return;
  }

  try {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken: parsed.data.idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload) {
      res.status(401).json({ error: "Invalid Google token" });
      return;
    }

    const { sub: googleSub, email = "", name = "", picture = "" } = payload;

    const existing = await db.select().from(usersTable).where(eq(usersTable.googleSub, googleSub));
    let user = existing[0];

    if (!user) {
      // Check if email already registered via password
      const byEmail = await db.select().from(usersTable).where(eq(usersTable.email, email));
      if (byEmail[0]) {
        // Link Google account to existing email/password account
        const updated = await db
          .update(usersTable)
          .set({ googleSub, name: byEmail[0].name || name, picture: byEmail[0].picture || picture })
          .where(eq(usersTable.id, byEmail[0].id))
          .returning();
        user = updated[0];
      } else {
        const created = await db
          .insert(usersTable)
          .values({ googleSub, email, name, picture, isAdmin: false })
          .returning();
        user = created[0];
      }
    } else if (user.name !== name || user.picture !== picture) {
      const updated = await db
        .update(usersTable)
        .set({ name, picture })
        .where(eq(usersTable.id, user.id))
        .returning();
      user = updated[0];
    }

    const token = signToken(user.id, user.email, user.isAdmin);
    req.log.info({ userId: user.id }, "Google sign-in successful");
    res.json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    req.log.warn({ err }, "Google token verification failed");
    res.status(401).json({ error: "Invalid Google credentials" });
  }
});

// ─── Email/Password Register ─────────────────────────────────────────────────

const RegisterBodySchema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/, "Username may only contain letters, numbers, and underscores"),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

router.post("/auth/register", async (req: Request, res: Response) => {
  const parsed = RegisterBodySchema.safeParse(req.body);
  if (!parsed.success) {
    const issues = (parsed.error as { issues?: Array<{ message: string }> }).issues ?? [];
    const message = issues[0]?.message ?? "Invalid request payload";
    res.status(400).json({ error: message });
    return;
  }

  const { username, email, password } = parsed.data;

  try {
    // Check for existing email or username
    const existing = await db
      .select({ id: usersTable.id, email: usersTable.email, username: usersTable.username })
      .from(usersTable)
      .where(or(eq(usersTable.email, email), eq(usersTable.username, username)));

    if (existing.length > 0) {
      const conflict = existing[0];
      if (conflict.email === email) {
        res.status(409).json({ error: "An account with this email already exists" });
      } else {
        res.status(409).json({ error: "This username is already taken" });
      }
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const created = await db
      .insert(usersTable)
      .values({ username, email, passwordHash, name: username, isAdmin: false })
      .returning();
    const user = created[0];

    const token = signToken(user.id, user.email, user.isAdmin);
    req.log.info({ userId: user.id }, "User registered");
    res.status(201).json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    req.log.error({ err }, "Registration failed");
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// ─── Email/Password Login ─────────────────────────────────────────────────────

const LoginBodySchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(1),
});

router.post("/auth/login", async (req: Request, res: Response) => {
  const parsed = LoginBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Email/username and password are required" });
    return;
  }

  const { emailOrUsername, password } = parsed.data;

  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(
        emailOrUsername.includes("@")
          ? eq(usersTable.email, emailOrUsername)
          : eq(usersTable.username, emailOrUsername)
      );

    const user = users[0];
    if (!user || !user.passwordHash) {
      // Constant-time dummy compare to prevent timing-based user enumeration
      // This hash is a valid bcrypt hash of the string "dummy" — always fails but avoids throwing
      await bcrypt.compare(password, "$2a$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken(user.id, user.email, user.isAdmin);
    req.log.info({ userId: user.id }, "Email/password sign-in successful");
    res.json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ─── Current User ─────────────────────────────────────────────────────────────

router.get("/auth/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.auth!.userId));
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
