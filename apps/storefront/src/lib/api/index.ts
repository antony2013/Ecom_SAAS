import { apiFetch } from './client.js';
import type { ProductSearchResult, Product, Cart, Store } from '@repo/shared-types';

export const storeKeys = {
  all: ['store'] as const,
  current: () => [...storeKeys.all, 'current'] as const,
};

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...productKeys.lists(), filters] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
};

export const cartKeys = {
  all: ['cart'] as const,
  current: () => [...cartKeys.all, 'current'] as const,
};

export async function fetchStore(host: string): Promise<Store> {
  const data = await apiFetch<{ store: Store }>(`/public/store`, { host });
  return data.store;
}

export async function fetchProducts(params: Record<string, string | number>, host?: string): Promise<ProductSearchResult> {
  const query = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();
  return apiFetch<ProductSearchResult>(`/public/products/search?${query}`, { host });
}

export async function fetchProduct(id: string, host?: string): Promise<Product> {
  const data = await apiFetch<{ product: Product }>(`/public/products/${id}`, { host });
  return data.product;
}

export async function fetchCart(host?: string): Promise<Cart> {
  const data = await apiFetch<{ cart: Cart }>(`/public/cart`, { host });
  return data.cart;
}