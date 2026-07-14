import { initializeApp, cert, getApps, App, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { logger } from "./logger";

let firebaseApp: App | null = null;

function loadServiceAccount(): ServiceAccount | null {
  const json = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
  if (json) {
    try {
      const parsed = JSON.parse(json) as ServiceAccount & { private_key?: string; privateKey?: string };
      // Some providers store private_key as snake_case; normalise it.
      if (parsed.private_key && !parsed.privateKey) {
        parsed.privateKey = parsed.private_key;
      }
      return parsed;
    } catch (err) {
      logger.error({ err }, "FIREBASE_ADMIN_SERVICE_ACCOUNT is not valid JSON");
      return null;
    }
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (projectId && clientEmail && rawKey) {
    return {
      projectId,
      clientEmail,
      privateKey: rawKey.replace(/\\n/g, "\n"),
    } as ServiceAccount;
  }

  return null;
}

export function initFirebase(): App | null {
  if (firebaseApp) return firebaseApp;
  if (getApps().length > 0) {
    firebaseApp = getApps()[0]!;
    return firebaseApp;
  }

  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    logger.warn("Firebase Admin SDK not configured. Set FIREBASE_ADMIN_SERVICE_ACCOUNT or the split FIREBASE_ADMIN_* variables.");
    return null;
  }

  try {
    firebaseApp = initializeApp({ credential: cert(serviceAccount) });
    logger.info("Firebase Admin SDK initialised");
  } catch (err) {
    logger.error({ err }, "Failed to initialise Firebase Admin SDK");
    return null;
  }

  // Ensure configured UIDs receive the admin claim on startup.
  syncAdminClaims().catch((err) => logger.error({ err }, "Failed to sync admin claims"));

  return firebaseApp;
}

export function getFirebaseApp(): App | null {
  return firebaseApp ?? initFirebase();
}

export function getFirebaseAuth() {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}

export async function syncAdminClaims(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;

  const raw = process.env.FIREBASE_ADMIN_UIDS;
  if (!raw) return;

  const uids = raw.split(",").map((s) => s.trim()).filter(Boolean);
  await Promise.all(
    uids.map(async (uid) => {
      try {
        await auth.setCustomUserClaims(uid, { admin: true });
        logger.info({ uid }, "Set admin claim");
      } catch (err) {
        logger.warn({ err, uid }, "Could not set admin claim");
      }
    }),
  );
}
