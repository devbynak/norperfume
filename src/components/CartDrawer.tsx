import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { haptic } from "@/lib/haptics";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const CartDrawer = () => {
  const navigate = useNavigate();
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

  const handleContinueShopping = () => {
    haptic("light");
    setIsOpen(false);
    navigate("/products");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent 
        side="right" 
        className="bg-[#0d0d0d]/80 backdrop-blur-[32px] border-l border-white/10 w-full sm:max-w-md flex flex-col p-0 overflow-hidden shadow-2xl shadow-black/50 !rounded-none"
      >
        {/* Subtle background light gradients - matching side menu */}
        <div className="absolute top-[0%] right-[0%] w-[250px] h-[250px] bg-primary/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-5%] w-[180px] h-[180px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

        <SheetHeader className="px-5 pt-8 pb-4 shrink-0 relative z-10 space-y-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <ShoppingBag className="w-8 h-8 text-primary" strokeWidth={1.5} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold font-numbers-inter border-2 border-[#0d0d0d] shadow-lg"
                    >
                      {totalItems}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <SheetTitle className="font-display text-2xl md:text-[32px] text-foreground tracking-tight font-medium">
                Your Cart
              </SheetTitle>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-foreground/40 hover:text-primary transition-all duration-300 active:scale-90"
              aria-label="Close cart"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
            <div className="w-20 h-20 rounded-[28px] bg-white/[0.03] border border-white/5 flex items-center justify-center mb-6 relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-[28px] blur-xl group-hover:bg-primary/10 transition-colors" />
              <ShoppingBag className="w-8 h-8 text-muted-foreground/40 relative z-10" />
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-8">Your cart is empty</p>
            <Button
              onClick={handleContinueShopping}
              className="h-11 px-8 rounded-2xl border border-primary/30 bg-transparent text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 font-display text-[11px] tracking-widest uppercase"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 relative z-10 scroll-fade-mask">
              <div className="px-4 md:px-6 py-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-3 p-3 md:p-4 rounded-[20px] md:rounded-[24px] bg-white/[0.02] border border-white/[0.05] group relative"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-[85px] h-[85px] md:w-[100px] md:h-[100px] rounded-[16px] md:rounded-[18px] object-cover border border-white/10"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <h4 className="font-display text-foreground text-sm md:text-lg font-bold tracking-tight uppercase line-clamp-1">
                              {item.product.name}
                            </h4>
                            <p className="text-primary font-bold text-sm md:text-base font-numbers-inter">
                              {formatCurrency(item.product.price, item.product.currencyCode)}
                            </p>
                          </div>
                          <button
                            onClick={() => { haptic("warning"); removeItem(item.product.id); }}
                            className="w-8 h-8 -mt-1 -mr-1 rounded-full flex items-center justify-center text-foreground/20 hover:text-destructive active:bg-destructive/10 transition-all duration-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-3 md:gap-4">
                            <button
                              onClick={() => { haptic("light"); updateQuantity(item.product.id, item.quantity - 1); }}
                              className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center text-foreground/40 hover:text-primary active:border-primary/50 transition-all active:scale-90"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-foreground text-xs md:text-sm font-bold font-numbers-inter w-3 md:w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => { haptic("light"); updateQuantity(item.product.id, item.quantity + 1); }}
                              className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center text-foreground/40 hover:text-primary active:border-primary/50 transition-all active:scale-90"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <span className="text-foreground font-bold text-sm md:text-lg font-numbers-inter tracking-tight">
                            {formatCurrency(
                              item.product.price * item.quantity,
                              item.product.currencyCode,
                            )}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            <div className="px-5 pb-8 pt-4 bg-white/[0.02] backdrop-blur-xl relative z-10 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[10px] md:text-sm font-medium tracking-wide uppercase">Subtotal</span>
                  <span className="text-foreground font-display text-xl md:text-2xl font-bold font-numbers-inter">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] md:text-[11px] text-muted-foreground/60 tracking-wider uppercase">
                  <span>Tax & Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <Button
                onClick={() => { haptic("medium"); checkout(); }}
                disabled={isCheckingOut || isUpdating}
                className="w-full h-12 md:h-14 gradient-gold shimmer-gold text-primary-foreground font-display font-bold text-xs md:text-sm tracking-[0.2em] uppercase rounded-xl md:rounded-2xl hover:opacity-95 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 shadow-[0_8px_30px_rgb(202,138,4,0.15)]"
              >
                {isCheckingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Proceed to Checkout"
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
