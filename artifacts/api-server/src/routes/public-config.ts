import { Router, type IRouter, type Request, type Response } from "express";
import type { PublicConfig } from "@workspace/api-zod";

const router: IRouter = Router();

const PUBLIC_CONFIG: PublicConfig = {
  companyName: "Nexus Wave Technologies",
  tagline: "User-friendly software for accessibility, AI, productivity and spiritual learning",
  contactEmail: "info@nexusweb.co.in",
  apps: [
    {
      id: "nexus-plus",
      name: "Nexus Plus",
      packageId: "com.nexuswavetech.nexusplus",
      description: "AI, media, audio, PDF, e-paper, accessibility and everyday utility features in one Android app.",
    },
    {
      id: "geeta-nexus",
      name: "Geeta Nexus",
      packageId: "com.nexuswavetech.geetanexus",
      description: "An accessible Bhagavad Gita reading experience for Sanskrit, Hindi and English spiritual study.",
    },
  ],
};

router.get("/public-config", (_req: Request, res: Response) => {
  res.json(PUBLIC_CONFIG);
});

export default router;
