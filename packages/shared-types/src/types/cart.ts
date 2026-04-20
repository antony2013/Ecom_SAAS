// Cart types matching backend Drizzle schema

export interface CartModifiers {
  variantOptionIds?: string[];
  combinationKey?: string;
  modifierOptionIds?: string[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: string;
  total: string;
  modifiers: CartModifiers | null;
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
  variantOptionIds?: string[];
  combinationKey?: string;
  modifierOptionIds?: string[];
}

export interface UpdateCartItemInput {
  quantity: number;
}