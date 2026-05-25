import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Star,
  Clock,
  Minus,
  Plus,
  ChevronDown,
  Truck,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import { useHybridProduct, useHybridProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";
import SEO from "@/components/SEO";
import { trackViewContent } from "@/lib/meta-pixel";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { haptic } from "@/lib/haptics";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useCustomerAuth();
  const [qty, setQty] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const productQuery = useHybridProduct(id);
  const catalogQuery = useHybridProducts();
  const product = productQuery.data;
  const catalog = catalogQuery.data || [];
  const recommended = catalog.filter((item) => item.id !== product?.id).slice(0, 3);

  const allImages = product?.images?.length ? product.images : (product?.image ? [product.image] : []);

  useEffect(() => {
    if (product) {
      trackViewContent(product);
    }
  }, [product]);

  const scrollToImage = useCallback((index: number) => {
    if (scrollRef.current) {
      isScrollingRef.current = true;
      const container = scrollRef.current;
      const targetScroll = index * container.offsetWidth;
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth"
      });
      setCurrentImageIndex(index);
      
      // Reset the scrolling flag after animation finishes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  }, []);

  // Auto-advance images
  useEffect(() => {
    if (!allImages.length || allImages.length === 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const nextIndex = (prev + 1) % allImages.length;
        scrollToImage(nextIndex);
        return nextIndex;
      });
    }, 6000);
    
    return () => clearInterval(interval);
  }, [allImages.length, scrollToImage]);

  const handleScroll = () => {
    if (scrollRef.current && !isScrollingRef.current) {
      const container = scrollRef.current;
      const index = Math.round(container.scrollLeft / container.offsetWidth);
      if (index !== currentImageIndex) {
        setCurrentImageIndex(index);
      }
    }
  };

  if (!product && productQuery.isLoading) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <main className="min-h-dvh bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl text-foreground">Product Not Found</h1>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAddToCart = async () => {
    await addItem(product, qty);
  };

  const toggleSection = (section: string) => {
    haptic("light");
    setOpenSection(openSection === section ? null : section);
  };

  const productSchema = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.image, ...(product.images || [])],
    "description": product.description || `Luxury car fragrance ${product.name} by NOR.`,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "NOR"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": product.currencyCode || "INR",
      "price": product.price,
      "availability": product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  } : null;

  return (
    <main className="min-h-dvh bg-background text-foreground pb-[env(safe-area-inset-bottom,3rem)]">
      <SEO 
        title={`${product.name} | NOR PERFUME | Official Online Store`}
        description={product.description || `Discover ${product.name}, a premium handcrafted car fragrance from NOR. 100% natural oils with zero-liquid technology.`}
        keywords={`${product.name}, car perfume, luxury fragrance, NOR perfume, automotive scent`}
        schema={productSchema}
      />
      <Navbar />

      <section className="px-4 md:pl-20 md:pr-8 pt-24 pb-8 md:pt-40 md:pb-12">
        <div className="max-w-6xl lg:max-w-7xl xl:max-w-[1320px] mx-auto space-y-12 md:space-y-16">
          {/* Top Row Grid: Image Gallery left & Title details right */}
          <div className="grid md:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-7 relative"
            >
              {/* Gallery Wrapper */}
              <div className="space-y-6 md:space-y-0 md:flex md:flex-row-reverse md:items-start md:gap-6">
                {/* Main Image Glass Container with Horizontal Scroll */}
                <div className="flex-1 aspect-[4/5] md:aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-white/[0.03] backdrop-blur-3xl border border-white/10 relative shadow-2xl group w-full">
                  <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x"
                    style={{ scrollSnapType: 'x mandatory' }}
                  >
                    {allImages.map((img, i) => (
                      <div key={i} className="min-w-full h-full snap-center relative">
                        <img
                          src={img}
                          alt={`${product.name} - ${i + 1}`}
                          className="w-full h-full object-cover"
                          {...({ fetchpriority: i === 0 ? "high" : "auto" } as any)}
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Floating Glass Pagination */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 z-10">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { haptic("light"); scrollToImage(i); }}
                          className={`h-1 rounded-full transition-all duration-500 ${
                            i === currentImageIndex ? "bg-primary w-6 md:w-8" : "bg-white/20 w-1.5 md:w-2"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Discount Tag with Glass Effect */}
                  {product.discount && (
                    <span className="absolute top-6 md:top-8 left-6 md:left-8 bg-primary text-primary-foreground text-[9px] md:text-[11px] tracking-[0.2em] uppercase font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full z-10 backdrop-blur-md border border-white/10 shadow-lg">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                
                {/* Scrollable Thumbnails with Glass Morphism */}
                {allImages.length > 1 && (
                  <div className="hidden md:flex md:flex-col gap-3 md:gap-4 shrink-0 w-20 justify-start mb-0">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => { haptic("light"); scrollToImage(i); }}
                        className={`relative w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-500 snap-start border-2 ${
                          i === currentImageIndex 
                            ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(202,138,4,0.15)]" 
                            : "border-white/5 bg-white/[0.03] backdrop-blur-md grayscale-[0.3] hover:grayscale-0"
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`${product.name} view ${i + 1}`} 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Title / Details Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-5 flex flex-col justify-center lg:pl-12"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-12 mt-6 md:mt-0">
                <div className="flex gap-0.5 md:gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-muted-foreground/60 text-[8px] md:text-[9px] tracking-[0.4em] uppercase font-bold ml-2 md:ml-3 border-l border-white/10 pl-3 md:pl-4">128 Verified Reviews</span>
              </div>

              <p className="text-[10px] md:text-[11px] tracking-[0.5em] md:tracking-[0.6em] uppercase text-primary/80 font-bold mb-4 md:mb-6 ml-1">The NOR Signature</p>
              <h1 className="font-display text-5xl md:text-8xl text-foreground mb-8 md:mb-12 leading-[0.85] tracking-tighter uppercase italic">
                {product.name}
              </h1>
            </motion.div>
          </div>

          {/* Bottom Details Row (Full Width on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 pt-4 md:pt-8"
          >
            <div className="flex items-baseline gap-4 md:gap-6 justify-start">
              <span className="font-display text-3xl md:text-5xl text-foreground">
                {formatCurrency(product.price, product.currencyCode)}
              </span>
              {product.originalPrice && (
                <span className="text-muted-foreground/40 line-through text-xl md:text-2xl">
                  {formatCurrency(product.originalPrice, product.currencyCode)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground/80 leading-relaxed text-sm md:text-lg w-full font-light">
                {product.description}
              </p>
            )}

            <div className="flex flex-row items-center gap-3 md:gap-4 max-w-xl md:max-w-2xl">
              <div className="flex items-center justify-between bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-full px-2 md:px-3 h-[56px] md:h-[60px] w-[112px] md:w-[128px] shrink-0">
                <button
                  onClick={() => { haptic("light"); setQty(Math.max(1, qty - 1)); }}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors outline-none"
                >
                  <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <span className="w-6 md:w-7 text-center text-sm md:text-base font-bold font-numbers-inter">
                  {qty}
                </span>
                <button
                  onClick={() => { haptic("light"); setQty(qty + 1); }}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors outline-none"
                >
                  <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
              <Button
                onClick={() => { haptic("success"); handleAddToCart(); }}
                disabled={!product.availableForSale}
                className="flex-1 h-auto min-h-[56px] md:min-h-[60px] py-5 md:py-6 gradient-gold text-primary-foreground font-bold text-xs md:text-sm tracking-[0.2em] rounded-full hover:opacity-90 transition-all gap-3 md:gap-4 disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5" />
                {product.availableForSale ? "ADD TO CART" : "OUT OF STOCK"}
              </Button>
            </div>

            {/* Accordions */}
            <div className="space-y-4 max-w-4xl pt-2">
              {/* HOW TO USE */}
              <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01] backdrop-blur-3xl hover:bg-white/[0.03] transition-colors">
                <button
                  onClick={() => toggleSection("how")}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase">HOW TO USE</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground/40 transition-transform duration-500 ${openSection === "how" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openSection === "how" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 pt-0 text-sm text-muted-foreground/70 leading-relaxed">
                        {product.details?.howToUse || "Spray 2-3 times on the NOR diffusion tag. Hang it freely in your car for a lasting fragrance experience. Re-spray as needed to maintain intensity."}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* WHAT'S INSIDE THE BOX */}
              <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01] backdrop-blur-3xl hover:bg-white/[0.03] transition-colors">
                <button
                  onClick={() => toggleSection("inside")}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Box className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase">WHAT'S INSIDE THE BOX</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground/40 transition-transform duration-500 ${openSection === "inside" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openSection === "inside" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 pt-0 text-sm text-muted-foreground/70 leading-relaxed">
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3">
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            20ml NOR Premium Fragrance Spray
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            2 Handcrafted Luxury Diffusion Tags
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            1 Signature Presentation Box
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            1 NOR Welcome Card
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SHIPPING AND RETURN */}
              <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01] backdrop-blur-3xl hover:bg-white/[0.03] transition-colors">
                <button
                  onClick={() => toggleSection("shipping")}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase">SHIPPING AND RETURN</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground/40 transition-transform duration-500 ${openSection === "shipping" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openSection === "shipping" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 pt-0 text-sm text-muted-foreground/70 leading-relaxed space-y-3">
                        <p><strong className="text-foreground">Shipping:</strong> Dispatched within 24-48 hours. Delivered in 3-5 business days across India with premium courier partners.</p>
                        <p><strong className="text-foreground">Returns:</strong> Due to the personal nature of fragrances, we do not accept returns once opened. Exchanges are only provided for damaged arrivals within 24 hours of delivery.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ReviewSection productId={product.id} customerId={isAuthenticated ? "self" : undefined} />

      {recommended.length > 0 && (
        <section className="px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-primary text-center mb-2">
              You May Also Like
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground text-center mb-10">
              Recommended
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-10">
              {recommended.map((recommendedProduct, index) => (
                <motion.div
                  key={recommendedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    haptic("medium");
                    navigate(`/product/${recommendedProduct.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="group cursor-pointer bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={recommendedProduct.image}
                      alt={recommendedProduct.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-foreground">
                      {recommendedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-primary font-semibold">
                        {formatCurrency(
                          recommendedProduct.price,
                          recommendedProduct.currencyCode,
                        )}
                      </span>
                      {recommendedProduct.originalPrice && (
                        <span className="text-muted-foreground text-xs line-through">
                          {formatCurrency(
                            recommendedProduct.originalPrice,
                            recommendedProduct.currencyCode,
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <div className="h-[env(safe-area-inset-bottom,24px)] md:hidden" />
    </main>
  );
};

export default ProductDetail;
