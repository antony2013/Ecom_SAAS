import type { Product } from './product.js';

export interface BundleItem {
  id: string;
  bundleId: string;
  productId: string;
  quantity: number;
  sortOrder: number;
  createdAt: string;
  product?: Product;
}

export interface Bundle {
  id: string;
  storeId: string;
  name: string;
  description: string | null;
  price: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  items?: BundleItem[];
}
