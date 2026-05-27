import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ShoppingBag,
  Star,
  Clock,
  Minus,
  Plus,
  ChevronDown,
  Truck,
  Box,
  ShieldCheck,
  Droplets,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import { useHybridProduct, useHybridProducts } from "@/lib/shopify/hooks";
import { formatCurrency, cn } from "@/lib/utils";
import SEO from "@/components/SEO";
import { trackViewContent } from "@/lib/meta-pixel";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { haptic } from "@/lib/haptics";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { accessToken } = useCustomerAuth();
  const [qty, setQty] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [reviewStats, setReviewStats] = useState({ averageRating: 5, totalReviews: 128 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const productQuery = useHybridProduct(id);
  const catalogQuery = useHybridProducts();
  const product = productQuery.data;
  const catalog = catalogQuery.data || [];
  const recommended = catalog.filter((item) => item.id !== product?.id).slice(0, 3);

  const allImages = product?.images?.length ? product.images : (product?.image ? [product.image] : []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  useEffect(() => {
    if (product) {
      trackViewContent(product);
    }
  }, [product]);

  const scrollToImage = useCallback((index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const targetScroll = index * container.offsetWidth;
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth"
      });
      setCurrentImageIndex(index);
    }
  }, []);

  // Handle manual scroll snapping to update index
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const index = Math.round(container.scrollLeft / container.offsetWidth);
      if (index !== currentImageIndex) {
        setCurrentImageIndex(index);
      }
    }
  }, [currentImageIndex]);

  if (!product && productQuery.isLoading) {
    return (
      <main className="min-h-dvh bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-dvh bg-background">
        <Navbar />
        <div className="pt-32 text-center px-4">
          <h1 className="font-display text-3xl text-foreground">Product Not Found</h1>
          <Button variant="outline" className="mt-6 rounded-full" onClick={() => navigate("/products")}>
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

  return (
    <main ref={containerRef} className="min-h-dvh bg-background text-foreground selection:bg-primary/20 overflow-x-hidden relative">
      <SEO 
        title={`${product.name} | NOR PERFUME | Official Online Store`}
        description={product.description || `Discover ${product.name}, a premium handcrafted car fragrance from NOR.`}
      />
      <Navbar />

      {/* Main Content Area: Responsive Grid */}
      <section className="relative pt-[max(8rem,env(safe-area-inset-top,0px)+6rem)] md:pt-[max(11rem,env(safe-area-inset-top,0px)+9rem)] pb-16 md:pb-24">
        {/* Subtle Bottom Blend */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 sm:gap-14 lg:gap-20 xl:gap-24 items-start">
            
            {/* Left Column: Adaptive Gallery */}
            <div className="w-full space-y-4 sm:space-y-6 lg:sticky lg:top-32 max-w-[540px] mx-auto lg:mx-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[4/5] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] group"
              >
                <div 
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x overscroll-x-contain"
                >
                  {allImages.map((img, i) => (
                    <motion.div 
                      key={i} 
                      className="min-w-full h-full snap-center relative will-change-transform"
                      style={{ y: backgroundY }}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - view ${i + 1}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        loading={i === 0 ? "eager" : "lazy"}
                        {...({ fetchpriority: i === 0 ? "high" : "auto" } as any)}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Mobile-First Pagination Overlay */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-2 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/5 z-20">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Go to image ${i + 1}`}
                        onClick={() => { haptic("light"); scrollToImage(i); }}
                        className={cn(
                          "h-1 rounded-full transition-all duration-500",
                          i === currentImageIndex ? "bg-primary w-6" : "bg-white/10 w-1.5"
                        )}
                      />
                    ))}
                  </div>
                )}

                {product.discount && (
                  <div className="absolute top-4 sm:top-8 left-4 sm:left-8 bg-primary text-primary-foreground text-[8px] sm:text-[10px] tracking-[0.2em] font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-md border border-white/10 z-20 shadow-lg">
                    -{product.discount}% OFF
                  </div>
                )}
              </motion.div>

              {/* Responsive Thumbnails (Hidden on very small screens, scrollable on others) */}
              {allImages.length > 1 && (
                <div className="flex gap-3 sm:gap-4 px-1 overflow-x-auto scrollbar-hide snap-x touch-pan-x">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      aria-label={`View image ${i + 1}`}
                      onClick={() => { haptic("light"); scrollToImage(i); }}
                      className={cn(
                        "relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-500 snap-start",
                        i === currentImageIndex 
                          ? "border-primary bg-primary/10 shadow-lg" 
                          : "border-white/5 opacity-40 hover:opacity-100 hover:border-white/20"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Dynamic Editorial Content */}
            <div className="flex flex-col pt-2 sm:pt-4 lg:pt-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6 sm:space-y-8"
              >
                {/* Brand Header: Responsive Typography */}
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex gap-0.5 mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${i < Math.round(reviewStats.averageRating) ? 'fill-primary text-primary' : 'text-white/10'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-white/40 font-bold leading-none">
                      {reviewStats.totalReviews} Verified Reviews
                    </span>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.6em] uppercase text-primary font-bold ml-0.5">The NOR Signature</p>
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[0.85] sm:leading-[0.8] tracking-tighter uppercase italic break-words">
                      {product.name}
                    </h1>
                  </div>
                </div>

                {/* Price & Primary CTA Block */}
                <div className="space-y-8 sm:space-y-10 pt-8 sm:pt-10 border-t border-white/[0.05]">
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-display text-3xl sm:text-4xl md:text-5xl text-white">
                      {formatCurrency(product.price, product.currencyCode)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-white/20 line-through text-base sm:text-lg md:text-xl font-light">
                        {formatCurrency(product.originalPrice, product.currencyCode)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-row gap-3 sm:gap-5 items-center w-full">
                    {/* Quantity: Responsive width */}
                    <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-full px-3 sm:px-6 h-14 sm:h-16 w-[40%] sm:w-[30%] shrink-0 backdrop-blur-xl transition-all hover:bg-white/[0.05]">
                      <button 
                        aria-label="Decrease quantity"
                        onClick={() => { haptic("light"); setQty(Math.max(1, qty - 1)); }} 
                        className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-white/40 hover:text-primary transition-colors active:scale-90"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-numbers-inter font-bold text-sm sm:text-xl tabular-nums">{qty}</span>
                      <button 
                        aria-label="Increase quantity"
                        onClick={() => { haptic("light"); setQty(qty + 1); }} 
                        className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-white/40 hover:text-primary transition-colors active:scale-90"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Add to Cart: Remaining width */}
                    <Button
                      onClick={() => { haptic("success"); handleAddToCart(); }}
                      disabled={!product.availableForSale}
                      className="flex-1 h-14 sm:h-16 gradient-gold text-primary-foreground font-bold text-[10px] sm:text-xs tracking-[0.3em] rounded-full hover:scale-[1.01] transition-all active:scale-[0.98] gap-3 sm:gap-4 shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)]"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span className="truncate">
                        {product.availableForSale ? "ADD TO CART" : "OUT OF STOCK"}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Precise Editorial USP Grid */}
                <div className="grid grid-cols-3 gap-0 py-8 md:py-10 border-y border-white/[0.05] bg-[#121212]/30 rounded-2xl md:rounded-3xl">
                  <div className="flex flex-col items-center text-center space-y-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-primary/80" strokeWidth={1.2} />
                    </div>
                    <span className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-white/30 font-bold">Pure Oils</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-3 px-2 border-x border-white/[0.05]">
                    <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center">
                      <Wind className="w-4 h-4 text-primary/80" strokeWidth={1.2} />
                    </div>
                    <span className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-white/30 font-bold">Zero Toxins</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-primary/80" strokeWidth={1.2} />
                    </div>
                    <span className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-white/30 font-bold">Long Lasting</span>
                  </div>
                </div>

                {/* Adaptive Description */}
                <p className="text-white/50 text-sm sm:text-base md:text-lg leading-relaxed font-light tracking-wide pt-4 sm:pt-6">
                  {product.description || "Crafted for the discerning driver. A symphony of rare essential oils that transforms your cabin into a sanctuary of olfactory depth."}
                </p>

                {/* Refined Adaptive Accordions */}
                <div className="space-y-4 sm:space-y-5 pt-4 sm:pt-6">
                  {[
                    { id: "how", icon: Clock, label: "How to Experience", content: product.details?.howToUse || "Spray 2-3 times on the handcrafted diffusion tag. Suspend freely for an immersive atmosphere." },
                    { 
                      id: "inside", 
                      icon: Box, 
                      label: "What's Inside The Box", 
                      content: (
                        <ul className="space-y-1">
                          <li>• 20ml NOR Premium Fragrance Spray</li>
                          <li>• 2 Handcrafted Luxury Diffusion Tags</li>
                          <li>• 1 Signature Presentation Box</li>
                          <li>• 1 NOR Welcome Card</li>
                        </ul>
                      )
                    },
                    { 
                      id: "shipping", 
                      icon: Truck, 
                      label: "Shipping and Return", 
                      content: (
                        <div className="space-y-4">
                          <div>
                            <p className="font-bold text-white/70 mb-1 uppercase text-[10px] tracking-widest">Shipping:</p>
                            <p>Dispatched within 24-48 hours. Delivered in 3-5 business days across India with premium courier partners.</p>
                          </div>
                          <div>
                            <p className="font-bold text-white/70 mb-1 uppercase text-[10px] tracking-widest">Returns:</p>
                            <p>Due to the personal nature of fragrances, we do not accept returns once opened. Exchanges are only provided for damaged arrivals within 24 hours of delivery.</p>
                          </div>
                        </div>
                      )
                    }
                  ].map((section) => (
                    <div 
                      key={section.id} 
                      className={cn(
                        "group border transition-all duration-700 rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-md",
                        openSection === section.id 
                          ? "bg-white/[0.04] border-primary/20 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]" 
                          : "bg-[#121212]/50 border-white/[0.05] hover:bg-[#121212] hover:border-white/10"
                      )}
                    >
                      <button
                        aria-expanded={openSection === section.id}
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between group outline-none"
                      >
                        <div className="flex items-center gap-4 sm:gap-5">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-700",
                            openSection === section.id 
                              ? "bg-primary border-primary text-primary-foreground shadow-[0_0_25px_rgba(var(--primary-rgb),0.4)] scale-110" 
                              : "bg-white/[0.03] border-white/5 text-primary/60 group-hover:border-primary/30 group-hover:text-primary"
                          )}>
                            <section.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <span className={cn(
                            "text-[10px] sm:text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase transition-colors duration-500",
                            openSection === section.id ? "text-white" : "text-white/80 group-hover:text-white"
                          )}>
                            {section.label}
                          </span>
                        </div>
                        <ChevronDown className={cn(
                          "w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/20 transition-all duration-700 ease-[0.16,1,0.3,1]", 
                          openSection === section.id && "rotate-180 text-primary scale-125"
                        )} />
                      </button>
                      <AnimatePresence initial={false}>
                        {openSection === section.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, scale: 0.98 }}
                            animate={{ height: "auto", opacity: 1, scale: 1 }}
                            exit={{ height: 0, opacity: 0, scale: 0.98 }}
                            transition={{ 
                              height: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                              opacity: { duration: 0.4, delay: 0.1 },
                              scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                            }}
                          >
                            <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-xs sm:text-sm text-white/50 leading-relaxed font-light tracking-wide border-t border-white/[0.02] pt-6 sm:pt-8">
                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                              >
                                {section.content}
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Recommendations */}
      <div className="relative z-10">
        {/* Subtle Top & Bottom Blends for Reviews */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none z-0" />
        
        <ReviewSection 
          productId={product.id} 
          customerId={accessToken || undefined} 
          onStatsChange={(stats) => setReviewStats(stats)}
        />
      </div>

      {recommended.length > 0 && (
        <section className="px-4 sm:px-6 md:px-12 pt-4 pb-16 sm:pt-6 sm:pb-24 md:pt-8 md:pb-32 relative overflow-hidden">
          {/* Subtle Section Blend */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-0" />
          
          <div className="max-w-[1440px] mx-auto relative z-10 px-4 sm:px-8 md:px-12">
            <div className="text-center space-y-2 mb-12 sm:mb-20">
              <p className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-primary font-bold">You May Also Like</p>
              <h2 className="font-display text-3xl sm:text-6xl md:text-7xl text-white tracking-tight italic uppercase">Recommended</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
              {recommended.slice(0, 2).map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: idx * 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative aspect-square md:aspect-[4/3] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden cursor-pointer shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] w-full transition-all duration-700 border border-white/5 hover:border-primary/20"
                  onClick={() => { haptic("medium"); navigate(`/product/${item.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  {/* Background Image */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
                    loading="lazy"
                  />

                  {/* Refined Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Gold Discount Badge (Top Right) */}
                  {item.discount && (
                    <div className="absolute top-6 right-6 z-10 bg-primary text-black text-[10px] sm:text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-md">
                      {item.discount}% OFF
                    </div>
                  )}

                  {/* Content Overlay (Bottom Left & Right) */}
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex items-end justify-between gap-6 z-20">
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl sm:text-4xl md:text-5xl text-white font-bold tracking-widest uppercase leading-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-baseline gap-4">
                        <span className="text-white font-bold text-xl sm:text-3xl md:text-4xl font-numbers-inter">
                          {formatCurrency(item.price, item.currencyCode)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-white/20 line-through text-xs sm:text-lg md:text-xl font-light font-numbers-inter">
                            {formatCurrency(item.originalPrice, item.currencyCode)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        haptic("success");
                        void addItem(item);
                      }}
                      className="w-12 h-12 sm:w-16 sm:h-20 rounded-full bg-primary text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-500 active:scale-95 shrink-0 group/btn"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-10 group-hover/btn:rotate-12 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default ProductDetail;
