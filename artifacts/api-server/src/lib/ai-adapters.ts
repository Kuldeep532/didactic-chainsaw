/**
 * AI Provider Adapters
 * All external AI calls go through these adapters — never called from frontend.
 * Keys are resolved from the server-side provider registry.
 */

import { resolveProvider, getProviderKey } from "./provider-registry";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  text: string;
  provider: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  provider: string;
}

// ─── Gemini ───────────────────────────────────────────────────────────────────

async function geminiChat(messages: ChatMessage[], apiKey: string, baseUrl: string): Promise<string> {
  const model = process.env.GEMINI_CHAT_MODEL || "gemini-1.5-flash";
  const systemMsg = messages.find((m) => m.role === "system");
  const convoMessages = messages.filter((m) => m.role !== "system");

  const contents = convoMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body: Record<string, unknown> = { contents };
  if (systemMsg) {
    body.systemInstruction = { parts: [{ text: systemMsg.content }] };
  }

  const url = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini chat error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function geminiEmbed(text: string, apiKey: string, baseUrl: string): Promise<number[]> {
  const model = process.env.GEMINI_EMBED_MODEL || "text-embedding-004";
  const url = `${baseUrl}/models/${model}:embedContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: `models/${model}`, content: { parts: [{ text }] } }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini embed error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as { embedding?: { values?: number[] } };
  return data.embedding?.values ?? [];
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────

async function openaiChat(messages: ChatMessage[], apiKey: string, baseUrl: string): Promise<string> {
  const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI chat error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? "";
}

async function openaiEmbed(text: string, apiKey: string, baseUrl: string): Promise<number[]> {
  const model = process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";
  const res = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, input: text }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI embed error ${res.status}: ${err}`);
  }

  const data = (await res.json()) as { data?: Array<{ embedding?: number[] }> };
  return data.data?.[0]?.embedding ?? [];
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function chat(messages: ChatMessage[]): Promise<ChatResponse> {
  const provider = resolveProvider("chat");
  if (!provider) throw new Error("No AI provider configured for chat");
  const key = getProviderKey(provider);

  let text: string;
  if (provider.id === "gemini") {
    text = await geminiChat(messages, key, provider._baseUrl);
  } else if (provider.id === "openai") {
    text = await openaiChat(messages, key, provider._baseUrl);
  } else {
    throw new Error(`No chat adapter for provider: ${provider.id}`);
  }

  return { text, provider: provider.id };
}

export async function embed(text: string): Promise<EmbeddingResponse> {
  const provider = resolveProvider("embeddings");
  if (!provider) throw new Error("No AI provider configured for embeddings");
  const key = getProviderKey(provider);

  let embedding: number[];
  if (provider.id === "gemini") {
    embedding = await geminiEmbed(text, key, provider._baseUrl);
  } else if (provider.id === "openai") {
    embedding = await openaiEmbed(text, key, provider._baseUrl);
  } else {
    throw new Error(`No embedding adapter for provider: ${provider.id}`);
  }

  return { embedding, provider: provider.id };
}

/** Cosine similarity between two equal-length vectors */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
