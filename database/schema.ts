import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const accounts = pgTable("accounts", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    plaidId: text('plaid_id'),
    userId: text('user_id').notNull(),
})

export const accountRelations = relations(accounts, ({ many }) => ({
    transactions: many(transactions),
}))

export const insertAccountSchema = createInsertSchema(accounts)

// CATGEORIES SCHEMA
export const categories = pgTable("categories", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    plaidId: text('plaid_id'),
    userId: text('user_id').notNull(),
})

export const categoryRelations = relations(categories, ({ many }) => ({
    transactions: many(transactions),
}))

export const insertCategorySchema = createInsertSchema(categories)

// TRANSACTIONS SCHEMA
export const transactions = pgTable("transactions", {
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    payee: text("payee").notNull(),
    notes: text("notes"),
    date: timestamp("date", {mode: "date"}).notNull(),
    accountId: text("account_id").notNull().references(() => accounts.id, {
        onDelete: "cascade"
    }).notNull(),
    categoryId: text("category_id").references(() => categories.id, {
        onDelete: "set null",       
    }),
})

export const transactionRelations = relations(transactions, ({ one }) => ({
account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
}),

category: one(categories, {
    fields: [transactions.accountId],
    references: [categories.id],
}),
}))

export const insertTransactionSchema = createInsertSchema(transactions, {
    date: z.coerce.date()
})