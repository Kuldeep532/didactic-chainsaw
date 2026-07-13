/**
 * Secure Provider Registry
 *
 * Rules:
 *  1. Only providers in PROVIDER_ALLOWLIST may ever be used.
 *  2. A provider is "available" only when ALL required env vars are present AND non-empty.
 *  3. Env var values are NEVER returned to callers — only availability flags.
 *  4. Arbitrary user-supplied URLs are never trusted.
 */

export type ProviderCapability =
  | "chat"
  | "text-generation"
  | "embeddings"
  | "image-generation"
  | "moderation";

export type ProviderType = "ai" | "email" | "search" | "storage";

export interface ProviderMeta {
  id: string;
  name: string;
  type: ProviderType;
  capabilities: ProviderCapability[];
  /** Internal only — never sent to clients */
  _requiredEnvVars: string[];
  /** Used server-side to build base URL — never sent to clients */
  _baseUrl: string;
}

const PROVIDER_ALLOWLIST: ProviderMeta[] = [
  {
    id: "gemini",
    name: "Gemini",
    type: "ai",
    capabilities: ["chat", "text-generation", "embeddings"],
    _requiredEnvVars: ["GEMINI_API_KEY"],
    _baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  },
  {
    id: "openai",
    name: "OpenAI",
    type: "ai",
    capabilities: ["chat", "text-generation", "embeddings", "image-generation", "moderation"],
    _requiredEnvVars: ["OPENAI_API_KEY"],
    _baseUrl: "https://api.openai.com/v1",
  },
];

function isAvailable(meta: ProviderMeta): boolean {
  return meta._requiredEnvVars.every((v) => {
    const val = process.env[v];
    return typeof val === "string" && val.length > 0;
  });
}

/** Returns registered providers with availability flags — no secrets. */
export function getProviderStatus(): Array<{ id: string; name: string; type: ProviderType; capabilities: ProviderCapability[]; available: boolean }> {
  return PROVIDER_ALLOWLIST.map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    capabilities: p.capabilities,
    available: isAvailable(p),
  }));
}

/** Returns internal metadata for an available provider by capability — for server-side use only. */
export function resolveProvider(capability: ProviderCapability, preferredId?: string): ProviderMeta | null {
  const candidates = PROVIDER_ALLOWLIST.filter(
    (p) => p.capabilities.includes(capability) && isAvailable(p),
  );
  if (preferredId) {
    const preferred = candidates.find((p) => p.id === preferredId);
    if (preferred) return preferred;
  }
  return candidates[0] ?? null;
}

/** Returns the API key for an available provider — for server-side use only. */
export function getProviderKey(provider: ProviderMeta): string {
  const keyVar = provider._requiredEnvVars[0];
  const key = process.env[keyVar ?? ""];
  if (!key) throw new Error(`Provider ${provider.id} is not configured`);
  return key;
}
