// Return repository — Drizzle queries only. No business logic, no ErrorCodes.
import { db } from '../../db/index.js';
import { returns, returnItems } from '../../db/schema.js';
import { eq, desc, count } from 'drizzle-orm';
import type { DbOrTx } from '../_shared/db-types.js';

export const returnRepo = {
  async create(data: typeof returns.$inferInsert, tx?: DbOrTx) {
    const executor = tx ?? db;
    const [row] = await executor.insert(returns).values(data).returning();
    return row;
  },

  async createItem(data: typeof returnItems.$inferInsert, tx?: DbOrTx) {
    const executor = tx ?? db;
    const [row] = await executor.insert(returnItems).values(data).returning();
    return row;
  },

  async findById(id: string) {
    const [row] = await db.select().from(returns).where(eq(returns.id, id)).limit(1);
    return row ?? null;
  },

  async findByIdWithItems(id: string) {
    const result = await db.query.returns.findFirst({
      where: eq(returns.id, id),
      with: { items: true },
    });
    return result ?? null;
  },

  async findByStore(storeId: string, page = 1, limit = 20) {
    const where = eq(returns.storeId, storeId);
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(returns)
        .where(where)
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(desc(returns.createdAt)),
      db.select({ count: count() }).from(returns).where(where),
    ]);
    return { data: rows, total: totalResult[0]?.count ?? 0 };
  },

  async findByOrder(orderId: string) {
    return db
      .select()
      .from(returns)
      .where(eq(returns.orderId, orderId))
      .orderBy(desc(returns.createdAt));
  },

  async updateStatus(
    id: string,
    status: string,
    extra?: Partial<typeof returns.$inferInsert>,
    tx?: DbOrTx,
  ) {
    const executor = tx ?? db;
    const [row] = await executor
      .update(returns)
      .set({ status, ...extra, updatedAt: new Date() })
      .where(eq(returns.id, id))
      .returning();
    return row;
  },
};
