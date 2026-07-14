import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod/v4";
import { logger } from "../lib/logger";
import { attachAuth, requireAuth } from "../middlewares/require-auth";

/**
 * Dynamic API proxy service definition.
 * Example env value (single-line JSON):
 *   API_SERVICE_GEMINI={"baseUrl":"https://generativelanguage.googleapis.com/v1beta","authType":"queryKey","authKeyName":"key","secret":"GEMINI_API_KEY"}
 */
interface ProxyService {
  baseUrl: string;
  authType: "bearer" | "queryKey" | "header" | "none";
  authKeyName?: string;
  headerName?: string;
  secret?: string;
  allowedOperations?: string[];
  allowedMethods?: string[];
}

function loadService(name: string): ProxyService | null {
  const envKey = `API_SERVICE_${name.toUpperCase()}`;
  const raw = process.env[envKey];
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProxyService;
  } catch (err) {
    logger.error({ err, service: name }, `Invalid JSON in ${envKey}`);
    return null;
  }
}

function resolveSecret(service: ProxyService): string | null {
  if (!service.secret) return null;
  const value = process.env[service.secret];
  if (!value) {
    logger.warn({ secret: service.secret }, "Proxy service secret not found in environment");
  }
  return value ?? null;
}

const router: IRouter = Router();

router.all("/v1/proxy/:service/*operation", attachAuth, requireAuth, async (req: Request, res: Response) => {
  const service = req.params.service as string;
  const rawOperation = req.params.operation;
  // `*operation` is captured as a string when it matches the rest of the path.
  const operation = typeof rawOperation === "string" ? rawOperation : Array.isArray(rawOperation) ? rawOperation.join("/") : undefined;
  const config = loadService(service);
  if (!config) {
    res.status(404).json({ error: "Unknown service" });
    return;
  }

  const method = (req.method ?? "GET").toUpperCase();
  if (config.allowedMethods && !config.allowedMethods.includes(method)) {
    res.status(405).json({ error: "Method not allowed for this service" });
    return;
  }

  if (config.allowedOperations && operation && !config.allowedOperations.includes(operation)) {
    res.status(403).json({ error: "Operation not allowed for this service" });
    return;
  }

  const targetUrl = new URL(`${config.baseUrl.replace(/\/$/, "")}/${operation ? operation.replace(/^\//, "") : ""}`);

  // Merge query parameters from the incoming request, but never forward sensitive keys.
  for (const [key, value] of Object.entries(req.query)) {
    if (key.toLowerCase() !== "key" && value !== undefined && value !== "") {
      targetUrl.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = {};
  const secret = resolveSecret(config);

  if (config.authType === "bearer" && secret) {
    headers["Authorization"] = `Bearer ${secret}`;
  } else if (config.authType === "header" && secret && config.headerName) {
    headers[config.headerName] = secret;
  } else if (config.authType === "queryKey" && secret && config.authKeyName) {
    targetUrl.searchParams.set(config.authKeyName, secret);
  }

  // Forward safe headers only.
  const safeHeaders = ["content-type", "accept", "accept-encoding"];
  for (const key of safeHeaders) {
    const value = req.headers[key];
    if (value) headers[key] = String(value);
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      method,
      headers,
      body: ["GET", "HEAD", "OPTIONS"].includes(method) ? undefined : JSON.stringify(req.body),
    });

    res.status(response.status);
    response.headers.forEach((value, key) => {
      // Do not forward cookies or auth headers from the upstream.
      if (!["set-cookie", "authorization", "www-authenticate"].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    const body = await response.text();
    res.send(body);
  } catch (err) {
    logger.error({ err, service, operation }, "Proxy request failed");
    res.status(502).json({ error: "Proxy request failed" });
  }
});

export default router;
