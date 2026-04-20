// Order, review, address, shipping types matching backend schemas

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  variantInfo: string | null;
  quantity: number;
  price: string;
  total: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    titleEn: string;
    images: string | null;
    salePrice: string;
  };
}

export interface Order {
  id: string;
  storeId: string;
  customerId: string | null;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  email: string;
  phone: string | null;
  currency: string;
  subtotal: string;
  tax: string;
  shipping: string;
  discount: string;
  total: string;
  billingName: string | null;
  billingFirstName: string | null;
  billingLastName: string | null;
  billingAddressLine1: string | null;
  billingAddressLine2: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingCountry: string | null;
  billingPostalCode: string | null;
  shippingName: string | null;
  shippingFirstName: string | null;
  shippingLastName: string | null;
  shippingAddressLine1: string | null;
  shippingAddressLine2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingCountry: string | null;
  shippingPostalCode: string | null;
  paymentMethod: string | null;
  paymentIntentId: string | null;
  shippingMethod: string | null;
  shippingCarrier: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  couponCode: string | null;
  notes: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
  };
}

export interface Review {
  id: string;
  storeId: string;
  productId: string;
  customerId: string | null;
  orderId: string | null;
  rating: number;
  title: string | null;
  content: string;
  images: string | null;
  isVerified: boolean;
  isApproved: boolean;
  helpfulCount: number;
  response: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  storeId: string;
  name: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  country: string;
  postalCode: string;
  phone: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  method: string;
  carrier: string | null;
  price: string;
  estimatedDays: number | null;
  free: boolean;
}

export interface TaxBreakdown {
  name: string;
  rate: string;
  amount: number;
}

export interface CheckoutInput {
  email: string;
  phone?: string;
  currency?: string;
  items: {
    productId: string;
    quantity: number;
    variantOptionIds?: string[];
    combinationKey?: string;
    modifierOptionIds?: string[];
  }[];
  cartId?: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  billingPostalCode?: string;
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;
  shippingPostalCode?: string;
  paymentMethod?: string;
  couponCode?: string;
  shippingRateId?: string;
  notes?: string;
}

export interface WishlistItem {
  id: string;
  storeId: string;
  customerId: string;
  productId: string;
  notes: string | null;
  createdAt: string;
  product?: {
    id: string;
    titleEn: string;
    images: string | null;
    salePrice: string;
    purchasePrice: string | null;
    discountType: string;
    discount: string;
    isPublished: boolean;
  };
}