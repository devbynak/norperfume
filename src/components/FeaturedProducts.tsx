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
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">The Elite Edit</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground font-bold tracking-wide">
            Most Coveted
          </h2>
        </div>

        {isLoading && !products.length ? (
          <div className="text-center text-muted-foreground">Loading products...</div>
        ) : products.length ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="aspect-[3/4] md:aspect-[3/3.4] relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {product.discount && (
                    <span className="absolute top-4 right-4 z-10 bg-primary/80 backdrop-blur-sm text-primary-foreground text-[10px] tracking-[0.15em] px-4 py-1.5 rounded-full font-medium uppercase font-numbers-inter">
                      {product.discount}% OFF
                    </span>
                  )}

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background via-background/85 to-transparent pt-28 pb-6 px-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl text-foreground tracking-wide mb-1">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-3">
                          <span className="text-foreground font-semibold text-xl font-numbers-inter">
                            {formatCurrency(product.price, product.currencyCode)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-muted-foreground line-through text-sm font-numbers-inter">
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
                        className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
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
