// Return Zod schemas
import { z } from 'zod';
import { idParamSchema, paginationQuerySchema } from '../_shared/schema.js';

export { idParamSchema };

// --- Public/Customer route schemas ---

export { paginationQuerySchema as listQuerySchema };

// --- Merchant route schemas ---

export const merchantListQuerySchema = z.strictObject({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['requested', 'approved', 'received', 'inspected', 'refunded', 'rejected', 'cancelled']).optional(),
});

export const updateReturnStatusSchema = z.strictObject({
  status: z.enum(['requested', 'approved', 'received', 'inspected', 'refunded', 'rejected', 'cancelled']),
  adminNotes: z.string().max(1000).optional(),
});

export const createReturnSchema = z.strictObject({
  orderId: z.string().uuid(),
  reason: z.string().min(1).max(500),
  notes: z.string().max(1000).optional(),
  items: z.array(z.strictObject({
    orderItemId: z.string().uuid(),
    quantity: z.number().int().min(1),
    reason: z.string().max(500).optional(),
    condition: z.enum(['new', 'opened', 'damaged', 'defective']).optional(),
  })).min(1),
});
