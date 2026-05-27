import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useHybridProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "framer-motion";
import { haptic } from "@/lib/haptics";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: products = [] } = useHybridProducts();

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (productId: string) => {
    haptic("light");
    onOpenChange(false);
    setQuery("");
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-[#0d0d0d]/90 backdrop-blur-[40px] border-white/10 !rounded-[32px] shadow-2xl shadow-black/60 outline-none">
        <VisuallyHidden>
          <DialogTitle>Search products</DialogTitle>
        </VisuallyHidden>

        {/* Subtle background light gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="p-6 md:p-8">
            <div className="relative group">
              <input
                id="search-input"
                name="search"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-14 md:h-16 px-6 bg-white/[0.03] border border-white/10 rounded-full text-lg text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all duration-300 font-display tracking-tight"
                autoFocus
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={() => { haptic("light"); setQuery(""); }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-foreground/40 hover:text-foreground transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="px-6 md:px-8 pb-8">
            <AnimatePresence mode="wait">
              {!query.trim() ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-foreground/20">
                    <ShoppingBag className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground/60 font-medium">Discover NOR Fragrances</p>
                    <p className="text-foreground/20 text-sm max-w-[240px]">Type to find luxury car perfumes crafted for the discerning traveller.</p>
                  </div>
                </motion.div>
              ) : filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center"
                >
                  <p className="text-foreground/40 text-sm font-display tracking-widest uppercase">No results found for "{query}"</p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] md:text-[11px] font-display tracking-[0.3em] uppercase text-foreground/40">Results ({filtered.length})</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide overscroll-none">
                    {filtered.map((product, idx) => (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={product.id}
                        onClick={() => handleSelect(product.id)}
                        className="group w-full flex items-center gap-4 p-3 md:p-4 rounded-[20px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 text-left relative overflow-hidden"
                      >
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </div>
                        
                        <div className="relative shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover border border-white/10 group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        
                        <div className="min-w-0 flex-1 space-y-1">
                          <h4 className="text-sm md:text-base font-bold text-foreground tracking-tight uppercase group-hover:text-primary transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-xs text-foreground/40 line-clamp-1 pr-8">
                            {product.description || "Luxury car fragrance"}
                          </p>
                          <p className="text-primary font-bold text-sm font-numbers-inter">
                            {formatCurrency(product.price, product.currencyCode)}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
