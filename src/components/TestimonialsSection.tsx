import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data/testimonials";

const TestimonialsSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Duplicate for infinite effect
  const items = [...testimonials, ...testimonials, ...testimonials];
  
  // Responsive item width: card + gap
  const isMobile = windowWidth < 768;
  const itemWidth = isMobile ? (280 + 20) : (400 + 32); 

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startAnimation = useCallback(async () => {
    await controls.start({
      x: -itemWidth * testimonials.length,
      transition: {
        duration: 40,
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [itemWidth, controls]);

  useEffect(() => {
    void startAnimation();
  }, [itemWidth, startAnimation]);

  const handleArrowClick = (direction: "left" | "right") => {
    setIsPaused(true);
    const currentX = x.get();
    const moveAmount = direction === "left" ? itemWidth : -itemWidth;
    
    void controls.start({
      x: currentX + moveAmount,
      transition: { duration: 0.5, ease: "easeOut" }
    }).then(() => {
      setTimeout(() => {
        setIsPaused(false);
        void startAnimation();
      }, 3000);
    });
  };

  const handleDragStart = () => {
    setIsPaused(true);
    controls.stop();
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      setIsPaused(false);
      void startAnimation();
    }, 2000);
  };

  return (
    <section className="py-12 md:py-16 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 mb-12 md:mb-16 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Customer Love</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground font-bold tracking-tight">
          What They're Saying
        </h2>
      </div>

      <div className="relative group">
        {/* Navigation Arrows - Desktop Only */}
        <button
          onClick={() => handleArrowClick("left")}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-surface-glass border border-white/10 hidden md:flex items-center justify-center text-foreground hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleArrowClick("right")}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-surface-glass border border-white/10 hidden md:flex items-center justify-center text-foreground hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>



        <motion.div
          ref={containerRef}
          style={{ x }}
          animate={controls}
          drag="x"
          dragConstraints={{ left: -itemWidth * testimonials.length * 2, right: 0 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="flex gap-5 md:gap-8 px-4 w-max cursor-grab active:cursor-grabbing"
        >
          {items.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="w-[280px] md:w-[400px] bg-transparent rounded-2xl p-6 md:p-8 flex-shrink-0 select-none"
            >
              <div className="flex gap-1 mb-4 md:mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star 
                    key={j} 
                    className={`w-3.5 h-3.5 md:w-4 md:h-4 ${j < t.rating ? 'fill-primary text-primary' : 'fill-muted/20 text-muted/20'}`} 
                  />
                ))}
              </div>
              <blockquote className="text-foreground/90 leading-relaxed mb-6 md:mb-8 text-[15px] md:text-lg font-light">
                "{t.text}"
              </blockquote>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base md:text-lg border border-primary/20">
                  {t.initial}
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm md:text-base tracking-wide">{t.name}</p>
                  <p className="text-muted-foreground text-[10px] md:text-xs uppercase tracking-widest">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
