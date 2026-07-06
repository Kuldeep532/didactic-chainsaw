import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret";

/**
 * Attaches decoded auth payload to req.auth if a valid Bearer JWT is present.
 * Does NOT reject unauthenticated requests — use requireAuth() or requireAdmin()
 * for that.
 */
export function attachAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ") && !header.startsWith("Bearer admin:")) {
    const token = header.slice(7);
    try {
      req.auth = jwt.verify(token, JWT_SECRET) as AuthPayload;
    } catch {
      // invalid token — leave req.auth undefined
    }
  }
  next();
}

/** Rejects requests with no valid JWT. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.auth) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

/** Rejects requests where the authenticated user is not an admin. */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.auth) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  if (!req.auth.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}
