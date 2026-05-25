import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { Zap, FlaskConical, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Counter = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => setDisplayValue(Math.round(latest))
      });
      return controls.stop;
    }
  }, [isInView, value, count]);

  return (
    <span ref={ref} className="font-numbers-inter tabular-nums">
      {displayValue < 10 && suffix === "" ? `0${displayValue}` : displayValue}
      {suffix}
    </span>
  );
};

const features = [
  { 
    title: "240+ SPRAYS", 
    desc: "Engineered for endurance across the longest continental drives.",
    icon: Zap 
  },
  { 
    title: "LUXURY OIL BLEND", 
    desc: "Crafted from the rarest essential extracts globally sourced.",
    icon: FlaskConical
  },
  { 
    title: "SUSTAINED RELEASE", 
    desc: "A molecular structure that ensures consistent olfactory depth.",
    icon: Timer
  },
];

const stats = [
  { value: 2, suffix: "", label: "Curated Fragrance" },
  { value: 100, suffix: "%", label: "PURE ESSENTIAL OILS" },
  { value: 500, suffix: "+", label: "Happy Customers" },
];

const ExperienceSection = () => {
  const [activeIndex, setActiveIndex] = useState(2); // Default to last one as in screenshot

  return (
    <section className="py-12 md:py-20 px-4 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center mb-16 md:mb-20">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-xl">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <p className="text-[9px] tracking-[0.4em] uppercase text-primary font-bold">The Experience</p>
            </div>
            
            <h2 className="font-display text-6xl md:text-8xl text-white leading-[0.9] tracking-tight flex flex-col">
              <span>More Than</span>
              <span className="font-light text-white/60">Just a Scent.</span>
            </h2>

            <div className="space-y-6">
              <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-xl font-light tracking-wide">
                NOR PERFUME was made for people who love their cars the way others love their homes. For the car lover. For the traveller. For the one who notices when the air inside feels exactly right.
              </p>
              <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-xl font-light tracking-wide">
                We curated India's finest luxury car perfume using premium natural essential oils, completely free from toxins and synthetic chemicals. A clean, lasting aroma that fills your cabin, keeps it fresh, and travels with you, quietly and without compromise.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="space-y-12 relative">
              {features.map((f, i) => {
                const isActive = activeIndex === i;
                return (
                  <motion.div
                    key={f.title}
                    onMouseEnter={() => setActiveIndex(i)}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative flex items-center gap-10"
                  >
                    {/* Icon Container (Circle) */}
                    <div className="relative shrink-0">
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border transition-all duration-700 flex items-center justify-center relative z-10 ${
                        isActive 
                          ? "bg-primary/10 border-primary/40" 
                          : "bg-white/[0.03] border-white/10 group-hover:border-white/20"
                      }`}>
                        <f.icon className={`w-6 h-6 md:w-7 md:h-7 transition-all duration-700 ${
                          isActive ? "text-primary" : "text-white/30 group-hover:text-white/50"
                        } stroke-[1.25px]`} />
                      </div>
                    </div>

                    {/* Horizontal Connector and Content Area */}
                    <div className="flex-1 flex items-center justify-between gap-4 relative">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="space-y-2">
                          <h3 className={`text-sm md:text-base font-bold tracking-[0.15em] uppercase transition-colors duration-700 ${
                            isActive ? "text-primary" : "text-white/90 group-hover:text-white"
                          }`}>
                            {f.title}
                          </h3>
                          <p className={`text-xs md:text-sm leading-relaxed font-light max-w-[280px] transition-colors duration-700 ${
                            isActive ? "text-white/70" : "text-white/50"
                          }`}>
                            {f.desc}
                          </p>
                        </div>
                      </div>

                      {/* Large Background Index Number on the Right - reduced size to perfectly fit */}
                      <span className={`font-display text-5xl md:text-6xl transition-all duration-700 pointer-events-none select-none hidden lg:block ${
                        isActive ? "text-primary/[0.15]" : "text-white/[0.05]"
                      }`}>
                        0{i + 1}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-8 border-t border-white/[0.05]">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group flex flex-col items-center text-center relative"
            >
              {/* Subtle vertical divider between items on desktop */}
              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-[-4%] lg:right-[-6%] top-1/2 -translate-y-1/2 w-[1px] h-10 bg-white/[0.05] pointer-events-none" />
              )}

              <div className="flex items-baseline justify-center">
                <span className="font-display text-4xl md:text-5xl text-white font-medium tracking-tight group-hover:text-primary transition-colors duration-500">
                  <Counter value={s.value} suffix={s.suffix} />
                </span>
                <span className="text-primary text-3xl md:text-4xl ml-0.5 select-none font-light animate-pulse">.</span>
              </div>
              
              <p className="text-white/60 group-hover:text-white/85 text-[10px] tracking-[0.2em] uppercase font-bold mt-4 transition-colors duration-500 whitespace-nowrap">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
