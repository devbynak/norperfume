/**
 * Meta Pixel Utility for NOR
 * This helps track conversions and user actions on Facebook/Instagram.
 */

declare global {
  interface Window {
    fbq: (command: string, action: string, params?: Record<string, unknown>) => void;
    _fbq: unknown;
  }
}

import { Product } from "@/data/products";
import { CartItem } from "@/context/CartContext";

// Get Pixel ID from env var or use placeholder
const getEnvVar = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  return undefined;
};

export const PIXEL_ID = getEnvVar('VITE_META_PIXEL_ID') || "1006383931833299"; 

const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname === 'www.norperfume.com' || window.location.hostname === 'norperfume.com') &&
  getEnvVar('VITE_ENABLE_META_PIXEL') === 'true';

const canTrack = () => typeof window !== 'undefined' && typeof window.fbq === "function" && isProduction;

export const trackPageView = () => {
  if (canTrack()) {
    window.fbq("track", "PageView");
  }
};

export const trackViewContent = (product: Product) => {
  if (canTrack()) {
    window.fbq("track", "ViewContent", {
      content_name: product.name,
      content_category: "Car Fragrance",
      content_ids: [product.id],
      content_type: "product",
      value: product.price,
      currency: product.currencyCode || "INR",
    });
  }
};

export const trackAddToCart = (product: Product, quantity: number = 1) => {
  if (canTrack()) {
    window.fbq("track", "AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price * quantity,
      currency: product.currencyCode || "INR",
    });
  }
};

export const trackInitiateCheckout = (items: CartItem[], total: number) => {
  if (canTrack()) {
    window.fbq("track", "InitiateCheckout", {
      content_ids: items.map(item => item.product.id),
      content_type: "product",
      value: total,
      currency: "INR",
      num_items: items.length
    });
  }
};

export const trackContact = () => {
  if (canTrack()) {
    window.fbq("track", "Contact");
  }
};
