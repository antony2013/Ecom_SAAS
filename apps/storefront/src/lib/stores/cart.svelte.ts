import type { Cart, CartItem } from '@repo/shared-types';

// Simple reactive cart state using Svelte 5 runes pattern
// This module is imported into components that need cart state

let cartState = $state<{
  cart: Cart | null;
  loading: boolean;
  drawerOpen: boolean;
}>({
  cart: null,
  loading: false,
  drawerOpen: false,
});

export function getCart() {
  return cartState;
}

export function openCartDrawer() {
  cartState.drawerOpen = true;
}

export function closeCartDrawer() {
  cartState.drawerOpen = false;
}

export async function refreshCart() {
  cartState.loading = true;
  try {
    const res = await fetch('/api/v1/public/cart', {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      cartState.cart = data.cart ?? null;
    }
  } catch {
    // cart fetch failed
  } finally {
    cartState.loading = false;
  }
}

export async function addToCart(
  productId: string,
  quantity = 1,
  variantOptionIds?: string[],
  combinationKey?: string,
  modifierOptionIds?: string[],
) {
  try {
    const res = await fetch('/api/v1/public/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        productId,
        quantity,
        variantOptionIds: variantOptionIds?.length ? variantOptionIds : undefined,
        combinationKey: combinationKey || undefined,
        modifierOptionIds: modifierOptionIds?.length ? modifierOptionIds : undefined,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      cartState.cart = data.cart ?? null;
      cartState.drawerOpen = true; // Open drawer on add
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  try {
    const res = await fetch(`/api/v1/public/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      const data = await res.json();
      cartState.cart = data.cart ?? null;
    }
  } catch {
    // update failed
  }
}

export async function removeCartItem(itemId: string) {
  try {
    const res = await fetch(`/api/v1/public/cart/items/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      cartState.cart = data.cart ?? null;
    }
  } catch {
    // remove failed
  }
}

export function cartItemCount(): number {
  return cartState.cart?.itemCount ?? 0;
}