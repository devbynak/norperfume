import React from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useCollectionProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/data/products";

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col gap-4 cursor-pointer select-none w-full max-w-sm mx-auto sm:max-w-none"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-[1.25rem] sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)]">
        <img
          src={product.image}
          alt={`Luxury car perfume: ${product.name}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform [transition-duration:1500ms] ease-out"
        />

        {/* Refined Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Gold Discount Badge */}
        {product.discount && (
          <span className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-primary text-black text-[8px] sm:text-[10px] md:text-[11px] font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-xl backdrop-blur-md">
            -{product.discount}%
          </span>
        )}

        {/* Price Overlay (Bottom Left of Image) */}
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex items-baseline gap-1.5 sm:gap-2 z-10">
          <span className="text-primary font-bold text-sm sm:text-lg md:text-xl font-numbers-inter">
            {formatCurrency(product.price, product.currencyCode)}
          </span>
          {product.originalPrice && (
            <span className="text-white/40 line-through text-[8px] sm:text-[10px] md:text-xs font-light font-numbers-inter">
              {formatCurrency(product.originalPrice, product.currencyCode)}
            </span>
          )}
        </div>
      </div>

      {/* Info Below Image */}
      <div className="flex items-center justify-between px-1 sm:px-2">
        <h4 className="font-display text-[10px] sm:text-sm md:text-lg text-white font-bold tracking-widest uppercase truncate flex-1">
          {product.name}
        </h4>
        
        <button
          onClick={(event) => {
            event.stopPropagation();
            void addItem(product);
          }}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-500 active:scale-95 shrink-0 group/btn"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover/btn:rotate-12 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

const ProductGrid = () => {
  const { data: products = [], isLoading } = useCollectionProducts("best-seller");

  return (
    <section id="collections" className="py-8 md:py-32 relative overflow-hidden bg-white/[0.01] backdrop-blur-md bg-gradient-to-b from-white/[0.02] via-transparent to-transparent">
      {/* Top & Bottom Section Blends */}
      <div className="absolute top-0 left-0 right-0 h-20 md:h-40 bg-gradient-to-b from-background via-background/50 to-transparent pointer-events-none z-10" />
      
      {/* Bottom Blend Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 md:h-40 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 mb-8 md:mb-20 text-center relative z-20">
        <p className="text-[9px] md:text-[13px] tracking-[0.3em] uppercase font-medium text-primary/80 mb-2 md:mb-3">The Elite Edit</p>
        <h2 className="font-display text-xl md:text-5xl lg:text-6xl text-foreground font-bold tracking-tight">
          Best Sellers
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-20">
        {isLoading && !products.length ? (
          <div className="min-h-[400px] md:min-h-[600px] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : !products.length && !isLoading ? (
          null
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 md:mt-24 text-center px-4 relative z-20">
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-3 md:gap-4 border border-white/10 rounded-full px-8 py-3.5 md:px-12 md:py-4 text-[11px] md:text-[13px] font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 hover:border-white/20 transition-all tracking-widest uppercase group whitespace-nowrap"
        >
          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
          Browse Full Selection
        </Link>
      </div>
    </section>
  );
};

export default ProductGrid;
