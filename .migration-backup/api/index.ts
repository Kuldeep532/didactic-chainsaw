/**
 * Vercel Serverless Function Entrypoint
 *
 * This file is the single entry point for all /api/* routes on Vercel.
 * It imports the Express app from the api-server package and exports it
 * as the default handler. Vercel's @vercel/node runtime handles the
 * Express<->Serverless bridging automatically.
 *
 * Route: /api/(*) → rewrites to this function via vercel.json
 */
import app from "../artifacts/api-server/src/app";

export default app;
