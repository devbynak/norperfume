import { createContext } from "react";
import { type ShopifyCartItem } from "@/lib/shopify/cart";
import { type Product } from "@/data/products";

export const CART_STORAGE_KEY = "nor-shopify-cart-id";

export type CartItem = ShopifyCartItem;

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  isCheckingOut: boolean;
  isUpdating: boolean;
  setIsOpen: (open: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);