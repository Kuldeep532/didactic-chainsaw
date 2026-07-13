import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const globalMessagesTable = pgTable("global_messages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  // Target audience: "website", "nexus_plus", "geeta_nexus", or "all"
  target: text("target").notNull().default("all"),
  // Visibility controls
  enabled: boolean("enabled").notNull().default(false),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  // Optional action link
  actionUrl: text("action_url"),
  // Optional styling hint: "info", "warning", "success", "error"
  kind: text("kind").notNull().default("info"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertGlobalMessageSchema = createInsertSchema(globalMessagesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGlobalMessage = z.infer<typeof insertGlobalMessageSchema>;
export type GlobalMessage = typeof globalMessagesTable.$inferSelect;
