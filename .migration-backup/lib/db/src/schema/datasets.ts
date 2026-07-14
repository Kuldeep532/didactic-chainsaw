import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type DatasetStatus = "processing" | "active" | "inactive" | "error";

export const datasetsTable = pgTable("datasets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  /** "processing" | "active" | "inactive" | "error" */
  status: text("status").notNull().default("processing"),
  rowCount: integer("row_count").notNull().default(0),
  chunkCount: integer("chunk_count").notNull().default(0),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDatasetSchema = createInsertSchema(datasetsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type Dataset = typeof datasetsTable.$inferSelect;
