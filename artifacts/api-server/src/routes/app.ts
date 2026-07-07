import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod/v4";
import { createHash } from "crypto";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * Mobile-app verification, remote config, and update controls.
 * All endpoints are public so the mobile apps can call them before the user
 * authenticates. Security is provided by challenge signatures and certificate
 * pinning in the apps.
 */

// ─── App Version / Remote Config ──────────────────────────────────────────────

router.get("/v1/config", (_req: Request, res: Response) => {
  const baseUrl = process.env.BASE_URL ?? "";
  res.json({
    baseUrl,
    minimumSupportedVersion: process.env.MINIMUM_SUPPORTED_VERSION ?? "1.0.0",
    latestVersion: process.env.LATEST_VERSION ?? "1.0.0",
    updateUrl: process.env.UPDATE_URL ?? `${baseUrl}/apps`,
    maintenanceMode: process.env.MAINTENANCE_MODE === "true",
    firebaseProjectId: process.env.VITE_FIREBASE_PROJECT_ID ?? process.env.FIREBASE_ADMIN_PROJECT_ID ?? null,
    authProviders: ["email", "google"],
  });
});

// ─── App Verification Challenge ─────────────────────────────────────────────────

const ChallengeRequestSchema = z.object({
  appId: z.string().min(1),
  packageName: z.string().min(1),
  certificateFingerprint: z.string().min(1),
  nonce: z.string().min(1),
});

interface ActiveChallenge {
  challenge: string;
  expiresAt: number;
}

const challenges = new Map<string, ActiveChallenge>();
const CHALLENGE_TTL_MS = 5 * 60 * 1000;

function cleanExpiredChallenges() {
  const now = Date.now();
  for (const [key, value] of challenges.entries()) {
    if (value.expiresAt < now) challenges.delete(key);
  }
}

function computeSignature(challenge: string, fingerprint: string): string {
  return createHash("sha256").update(`${challenge}:${fingerprint}`).digest("hex");
}

router.post("/v1/app/challenge", (req: Request, res: Response) => {
  const parsed = ChallengeRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid challenge request" });
    return;
  }

  const { appId, packageName, certificateFingerprint, nonce } = parsed.data;
  const expectedFingerprints = (process.env.ANDROID_CERTIFICATE_FINGERPRINTS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (expectedFingerprints.length > 0 && !expectedFingerprints.includes(certificateFingerprint.toLowerCase())) {
    res.status(403).json({ error: "Certificate fingerprint not recognised" });
    return;
  }

  const challenge = createHash("sha256").update(`${appId}:${packageName}:${nonce}:${Date.now()}:${process.env.SESSION_SECRET ?? "dev-secret"}`).digest("hex");
  const key = `${appId}:${packageName}`;
  challenges.set(key, { challenge, expiresAt: Date.now() + CHALLENGE_TTL_MS });
  cleanExpiredChallenges();

  logger.info({ appId, packageName }, "App verification challenge issued");
  res.json({ challenge, expiresIn: CHALLENGE_TTL_MS / 1000 });
});

const VerifyChallengeSchema = z.object({
  appId: z.string().min(1),
  packageName: z.string().min(1),
  challenge: z.string().min(1),
  signature: z.string().min(1),
});

router.post("/v1/app/verify", (req: Request, res: Response) => {
  const parsed = VerifyChallengeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid verification request" });
    return;
  }

  const { appId, packageName, challenge, signature } = parsed.data;
  const key = `${appId}:${packageName}`;
  const stored = challenges.get(key);
  if (!stored || stored.challenge !== challenge || stored.expiresAt < Date.now()) {
    res.status(401).json({ error: "Challenge expired or invalid" });
    return;
  }

  const expectedFingerprints = (process.env.ANDROID_CERTIFICATE_FINGERPRINTS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (expectedFingerprints.length === 0) {
    res.status(503).json({ error: "App verification is not configured" });
    return;
  }

  const valid = expectedFingerprints.some((fp) => computeSignature(challenge, fp) === signature.toLowerCase());
  if (!valid) {
    logger.warn({ appId, packageName }, "App verification signature mismatch");
    res.status(403).json({ error: "Invalid challenge signature" });
    return;
  }

  challenges.delete(key);
  res.json({ verified: true, token: createHash("sha256").update(`${challenge}:${process.env.SESSION_SECRET ?? "dev-secret"}`).digest("hex") });
});

export default router;
