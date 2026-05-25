export interface ProductDetails {
  composition?: string;
  howToUse?: string;
  whatsInTheBox?: string;
}

export interface Product {
  id: string;
  shopifyHandle: string;
  shopifyId?: string;
  variantId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  currencyCode?: string;
  image: string;
  images?: string[];
  description: string;
  tags: string[];
  discount?: number;
  availableForSale?: boolean;
  details?: ProductDetails;
  source?: "shopify";
  heroImage?: string;
  heroMobileImage?: string;
  heroDescription?: string;
  heroMobileVideo?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  mobileVideo?: string;
  description?: string;
  ctaHref?: string;
}

export interface CollectionCard {
  id: string;
  title: string;
  handle: string;
  image: string;
  description?: string;
  products?: Array<{
    id: string;
    title: string;
    handle: string;
    heroImage?: string;
    heroMobileImage?: string;
    heroMobileVideo?: string;
    heroDescription?: string;
  }>;
  productHandles?: string[];
  heroImage?: string;
  heroMobileImage?: string;
  heroDescription?: string;
  heroMobileVideo?: string;
}
