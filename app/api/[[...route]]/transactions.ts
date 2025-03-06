import { db } from "@/database/drizzle";
import { transactions, insertTransactionSchema, categories, accounts } from "@/database/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { parse, subDays } from 'date-fns'

const app = new Hono()
  .get("/", zValidator("query", z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    accountId: z.string().optional(),
  })), clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    const { from, to, accountId } = c.req.valid("query");
    if (!auth) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }
    const defaultTo = new Date()
    const defaultFrom = subDays(defaultTo, 30)

    const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom
    const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo

    if (!auth.userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const data = await db
      .select({
        id: transactions.id,
        categoryId: transactions.categoryId,
        category: categories.name,
        accountId: transactions.accountId,
        amount: transactions.amount,
        account: accounts.name,
        payee: transactions.payee,
        notes: transactions.notes,
        date: transactions.date,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        )
      ).orderBy(desc(transactions.date))


    return c.json({
      data,
    });
  })
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({
      id: z.string().optional(),
    })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: 'ID is required' }, 400)
      }

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const [data] = await db.select({
        id: transactions.id,
        categoryId: transactions.categoryId,
        accountId: transactions.accountId,
        amount: transactions.amount,
        payee: transactions.payee,
        notes: transactions.notes,
        date: transactions.date,
      })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            eq(transactions.id, id),
            eq(accounts.id, auth.userId)
          )
        )
      if (!data) {
        return c.json({ error: "No data found" }, 404)
      }

      return c.json({ data })
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
      if (!auth?.userId) {
        return c.json({ error: "User ID is required" }, 401);
      }

      const [data] = await db
        .insert(transactions)
        .values({
          id: createId(),
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c)
      const values = c.req.valid("json")

      if (!auth?.userId) {
        return c.json({ 'error': 'Unauthorized' }, 401)
      }

      const transactionsToDelete = await db.$with("transactions_to_delete").as(
        db.select({ id: transactions.id }).from(transactions).innerJoin(accounts, eq(transactions.accountId, accounts.id)).where(
          and(
            inArray(transactions.id, values.ids),
            eq(accounts.userId, auth.userId)
          ))
      )

      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
        )
        .returning({ id: transactions.id })

      return c.json({ data })
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({
      id: z.string().optional()
    })),
    zValidator('json', insertTransactionSchema.omit({
      id: true,
    })),
    async (c) => {
      const auth = getAuth(c)
      const { id } = c.req.valid('param')
      const values = c.req.valid('json')

      if (!id) {
        return c.json({ error: 'ID is required' }, 400)
      }

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const transactionsToUpdate = await db.$with("transactions_to_update").as(
        db.select({ id: transactions.id }).from(transactions).innerJoin(accounts, eq(transactions.accountId, accounts.id)).where(
          and(
            eq(transactions.id, id),
            eq(accounts.userId, auth.userId)
          ))
      )
      const [data] = await db.with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
        ).returning()

      if (!data) {
        return c.json({ error: 'No data found' }, 404)
      }

      return c.json({ data })
    }
  )
  .delete(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({
      id: z.string().optional()
    })),
    async (c) => {
      const auth = getAuth(c)
      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'ID is required' }, 400)
      }

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const transactionsToDelete = await db.$with("transactions_to_update").as(
        db.select({ id: transactions.id }).from(transactions).innerJoin(accounts, eq(transactions.accountId, accounts.id)).where(
          and(
            eq(transactions.id, id),
            eq(accounts.userId, auth.userId)
          ))
      )

      const [data] = await db.with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
        ).returning({
          id: transactions.id
        })

      if (!data) {
        return c.json({ error: 'No data found' }, 404)
      }

      return c.json({ data })
    }
  )
  .post(
    '/bulk-create',
    clerkMiddleware(),
    zValidator('json', z.array(insertTransactionSchema.omit({
      id: true
    }))),
    async (c) => {
      const auth = getAuth(c)
      const values = c.req.valid('json')

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const data = await db.insert(transactions)
        .values(values.map((value) => ({
          id: createId(),
          ...value
        })))
        .returning()
      return c.json({ data })
    }
  )

export default app;
