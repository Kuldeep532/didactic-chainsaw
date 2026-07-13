import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { datasetsTable } from "./datasets";

/**
 * Stores text chunks from uploaded training datasets.
 * Embeddings are stored as float arrays (real[]) which work on any Postgres
 * without extensions. Cosine similarity is computed in application code.
 * The embedding column is intentionally left as nullable so that chunks
 * can be persisted immediately and embedded asynchronously.
 */
export const knowledgeChunksTable = pgTable("knowledge_chunks", {
  id: serial("id").primaryKey(),
  datasetId: integer("dataset_id")
    .notNull()
    .references(() => datasetsTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  /** Serialized float array — length depends on embedding model (768 for Gemini) */
  embeddingJson: text("embedding_json"),
  /** Optional row/source metadata as JSON string */
  metaJson: text("meta_json"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type KnowledgeChunk = typeof knowledgeChunksTable.$inferSelect;
