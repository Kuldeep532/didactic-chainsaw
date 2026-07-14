// This file serves as the entry point for Vercel's serverless function.
// It imports the pre-built Express app from the api-server package.

import type { VercelRequest, VercelResponse } from "@vercel/node";

// Import the pre-built Express app
import { default as app } from "../artifacts/api-server/dist/index.mjs";

export default async (req: VercelRequest, res: VercelResponse) => {
  return new Promise<void>((resolve) => {
    res.on("finish", resolve);
    app(req, res);
  });
};
