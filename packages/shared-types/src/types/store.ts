export type ThemeType = 'food' | 'clothing' | 'appliances';

export interface Store {
  id: string;
  name: string;
  domain: string;
  status: 'pending' | 'active' | 'suspended';
  currency: string;
  language: string;
  themeType: 'food' | 'clothing' | 'appliances';
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  fontFamily: string | null;
  borderRadius: number | null;
  logoUrl: string | null;
  heroEnabled: boolean;
  heroType: 'static' | 'slideshow';
  homeSections: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StoreCustomization {
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  fontFamily: string | null;
  borderRadius: number | null;
  heroEnabled: boolean;
  heroType: 'static' | 'slideshow';
  heroSlides: HeroSlide[];
  heroAutoPlay: boolean;
  heroInterval: 3000 | 5000 | 7000;
  heroTransition: 'fade' | 'slide';
  homeSections: string[];
  filtersEnabled: boolean;
  visibleFilters: string[];
  defaultColumns: 2 | 3 | 4;
  defaultSort: 'newest' | 'popular' | 'price_asc' | 'price_desc';
  showRatingOnCard: boolean;
  showAddToCartOnCard: boolean;
  showDiscountBadge: boolean;
  cardAspectRatio: 'square' | 'portrait' | 'landscape';
  guestCheckout: boolean;
  cartType: 'drawer' | 'page';
  showOrderNotes: boolean;
  showGiftMessage: boolean;
  showCouponField: boolean;
  checkoutPhoneField: 'required' | 'optional' | 'hidden';
  headerLayout: 'left' | 'center' | 'minimal';
  navStyle: 'horizontal' | 'mega' | 'hamburger';
  stickyHeader: boolean;
  showSearch: boolean;
  showWishlist: boolean;
  footerEnabled: boolean;
  footerAboutText: string | null;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    whatsapp?: string;
    x?: string;
  };
  showPaymentIcons: boolean;
  copyrightText: string | null;
}

export interface HeroSlide {
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  textPosition: 'left' | 'center' | 'right';
  overlayOpacity: number;
}