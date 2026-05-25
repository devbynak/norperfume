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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="bg-transparent group select-none relative transition-shadow duration-500"
    >
      <div
        className="aspect-[3/4] relative cursor-pointer overflow-hidden rounded-2xl"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {product.discount && (
          <span className="absolute top-3 left-3 md:top-4 md:left-4 z-10 bg-primary/80 backdrop-blur-sm text-primary-foreground text-[9px] md:text-[11px] tracking-wide px-1.5 py-0.5 md:px-3 md:py-1 rounded-full font-bold font-numbers-inter">
            <span className="hidden md:inline">{product.discount}% OFF</span>
            <span className="inline md:hidden">-{product.discount}%</span>
          </span>
        )}

        {/* Mobile Price Overlay (hidden on desktop) */}
        <div className="block md:hidden absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pt-12 pb-3 px-3">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-primary font-bold text-sm font-numbers-inter">
              {formatCurrency(product.price, product.currencyCode)}
            </span>
            {product.originalPrice && (
              <span className="text-white/40 line-through text-[10px] font-light font-numbers-inter">
                {formatCurrency(product.originalPrice, product.currencyCode)}
              </span>
            )}
          </div>
        </div>

        {/* Desktop Overlay (hidden on mobile) */}
        <div className="hidden md:block absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-20 pb-5 px-5">
          <div className="flex items-end justify-between gap-1">
            <div className="space-y-1 overflow-hidden">
              <h4 className="font-display text-xl text-white font-bold tracking-wide truncate">
                {product.name}
              </h4>
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-primary font-bold text-lg font-numbers-inter">
                  {formatCurrency(product.price, product.currencyCode)}
                </span>
                {product.originalPrice && (
                  <span className="text-white/40 line-through text-xs font-light font-numbers-inter">
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
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 shrink-0"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Details (hidden on desktop) */}
      <div
        className="block md:hidden pt-3 pb-1 cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-display text-sm text-white font-bold tracking-wide truncate">
            {product.name}
          </h4>
          <button
            onClick={(event) => {
              event.stopPropagation();
              void addItem(product);
            }}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 shrink-0"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ProductGrid = () => {
  const { data: products = [], isLoading } = useCollectionProducts("best-seller");

  return (
    <section id="collections" className="py-12 md:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 mb-16 text-center">
        <p className="text-[13px] tracking-wide font-medium text-primary mb-2">The Elite Edit</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold tracking-normal">
          Best Sellers
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {isLoading || !products.length ? (
          null
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 text-center px-4">
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-3 border border-white/10 rounded-full px-10 py-3.5 text-[13px] font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 transition-all tracking-wide"
        >
          <ArrowRight className="w-4 h-4" />
          Browse Full Selection
        </Link>
      </div>
    </section>
  );
};

export default ProductGrid;
