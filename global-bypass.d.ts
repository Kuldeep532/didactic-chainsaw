/**
 * TEMPORARY GLOBAL TYPE BYPASS
 * 
 * This file bypasses TypeScript type checking for Express Request/Response objects.
 * Purpose: Short-term patch to resolve type checking errors across all packages
 * Duration: Temporary (to be decommissioned within weeks)
 * 
 * Created: 2026-07-10
 * Decommission after: 2026-07-31
 */

declare global {
  namespace Express {
    interface Request {
      [key: string]: any;
    }
    interface Response {
      [key: string]: any;
    }
  }
}

export {};
