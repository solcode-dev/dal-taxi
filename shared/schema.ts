import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense"]);

export const transactions = pgTable("transactions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  type: transactionTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions, {
  occurredAt: z.coerce.date().optional(),
}).omit({
  id: true,
});

export const selectTransactionSchema = createSelectSchema(transactions);

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type TransactionType = "income" | "expense";
