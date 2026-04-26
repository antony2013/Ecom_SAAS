// Cart types matching backend Drizzle schema
import type { Bundle } from './bundle.js';
import type { Product } from './product.js';

export interface CartModifiers {
  variantOptionIds?: string[];
  combinationKey?: string;
  modifierOptionIds?: string[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  bundleId: string | null;
  quantity: number;
  price: string;
  total: string;
  modifiers: CartModifiers | null;
  product?: Product | null;
  bundle?: Bundle | null;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  storeId: string;
  customerId: string | null;
  sessionId: string;
  couponCode: string | null;
  couponDiscount: string;
  subtotal: string;
  total: string;
  itemCount: number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export interface AddToCartInput {
  productId: string;
  quantity?: number;
  bundleId?: string;
  variantOptionIds?: string[];
  combinationKey?: string;
  modifierOptionIds?: string[];
}

export interface UpdateCartItemInput {
  quantity: number;
}