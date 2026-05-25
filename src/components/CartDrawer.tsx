import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { haptic } from "@/lib/haptics";

const CartDrawer = () => {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
    checkout,
    isCheckingOut,
    isUpdating,
  } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="bg-card border-border w-full sm:max-w-md flex flex-col font-sans">
        <SheetHeader className="border-b border-border pb-4 relative">
          <SheetTitle className="font-display text-2xl text-foreground flex items-center gap-3">
            <div className="relative mr-1 z-10 shrink-0 flex items-center">
              <ShoppingBag className="w-6 h-6 text-primary" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 600, damping: 12 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold font-numbers-inter"
                >
                  {totalItems}
                </motion.span>
              )}
            </div>
            Your Cart
          </SheetTitle>
          <AnimatePresence>
            {isUpdating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-primary text-[10px] uppercase tracking-widest font-semibold bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Updating
              </motion.div>
            )}
          </AnimatePresence>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">Your cart is empty</p>
            <Button
              variant="outline"
              onClick={() => { haptic("light"); setIsOpen(false); }}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 bg-background/50 rounded-xl p-3 border border-border"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-foreground text-sm font-semibold truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-primary font-semibold text-sm mt-0.5 font-numbers-inter">
                        {formatCurrency(item.product.price, item.product.currencyCode)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => { haptic("light"); updateQuantity(item.product.id, item.quantity - 1); }}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 h-7 flex items-center justify-center overflow-hidden">
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 0.6, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            className="text-foreground text-sm font-medium text-center font-numbers-inter"
                          >
                            {item.quantity}
                          </motion.span>
                        </span>
                        <button
                          onClick={() => { haptic("light"); updateQuantity(item.product.id, item.quantity + 1); }}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => { haptic("warning"); removeItem(item.product.id); }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="text-foreground font-semibold text-sm font-numbers-inter">
                        {formatCurrency(
                          item.product.price * item.quantity,
                          item.product.currencyCode,
                        )}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-sans text-xl font-semibold font-numbers-inter">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
              <Button
                onClick={() => { haptic("medium"); checkout(); }}
                disabled={isCheckingOut}
                className="w-full h-12 gradient-gold shimmer-gold text-primary-foreground font-semibold text-base rounded-[6px] hover:opacity-95 active:scale-95 transition-all duration-150 disabled:opacity-70"
              >
                {isCheckingOut ? (
                  "Redirecting to Checkout..."
                ) : (
                  <>
                    Checkout -{" "}
                    <span className="font-numbers-inter">
                      {formatCurrency(totalPrice)}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
