import { pgTable, text, serial, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const appConfigTable = pgTable("app_config", {
  id: serial("id").primaryKey(),
  baseUrl: text("base_url"),
  minimumSupportedVersion: varchar("minimum_supported_version", { length: 50 }),
  latestVersion: varchar("latest_version", { length: 50 }),
  updateUrl: text("update_url"),
  maintenanceMode: boolean("maintenance_mode").default(false),
  authProviders: text("auth_providers").array().default(["email", "google"]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAppConfigSchema = createInsertSchema(appConfigTable).omit({
  id: true,
  updatedAt: true,
}).partial();

export const updateAppConfigSchema = insertAppConfigSchema;

export type InsertAppConfig = z.infer<typeof insertAppConfigSchema>;
export type AppConfig = typeof appConfigTable.$inferSelect;
