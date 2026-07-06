---
name: DB Vector Storage
description: How RAG embeddings are stored and queried without pgvector
---

# Vector Storage Without pgvector

## The rule
Do NOT use pgvector or any Postgres extension. Embeddings are stored as JSON text (`embeddingJson TEXT`) in the `knowledge_chunks` table and deserialized at query time.

**Why:** Works on any standard PostgreSQL instance (Replit, Supabase, Railway, Vercel Postgres) without extensions. Cosine similarity is computed in Node.js.

## How to apply
- `knowledgeChunksTable` has `embeddingJson: text()` column
- At query time: `JSON.parse(chunk.embeddingJson) as number[]`
- `cosineSimilarity()` helper in `lib/ai-adapters.ts`
- Similarity threshold: 0.4 (chunks below this score are dropped)
- Fetch limit: 500 chunks per query (fine for small knowledge bases)
- For production scale (>100k chunks), switch to pgvector or Pinecone
