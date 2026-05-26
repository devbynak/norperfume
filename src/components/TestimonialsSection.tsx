import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";
import { testimonials } from "@/data/testimonials";

const TestimonialsSection = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Duplicate for infinite effect
  const items = [...testimonials, ...testimonials, ...testimonials];
  
  // Responsive item width: card + gap
  const isMobile = windowWidth < 768;
  const itemWidth = isMobile ? (260 + 12) : (320 + 16); 

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

  const handleDragStart = () => {
    controls.stop();
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      void startAnimation();
    }, 2000);
  };

  return (
    <section className="py-12 md:py-20 overflow-hidden relative bg-background">
      <div className="max-w-6xl mx-auto px-4 mb-12 md:mb-16 text-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-bold mb-4">Customer Love</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground font-bold tracking-tight">
          What They're Saying
        </h2>
      </div>

      <div className="relative group">
        <motion.div
          ref={containerRef}
          style={{ x }}
          animate={controls}
          drag="x"
          dragConstraints={{ left: -itemWidth * testimonials.length * 2, right: 0 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="flex gap-3 md:gap-4 px-4 w-max cursor-grab active:cursor-grabbing"
        >
          {items.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="w-[260px] md:w-[320px] bg-white/[0.02] border border-white/[0.05] rounded-[24px] md:rounded-[32px] p-5 md:p-7 flex-shrink-0 select-none flex flex-col justify-between min-h-[240px] md:min-h-[300px] hover:bg-white/[0.04] transition-colors duration-500"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star 
                        key={j} 
                        className={`w-2.5 h-2.5 md:w-3 md:h-3 ${j < t.rating ? 'fill-primary text-primary' : 'fill-white/5 text-white/5'}`} 
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10">
                    <CheckCircle2 className="w-2 h-2 text-primary" />
                    <span className="text-[7px] md:text-[8px] font-display tracking-widest uppercase text-primary font-bold">Verified</span>
                  </div>
                </div>

                <blockquote className="text-foreground/60 leading-relaxed text-xs md:text-[15px] font-light tracking-wide italic line-clamp-4">
                  "{t.text}"
                </blockquote>
              </div>

              <div className="space-y-0.5">
                <p className="text-foreground font-bold text-xs md:text-sm tracking-[0.1em] uppercase">{t.name.split(' ')[0]}</p>
                <p className="text-white/20 text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-medium">NOR Enthusiast</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;