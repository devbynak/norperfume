import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCollectionProducts, useHybridCollections, useHybridProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";
import { haptic } from "@/lib/haptics";

const Products = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const collectionHandle = searchParams.get("collection") || "";

  const allProductsQuery = useHybridProducts();
  const collectionsQuery = useHybridCollections();
  const collectionProductsQuery = useCollectionProducts(collectionHandle);

  const selectedCollection = collectionHandle
    ? (collectionsQuery.data || []).find((collection) => collection.handle === collectionHandle)
    : undefined;

  const products = collectionHandle
    ? collectionProductsQuery.data
    : (allProductsQuery.data || []);
  const isLoading = collectionHandle
    ? collectionProductsQuery.isLoading || collectionsQuery.isLoading
    : allProductsQuery.isLoading;

  const heading = selectedCollection?.title || "Our Collection";
  const description =
    selectedCollection?.description ||
    (collectionHandle
      ? `Explore products from the ${heading} Shopify collection.`
      : "Discover our full range of perfumes.");

  return (
    <main className="min-h-dvh bg-background">
      <SEO 
        title={`${heading} | NOR PERFUME | Official Online Store`}
        description={description}
      />
      <Navbar />
      <section className="pt-28 md:pt-40 pb-20 px-4 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-10 md:mb-24 text-center space-y-4">
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground font-bold tracking-tight">
              {heading}
            </h1>
            <p className="text-muted-foreground/60 text-sm md:text-lg max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
              {description}
            </p>
          </div>

          {isLoading && !products.length ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : products.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8 lg:gap-10">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: (index % 3) * 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex flex-col cursor-pointer w-full max-w-sm mx-auto sm:max-w-none"
                  onClick={() => { haptic("medium"); navigate(`/product/${product.id}`); }}
                >
                  {/* Image Area */}
                  <div className="relative aspect-square md:aspect-[4/3.5] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                      loading={index < 3 ? "eager" : "lazy"}
                      {...({ fetchpriority: index < 3 ? "high" : "auto" } as any)}
                      decoding="async"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Gold Discount Badge */}
                    {product.discount && (
                      <span className="absolute top-4 left-4 z-10 bg-primary text-black text-[9px] md:text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl backdrop-blur-md">
                        {product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Info Area Below Image */}
                  <div className="px-1 flex flex-col gap-4">
                    <div className="space-y-2">
                      <h3 className="font-display text-lg md:text-2xl text-white font-bold tracking-widest uppercase leading-tight group-hover:text-primary transition-colors duration-500">
                        {product.name}
                      </h3>
                      <p className="text-white/40 text-[10px] md:text-xs font-light tracking-wide line-clamp-2 leading-relaxed">
                        {product.description || `${product.name} is a premium car interior perfume designed to transform your driving experience.`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-3">
                        <span className="text-primary font-bold text-lg md:text-2xl font-numbers-inter">
                          {formatCurrency(product.price, product.currencyCode)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-white/20 line-through text-[11px] md:text-sm font-light font-numbers-inter">
                            {formatCurrency(product.originalPrice, product.currencyCode)}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          haptic("success");
                          void addItem(product);
                        }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/[0.04] border border-white/5 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all duration-500 active:scale-95 shrink-0 group/btn"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:rotate-12 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/[0.01] border border-white/5 border-dashed rounded-[3rem]">
              <p className="text-muted-foreground font-light tracking-widest uppercase text-xs">
                {collectionHandle
                  ? `No products found in the ${heading} collection.`
                  : "No products found."}
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Products;
