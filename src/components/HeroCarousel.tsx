import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useHeroSlides } from "@/lib/shopify/hooks";

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { data: slides, isLoading } = useHeroSlides();

  const getDescriptors = (title: string) => {
    const normalizedTitle = title.toUpperCase();
    if (normalizedTitle.includes('MUSK')) {
      return (
        <>
          Oud <span className="text-primary/45 mx-1.5">•</span> Spicy <span className="text-primary/45 mx-1.5">•</span> Musk
        </>
      );
    }
    // Default to Aqua/Fresh descriptors
    return (
      <>
        Fresh <span className="text-primary/45 mx-1.5">•</span> Sea <span className="text-primary/45 mx-1.5">•</span> Herbaceous
      </>
    );
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const timer = window.setInterval(
      () => setCurrent((value) => (value + 1) % slides.length),
      5000,
    );

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    setCurrent((value) => (slides.length && value < slides.length ? value : 0));
  }, [slides.length]);

  if (isLoading && !slides.length) {
    return (
      <section className="relative h-dvh w-full overflow-hidden bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </section>
    );
  }

  if (!slides.length) {
    return null;
  }

  const currentSlide = slides[current];
  const prev = () => setCurrent((value) => (value - 1 + slides.length) % slides.length);
  const next = () => setCurrent((value) => (value + 1) % slides.length);

  return (
    <section className="relative h-dvh w-full overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -50) {
              next();
            } else if (offset.x > 50) {
              prev();
            }
          }}
          onTap={() => {
            const targetUrl = currentSlide.ctaHref && currentSlide.ctaHref !== "#collections" ? currentSlide.ctaHref : "/products";
            navigate(targetUrl);
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {isMobile ? (
            currentSlide.mobileVideo ? (
              <video
                key={currentSlide.mobileVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                poster={currentSlide.mobileImage || currentSlide.image}
              >
                <source src={currentSlide.mobileVideo} />
              </video>
            ) : (
              <img
                src={currentSlide.mobileImage || currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover"
                width={1080}
                height={1440}
                loading={current === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            )
          ) : (
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
              loading={current === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        <h1 className="sr-only">NOR PERFUME | Official Online Store</h1>
        <motion.h2
          key={`heading-${currentSlide.id}`}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(2.5rem,7vw,5.5rem)] text-foreground leading-[1.1] mb-6 tracking-normal"
        >
          Signature Series
        </motion.h2>
        {currentSlide.description && (
          <motion.p
            key={`desc-${currentSlide.id}`}
            initial={{ opacity: 0, y: 15, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(0.9rem,2.5vw,1.4rem)] text-foreground/60 max-w-lg mx-auto leading-relaxed tracking-normal font-light"
          >
            {currentSlide.description}
          </motion.p>
        )}
        <motion.div
          key={`cta-${currentSlide.id}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to="/products"
            className="mt-12 px-12 py-3.5 glass-card rounded-full text-foreground text-[12px] font-medium tracking-wide hover:bg-white/10 transition-all duration-500 backdrop-blur-md inline-block"
          >
            Explore NOR
          </Link>
        </motion.div>
      </div>

      <Link 
        to={currentSlide.ctaHref && currentSlide.ctaHref !== "#collections" ? currentSlide.ctaHref : "/products"}
        className="absolute bottom-12 left-6 md:left-16 z-20 block"
      >
        <motion.div
          key={`card-${currentSlide.id}`}
          initial={{ opacity: 0, x: -10, filter: "blur(5px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
          transition={{ 
            delay: 0.3, 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="bg-white/[0.02] backdrop-blur-3xl rounded-lg p-5 md:p-6 max-w-[240px] border border-white/10 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-700 group relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:shadow-[0_8px_32px_0_rgba(212,175,55,0.08)]"
        >
          {/* Elegant gold ambient back-glow inside the glass */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/[0.05] rounded-full blur-xl pointer-events-none group-hover:bg-primary/[0.1] transition-all duration-700 ease-out" />
          
          {/* Elegant light sweep shine reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-[8.5px] uppercase tracking-[0.28em] font-semibold text-foreground/30 mb-2.5 block"
          >
            {currentSlide.subtitle || "Bestseller"}
          </motion.span>
          <motion.h3 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="font-display text-xl md:text-2.5xl text-foreground tracking-[0.08em] leading-tight group-hover:text-primary transition-colors duration-500"
          >
            {currentSlide.title}
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-[8px] md:text-[8.5px] uppercase tracking-[0.24em] text-foreground/45 mt-5 font-light leading-relaxed whitespace-nowrap"
          >
            {getDescriptors(currentSlide.title)}
          </motion.p>
        </motion.div>
      </Link>

    </section>
  );
};

export default HeroCarousel;
