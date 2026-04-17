// Public Cart Routes - Guest cart operations (cookie-based)
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../../db/index.js';
import { carts, cartItems } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { ErrorCodes } from '../../errors/codes.js';
import { addDecimals, multiplyDecimalByInt } from '../../lib/decimal.js';

const addItemSchema = z.strictObject({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
  variantOptionIds: z.array(z.string().uuid()).optional(),
  combinationKey: z.string().optional(),
  modifierOptionIds: z.array(z.string().uuid()).optional(),
});

const updateItemSchema = z.strictObject({
  quantity: z.number().int().min(1),
});

const itemIdParamSchema = z.strictObject({
  itemId: z.string().uuid(),
});

async function updateCartTotals(cartId: string) {
  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cartId),
  });

  let subtotal = '0.00';
  for (const item of items) {
    subtotal = addDecimals(subtotal, item.total);
  }
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  await db
    .update(carts)
    .set({
      subtotal,
      total: subtotal,
      itemCount,
      updatedAt: new Date(),
    })
    .where(eq(carts.id, cartId));
}

export default async function publicCartRoutes(fastify: FastifyInstance) {
  // GET /api/v1/public/cart - Get or create cart
  fastify.get('/', {
    schema: {
      tags: ['Public'],
      summary: 'Get or create cart',
      description: 'Retrieve the current guest cart or create a new one using a cookie-based session',
    },
  }, async (request, reply) => {
    if (!request.storeId) {
      reply.status(400).send({ error: 'Bad Request', code: ErrorCodes.STORE_NOT_FOUND, message: 'Store not found. Please access via your store domain.' });
      return;
    }

    let cartId = request.cookies.cartId;

    if (cartId) {
      const cart = await db.query.carts.findFirst({
        where: eq(carts.id, cartId),
        with: { items: true },
      });

      if (cart) {
        return { cart };
      }
    }

    // Create a new cart
    const [newCart] = await db.insert(carts).values({
      storeId: request.storeId,
      sessionId: crypto.randomUUID(),
      subtotal: '0',
      total: '0',
      itemCount: 0,
    }).returning();

    reply.setCookie('cartId', newCart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return { cart: { ...newCart, items: [] } };
  });

  // POST /api/v1/public/cart/items - Add item to cart
  fastify.post('/items', {
    schema: {
      tags: ['Public'],
      summary: 'Add item to cart',
      description: 'Add a product item to the guest cart with server-side price verification. Prices are computed from the database.',
    },
  }, async (request, reply) => {
    if (!request.storeId) {
      reply.status(400).send({ error: 'Bad Request', code: ErrorCodes.STORE_NOT_FOUND, message: 'Store not found. Please access via your store domain.' });
      return;
    }

    const parsed = addItemSchema.parse(request.body);
    let cartId = request.cookies.cartId;

    // Create cart if not exists
    if (!cartId) {
      const [newCart] = await db.insert(carts).values({
        storeId: request.storeId,
        sessionId: crypto.randomUUID(),
        subtotal: '0',
        total: '0',
        itemCount: 0,
      }).returning();
      cartId = newCart.id;
      reply.setCookie('cartId', cartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
    }

    // Compute verified price for this item
    const itemPricing = await fastify.pricingService.computeItemPrice({
      storeId: request.storeId,
      productId: parsed.productId,
      variantOptionIds: parsed.variantOptionIds,
      combinationKey: parsed.combinationKey,
      modifierOptionIds: parsed.modifierOptionIds,
      quantity: parsed.quantity,
    });

    const price = itemPricing.effectivePrice;
    const itemTotal = itemPricing.lineTotal;

    // Check if item with same productId + variant + modifiers already exists in cart
    const existingItems = await db.query.cartItems.findMany({
      where: and(eq(cartItems.cartId, cartId), eq(cartItems.productId, parsed.productId)),
    });

    // Match by modifiers JSON to differentiate same product with different options
    const modifiersJson = (parsed.variantOptionIds || parsed.modifierOptionIds)
      ? JSON.stringify({
          variantOptionIds: parsed.variantOptionIds,
          combinationKey: parsed.combinationKey,
          modifierOptionIds: parsed.modifierOptionIds,
        })
      : null;

    const existingItem = existingItems.find((item) => {
      if (!modifiersJson && !item.modifiers) return true;
      if (modifiersJson && item.modifiers) {
        try {
          const existing = typeof item.modifiers === 'string' ? JSON.parse(item.modifiers) : item.modifiers;
          const incoming = JSON.parse(modifiersJson);
          return JSON.stringify(existing) === JSON.stringify(incoming);
        } catch {
          return false;
        }
      }
      return false;
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + parsed.quantity;
      const newTotal = multiplyDecimalByInt(price, newQuantity);
      const [updated] = await db
        .update(cartItems)
        .set({
          quantity: newQuantity,
          total: newTotal,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem.id))
        .returning();

      await updateCartTotals(cartId);

      const cart = await db.query.carts.findFirst({
        where: eq(carts.id, cartId),
        with: { items: true },
      });
      return { cart, item: updated };
    }

    // Add new item
    const [item] = await db.insert(cartItems).values({
      cartId,
      productId: parsed.productId,
      quantity: parsed.quantity,
      price,
      total: itemTotal,
      modifiers: modifiersJson,
    }).returning();

    await updateCartTotals(cartId);

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
      with: { items: true },
    });
    return { cart, item };
  });

  // PATCH /api/v1/public/cart/items/:itemId - Update item quantity
  fastify.patch('/items/:itemId', {
    schema: {
      tags: ['Public'],
      summary: 'Update cart item quantity',
      description: 'Update the quantity of a specific item in the guest cart',
    },
  }, async (request, reply) => {
    const { itemId } = itemIdParamSchema.parse(request.params);
    const parsed = updateItemSchema.parse(request.body);
    const cartId = request.cookies.cartId;

    if (!cartId) {
      reply.status(404).send({ error: 'Not Found', code: ErrorCodes.CART_NOT_FOUND, message: 'Cart not found' });
      return;
    }

    const item = await db.query.cartItems.findFirst({
      where: and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)),
    });

    if (!item) {
      reply.status(404).send({ error: 'Not Found', code: ErrorCodes.CART_ITEM_NOT_FOUND, message: 'Cart item not found' });
      return;
    }

    // Recompute total from stored (server-verified) price × new quantity
    const newTotal = multiplyDecimalByInt(item.price, parsed.quantity);
    const [updated] = await db
      .update(cartItems)
      .set({
        quantity: parsed.quantity,
        total: newTotal,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, itemId))
      .returning();

    await updateCartTotals(cartId);

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
      with: { items: true },
    });
    return { cart, item: updated };
  });

  // DELETE /api/v1/public/cart/items/:itemId - Remove item from cart
  fastify.delete('/items/:itemId', {
    schema: {
      tags: ['Public'],
      summary: 'Remove cart item',
      description: 'Remove a specific item from the guest cart',
    },
  }, async (request, reply) => {
    const { itemId } = itemIdParamSchema.parse(request.params);
    const cartId = request.cookies.cartId;

    if (!cartId) {
      reply.status(404).send({ error: 'Not Found', code: ErrorCodes.CART_NOT_FOUND, message: 'Cart not found' });
      return;
    }

    await db.delete(cartItems).where(
      and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)),
    );

    await updateCartTotals(cartId);

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
      with: { items: true },
    });
    return { cart };
  });
}