/* eslint-disable react-refresh/only-export-components */
import {
  useContext,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";
import { type Product } from "@/data/products";
import { toast } from "@/components/ui/sonner";
import {
  addShopifyCartLines,
  createShopifyCart,
  fetchShopifyCart,
  removeShopifyCartLines,
  updateShopifyCartLines,
} from "@/lib/shopify/cart";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { trackAddToCart, trackInitiateCheckout } from "@/lib/meta-pixel";
import { haptic } from "@/lib/haptics";
import {
  CART_STORAGE_KEY,
  CartContext,
  type CartItem,
} from "@/context/cart-context-internal";

export type { CartItem } from "@/context/cart-context-internal";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  useCustomerAuth();
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const persistCartId = useCallback((nextCartId: string | null) => {
    if (typeof window === "undefined") return;

    if (nextCartId) {
      window.localStorage.setItem(CART_STORAGE_KEY, nextCartId);
    } else {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const applyCartSnapshot = useCallback(
    (snapshot: {
      id: string;
      checkoutUrl: string;
      items: CartItem[];
      totalItems: number;
      totalPrice: number;
    }) => {
      setCartId(snapshot.id);
      setCheckoutUrl(snapshot.checkoutUrl);
      setItems(snapshot.items);
      setTotalItems(snapshot.totalItems);
      setTotalPrice(snapshot.totalPrice);
      persistCartId(snapshot.id);
    },
    [persistCartId],
  );

  const clearCartState = useCallback(() => {
    setCartId(null);
    setCheckoutUrl("");
    setItems([]);
    setTotalItems(0);
    setTotalPrice(0);
    persistCartId(null);
  }, [persistCartId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedCartId = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCartId) return;

    void fetchShopifyCart(storedCartId)
      .then(applyCartSnapshot)
      .catch(() => clearCartState());
  }, [applyCartSnapshot, clearCartState]);

  // Buyer identity sync removed: customer email is no longer exposed synchronously
  // by the OAuth-based auth context. Checkout still completes via the cart URL.


  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      if (!product.variantId) {
        toast.error("This product is not ready for Shopify cart yet.");
        return;
      }

      // Instant feedback
      setIsOpen(true);
      setIsUpdating(true);
      haptic("success");
      trackAddToCart(product, quantity);

      try {
        const snapshot = cartId
          ? await addShopifyCartLines(cartId, [
              { merchandiseId: product.variantId, quantity },
            ])
          : await createShopifyCart(
              [{ merchandiseId: product.variantId, quantity }]
            );

        applyCartSnapshot(snapshot);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to add this item to your Shopify cart.";
        toast.error(message);
      } finally {
        setIsUpdating(false);
      }
    },
    [applyCartSnapshot, cartId],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!cartId) return;

      const item = items.find((entry) => entry.product.id === productId);
      if (!item?.lineId) return;

      try {
        const snapshot = await removeShopifyCartLines(cartId, [item.lineId]);
        applyCartSnapshot(snapshot);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to remove this item from your cart.";
        toast.error(message);
      }
    },
    [applyCartSnapshot, cartId, items],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!cartId) return;

      const item = items.find((entry) => entry.product.id === productId);
      if (!item?.lineId) return;

      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }

      try {
        const snapshot = await updateShopifyCartLines(cartId, [
          { id: item.lineId, quantity },
        ]);
        applyCartSnapshot(snapshot);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to update this cart item.";
        toast.error(message);
      }
    },
    [applyCartSnapshot, cartId, items, removeItem],
  );

  const clearCart = useCallback(async () => {
    if (!cartId || !items.length) {
      clearCartState();
      return;
    }

    try {
      const snapshot = await removeShopifyCartLines(
        cartId,
        items.map((item) => item.lineId),
      );
      applyCartSnapshot(snapshot);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to clear your Shopify cart.";
      toast.error(message);
    }
  }, [applyCartSnapshot, cartId, clearCartState, items]);

  const checkout = useCallback(async () => {
    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!checkoutUrl && cartId) {
      try {
        const snapshot = await fetchShopifyCart(cartId);
        applyCartSnapshot(snapshot);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to refresh your Shopify cart.";
        toast.error(message);
        return;
      }
    }

    const targetUrl = checkoutUrl || (cartId ? (await fetchShopifyCart(cartId)).checkoutUrl : "");

    if (!targetUrl) {
      toast.error("Shopify checkout URL is not available.");
      return;
    }

    try {
      setIsCheckingOut(true);
      haptic("medium");
      trackInitiateCheckout(items, totalPrice);
      window.location.assign(targetUrl);
    } finally {
      setIsCheckingOut(false);
    }
  }, [applyCartSnapshot, cartId, checkoutUrl, items, totalPrice]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
        totalItems,
        totalPrice,
        isOpen,
        isCheckingOut,
        isUpdating,
        setIsOpen,

      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
