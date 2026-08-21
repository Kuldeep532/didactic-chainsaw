import { pgEnum, pgTable, serial, text, timestamp, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { createInsertSchema } from "drizzle-zod";

export const appIdEnum = pgEnum("app_id", ["web", "geeta_nexus", "nexus_plus"]);
export const platformEnum = pgEnum("platform", ["web", "ios", "android"]);

export const userDevicesTable = pgTable("user_devices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  appId: appIdEnum("app_id").notNull(),
  platform: platformEnum("platform").notNull(),
  pushToken: text("push_token"),
  origin: text("origin"),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  tokenUnique: uniqueIndex("user_devices_push_token_unique").on(table.pushToken),
}));

export const notificationDeliveriesTable = pgTable("notification_deliveries", {
  id: serial("id").primaryKey(),
  notificationId: integer("notification_id").references(() => notificationsTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  appId: appIdEnum("app_id").notNull(),
  provider: text("provider").notNull().default("expo"),
  pushToken: text("push_token"),
  status: text("status").notNull().default("pending"),
  providerTicketId: text("provider_ticket_id"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserDeviceSchema = createInsertSchema(userDevicesTable).omit({ id: true, createdAt: true, updatedAt: true, lastSeenAt: true });
export type InsertUserDevice = z.infer<typeof insertUserDeviceSchema>;
export type UserDevice = typeof userDevicesTable.$inferSelect;
export type NotificationDelivery = typeof notificationDeliveriesTable.$inferSelect;

import { usersTable } from "./users";
import { notificationsTable } from "./notifications";
