import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  // Firebase Auth is the primary identity provider
  firebaseUid: text("firebase_uid").unique(),
  // Legacy fields kept for compatibility / migration
  googleSub: text("google_sub").unique(),
  username: text("username").unique(),
  email: text("email").notNull(),
  passwordHash: text("password_hash"),
  // Profile fields
  name: text("name"),
  picture: text("picture"),
  // Authorization is synced from the Firebase custom `admin` claim
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
