// Product types matching backend Drizzle schema + relations

export interface Category {
  id: string;
  storeId: string;
  nameEn: string;
  nameAr: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  storeId: string;
  nameEn: string;
  nameAr: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VariantOption {
  id: string;
  variantId: string;
  storeId: string;
  nameEn: string;
  nameAr: string | null;
  priceAdjustment: string;
  sku: string | null;
  stockQuantity: number;
  imageUrl: string | null;
  sortOrder: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  storeId: string;
  productId: string;
  nameEn: string;
  nameAr: string | null;
  sortOrder: number;
  options: VariantOption[];
  createdAt: string;
  updatedAt: string;
}

export interface VariantCombination {
  id: string;
  storeId: string;
  productId: string;
  sku: string | null;
  combinationKey: string;
  priceAdjustment: string;
  stockQuantity: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModifierOption {
  id: string;
  modifierGroupId: string;
  storeId: string;
  nameEn: string;
  nameAr: string | null;
  priceAdjustment: string;
  imageUrl: string | null;
  sortOrder: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModifierGroup {
  id: string;
  storeId: string;
  productId: string | null;
  categoryId: string | null;
  applyTo: string;
  name: string;
  nameAr: string | null;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  sortOrder: number;
  options: ModifierOption[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  subcategoryId: string | null;
  titleEn: string;
  titleAr: string | null;
  sortOrder: number;
  preparationTime: number | null;
  tags: string | null;
  images: string | null;
  youtubeVideoLinkId: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  salePrice: string;
  purchasePrice: string | null;
  purchaseLimit: number | null;
  barcode: string | null;
  discountType: string;
  discount: string;
  souqDealDiscount: string | null;
  currentQuantity: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  subcategory: Subcategory | null;
  variants: ProductVariant[];
  modifierGroups: ModifierGroup[];
}

// Lightweight product for list/search results
export interface ProductListItem {
  id: string;
  storeId: string;
  categoryId: string;
  titleEn: string;
  titleAr: string | null;
  images: string | null;
  salePrice: string;
  purchasePrice: string | null;
  discountType: string;
  discount: string;
  preparationTime: number | null;
  tags: string | null;
  isPublished: boolean;
  category: Pick<Category, 'id' | 'nameEn' | 'nameAr' | 'storeId'>;
  subcategory: Pick<Subcategory, 'id' | 'nameEn' | 'nameAr'> | null;
}

export interface ProductSearchResult {
  items: Product[];
  total: number;
  limit: number;
  offset: number;
}