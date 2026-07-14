import { Router, type IRouter, type Request, type Response } from "express";
import type { PublicConfig } from "@workspace/api-zod";

const router: IRouter = Router();

const PUBLIC_CONFIG: PublicConfig = {
  companyName: "Nexus Wave Technologies",
  tagline: "High-efficiency barrier-free utilities for everyone",
  contactEmail: "info@nexusweb.co.in",
  apps: [
    {
      id: "nexus-plus",
      name: "Nexus Plus",
      packageId: "com.nexuswavetech.nexusplus",
      description: "Enhanced features and seamless integration",
    },
    {
      id: "geeta-nexus",
      name: "Geeta Nexus",
      packageId: "com.nexuswavetech.geetanexus",
      description: "Spiritual wisdom meets modern technology",
    },
  ],
};

router.get("/public-config", (_req: Request, res: Response) => {
  res.json(PUBLIC_CONFIG);
});

export default router;
