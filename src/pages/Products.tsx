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
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl text-foreground text-center mb-4">
            {heading}
          </h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            {description}
          </p>

          {isLoading && !products.length ? (
            null
          ) : products.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: (index % 2) * 0.05, duration: 0.4 }}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div
                    className="relative overflow-hidden aspect-square bg-muted/5"
                    onClick={() => { haptic("medium"); navigate(`/product/${product.id}`); }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading={index < 2 ? "eager" : "lazy"}
                      {...({ fetchpriority: index < 2 ? "high" : "auto" } as any)}
                      decoding="async"
                    />
                    {product.discount && (
                      <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] tracking-widest uppercase font-bold px-2 py-1 rounded-full font-numbers-inter z-10">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3
                      className="font-display text-lg text-foreground mb-1 group-hover:text-primary transition-colors"
                      onClick={() => { haptic("medium"); navigate(`/product/${product.id}`); }}
                    >
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-semibold font-numbers-inter text-sm">
                          {formatCurrency(product.price, product.currencyCode)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-muted-foreground text-[10px] line-through font-numbers-inter">
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
                        className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 active:scale-90"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              {collectionHandle
                ? `No products founds found in the ${heading} collection.`
                : "No products founds found."}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Products;
