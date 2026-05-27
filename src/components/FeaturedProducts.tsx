import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useCollectionProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: products = [], isLoading } = useCollectionProducts("best-seller");

  return (
    <section className="relative py-12 md:py-24 px-4 overflow-hidden">
      {/* Top Blend Effect */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background via-background/50 to-transparent pointer-events-none z-10" />
      
      {/* Bottom Blend Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="mb-10 md:mb-16 text-center">
          <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-primary/80 mb-2 md:mb-3 font-medium">The Elite Edit</p>
          <h2 className="font-display text-2xl md:text-5xl lg:text-6xl text-foreground font-bold tracking-tight">
            Most Coveted
          </h2>
        </div>

        {isLoading && !products.length ? (
          null
        ) : products.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50, filter: "blur(15px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                className="group relative aspect-square md:aspect-[4/3] lg:aspect-[1.1/1] rounded-[2rem] md:rounded-[3rem] overflow-hidden cursor-pointer shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] w-full max-w-lg mx-auto md:max-w-none"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Background Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />

                {/* Refined Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Gold Discount Badge (Top Right) */}
                {product.discount && (
                  <span className="absolute top-6 right-6 z-10 bg-primary text-black text-[10px] md:text-xs font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md">
                    {product.discount}% OFF
                  </span>
                )}

                {/* Content Overlay (Bottom Left & Right) */}
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex items-end justify-between gap-6 z-20">
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl md:text-4xl text-white font-bold tracking-widest uppercase leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-4">
                      <span className="text-white font-bold text-lg md:text-2xl font-numbers-inter">
                        {formatCurrency(product.price, product.currencyCode)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-white/40 line-through text-xs md:text-sm font-light font-numbers-inter">
                          {formatCurrency(product.originalPrice, product.currencyCode)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      void addItem(product);
                    }}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-500 active:scale-95 shrink-0 group/btn"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 group-hover/btn:rotate-12 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">No products found.</div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
