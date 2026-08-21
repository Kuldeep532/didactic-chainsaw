import { Router, type IRouter, type Request, type Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { z } from "zod/v4";
import { db, usersTable, userDevicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { attachAuth, requireAuth } from "../middlewares/require-auth";

const router: IRouter = Router();
const google = new OAuth2Client();
const sessionSecret = process.env.SESSION_SECRET ?? process.env.SUPABASE_JWT_SECRET;

const bodySchema = z.object({
  idToken: z.string().min(20),
  appId: z.enum(["web", "geeta_nexus", "nexus_plus"]).default("web"),
  platform: z.enum(["web", "ios", "android"]).default("web"),
  pushToken: z.string().max(512).optional(),
  origin: z.string().max(512).optional(),
});

function clientIds() {
  return {
    web: process.env.GOOGLE_WEB_CLIENT_ID,
    geeta_nexus: process.env.GOOGLE_GEETA_NEXUS_CLIENT_ID,
    nexus_plus: process.env.GOOGLE_NEXUS_PLUS_CLIENT_ID,
  };
}

router.post("/v1/auth/google", async (req: Request, res: Response) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success || !sessionSecret) {
    res.status(400).json({ error: "Invalid authentication request" });
    return;
  }
  const expectedAudience = clientIds()[parsed.data.appId];
  if (!expectedAudience) {
    res.status(503).json({ error: "Authentication client is not configured" });
    return;
  }
  try {
    const ticket = await google.verifyIdToken({ idToken: parsed.data.idToken, audience: expectedAudience });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email || payload.email_verified !== true || payload.iss !== "https://accounts.google.com") {
      res.status(401).json({ error: "Invalid Google credentials" });
      return;
    }
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.googleSub, payload.sub));
    const user = existing ?? (await db.insert(usersTable).values({
      googleSub: payload.sub,
      email: payload.email,
      name: payload.name ?? null,
      picture: payload.picture ?? null,
      isAdmin: false,
    }).returning())[0];
    if (!user) throw new Error("Unable to create user");
    if (user.email !== payload.email || user.name !== (payload.name ?? null) || user.picture !== (payload.picture ?? null)) {
      await db.update(usersTable).set({ email: payload.email, name: payload.name ?? null, picture: payload.picture ?? null, updatedAt: new Date() }).where(eq(usersTable.id, user.id));
    }
    if (parsed.data.pushToken) {
      const [device] = await db.select().from(userDevicesTable).where(eq(userDevicesTable.pushToken, parsed.data.pushToken));
      if (device) {
        await db.update(userDevicesTable).set({ userId: user.id, appId: parsed.data.appId, platform: parsed.data.platform, origin: parsed.data.origin ?? null, lastSeenAt: new Date(), updatedAt: new Date() }).where(eq(userDevicesTable.id, device.id));
      } else {
        await db.insert(userDevicesTable).values({ userId: user.id, appId: parsed.data.appId, platform: parsed.data.platform, pushToken: parsed.data.pushToken, origin: parsed.data.origin ?? null });
      }
    }
    const token = jwt.sign({ userId: user.id, email: user.email, isAdmin: user.isAdmin, googleSub: payload.sub, appId: parsed.data.appId }, sessionSecret, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email, name: payload.name ?? user.name, picture: payload.picture ?? user.picture, isAdmin: user.isAdmin }, appId: parsed.data.appId });
  } catch (error) {
    req.log.warn({ error }, "Google token verification failed");
    res.status(401).json({ error: "Invalid Google credentials" });
  }
});

router.get("/v1/auth/me", attachAuth, requireAuth, async (req: Request, res: Response) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.auth!.userId));
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json({ id: user.id, email: user.email, name: user.name, picture: user.picture, isAdmin: user.isAdmin });
});

router.post("/v1/auth/logout", (_req, res) => res.status(204).send());
export default router;
