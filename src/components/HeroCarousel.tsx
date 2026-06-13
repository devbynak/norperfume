import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useHeroSlides } from "@/lib/shopify/hooks";
import logo from "@/assets/logo.png";

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { data: slides, isLoading } = useHeroSlides();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

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

  if (!slides.length && isLoading) {
    return (
      <section className="relative h-dvh w-full overflow-hidden bg-background" />
    );
  }

  if (!slides.length && !isLoading) {
    return null;
  }

  const currentSlide = slides[current];
  const prev = () => setCurrent((value) => (value - 1 + slides.length) % slides.length);
  const next = () => setCurrent((value) => (value + 1) % slides.length);

  return (
    <section ref={containerRef} className="relative h-dvh w-full overflow-hidden">
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
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-y overflow-hidden group"
          style={{ y, opacity }}
        >
          <motion.div 
            className="w-full h-full"
            style={{ scale }}
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
                  alt={`Experience ${currentSlide.title} luxury car fragrance`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms] ease-out"
                  width={1080}
                  height={1440}
                  loading={current === 0 ? "eager" : "lazy"}
                  {...({ fetchPriority: current === 0 ? "high" : "auto" } as any)}
                  decoding="async"
                />
              )
            ) : (
              <img
                src={currentSlide.image}
                alt={`Premium car perfume: ${currentSlide.title}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms] ease-out"
                width={1920}
                height={1080}
                loading={current === 0 ? "eager" : "lazy"}
                {...({ fetchPriority: current === 0 ? "high" : "auto" } as any)}
                decoding="async"
              />
            )}
          </motion.div>

          {/* Bottom Blend Effect to merge with marquee/badges */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        <h1 className="sr-only">NOR PERFUME | Official Online Store</h1>
        <motion.div
          key={`heading-${currentSlide.id}`}
          initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 relative"
        >
          {/* Subtle Background Glow behind logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/[0.08] rounded-full blur-[80px] pointer-events-none z-0" />
          
          <img 
            src="/5.png" 
            alt="NOR PERFUME Logo - Premium Car Fragrances Official" 
            className="w-auto h-[clamp(6rem,20vw,14rem)] filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] relative z-10" 
            loading="eager"
          />
        </motion.div>
        {currentSlide.description && (
          <motion.p
            key={`desc-${currentSlide.id}`}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(0.9rem,3.2vw,1.6rem)] text-foreground/80 max-w-2xl mx-auto leading-relaxed tracking-normal font-light px-4"
          >
            {currentSlide.description}
          </motion.p>
        )}
        <motion.div
          key={`cta-${currentSlide.id}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 md:mt-10"
        >
          <Link
            to="/products"
            className="px-8 py-3 md:px-12 md:py-3.5 glass-card rounded-full text-foreground text-[10px] md:text-[12px] font-medium tracking-[0.2em] uppercase hover:bg-white/10 transition-all duration-500 backdrop-blur-md inline-block whitespace-nowrap"
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
