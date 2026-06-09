import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote } from "lucide-react";
import { useRef } from "react";
import SEO from "@/components/SEO";

const values = [
  { 
    title: "Olfactory Architecture", 
    desc: "We don't just blend scents; we architect atmosphere. Using 100% natural oil extracts, we engineer molecular stability for the demanding environment of the modern luxury cabin.",
    image: "/Gemini_Generated_Image_q98tdsq98tdsq98t.jpg",
    className: "lg:col-span-2 lg:row-span-2 h-[450px] sm:h-[600px] lg:h-auto"
  },
  { 
    title: "Artisanal Studio", 
    desc: "Every creation is hand-poured in our Kerala studio. This manual precision ensures the delicate integrity of botanical compounds remains undisturbed by industrial heat.",
    image: "/Gemini_Generated_Image_rtu047rtu047rtu0.jpg",
    className: "lg:col-span-2 lg:row-span-1 h-[350px] sm:h-[400px]"
  },
  { 
    title: "Zero-Liquid Safety", 
    desc: "Our pioneering solid-diffusion technology eliminates the risk of dashboard damage. A dry, molecular release system designed for high-end wood and leather interiors.",
    image: "/Gemini_Generated_Image_3sq4ms3sq4ms3sq4.jpg",
    className: "lg:col-span-1 lg:row-span-1 h-[350px] sm:h-[400px]"
  },
  { 
    title: "Global Compliance", 
    desc: "Operating at the intersection of Indian heritage and international IFRA standards, we deliver niche-quality fragrance profiles with uncompromising safety protocols.",
    image: "/Gemini_Generated_Image_jolcprjolcprjolc.jpg",
    className: "lg:col-span-1 lg:row-span-1 h-[350px] sm:h-[400px]"
  },
];

const AboutUs = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#020202] text-foreground selection:bg-primary/30 overflow-x-hidden" ref={containerRef}>
      <SEO 
        title="The Story of NOR | Artisanal Luxury Car Perfumes"
        description="Redefining automotive luxury. Learn how founder Ameen Kasim creates the world's best artisanal car fragrances using pure essential oils and zero-toxic chemicals."
      />
      <Navbar />
      
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[#0a0a0a]">
        <motion.div 
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/Gemini_Generated_Image_3sq4ms3sq4ms3sq4.jpg" 
            alt="Artisanal Heritage" 
            className="w-full h-full object-cover brightness-[0.35] contrast-[1.1] saturate-[0.9]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-[#0a0a0a] z-10" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
        </motion.div>

        {/* Background Texture/Grain */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <motion.div 
          style={{ y: titleY, opacity: titleOpacity }}
          className="text-center z-20 relative"
        >
          <div className="relative group flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <span className="text-[10px] tracking-[0.8em] uppercase text-primary font-black py-2 px-8 backdrop-blur-sm">
                Our Heritage
              </span>
            </motion.div>
            
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-display text-5xl sm:text-7xl md:text-[12rem] lg:text-[14rem] text-white leading-none tracking-tighter uppercase font-black drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              The
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
              className="font-display text-4xl sm:text-6xl md:text-[14rem] lg:text-[18rem] leading-[0.75] uppercase tracking-[0.1em] text-primary select-none mt-[-1vw] md:mt-[-3vw] drop-shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
            >
              Story
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 md:mt-12 text-white/40 font-display text-base md:text-2xl italic font-light lowercase tracking-tight max-w-2xl mx-auto px-6"
            >
              Transforming the automotive cabin into a sanctuary of botanical art and molecular precision.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* The Alchemy of Vision Section */}
      <section className="px-4 md:px-6 py-20 md:py-40 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-6 md:space-y-12"
            >
              <div className="space-y-4 md:space-y-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em]">The Vision</span>
                <h2 className="font-display text-3xl sm:text-5xl md:text-8xl text-white uppercase tracking-tighter leading-[0.8]">
                  Pure Luxury <br /> <span className="text-primary italic font-light lowercase">Accessible</span>
                </h2>
              </div>
              
              <div className="space-y-4 md:space-y-8 text-white/50 text-sm sm:text-base md:text-xl font-light leading-relaxed border-l border-primary/30 pl-4 md:pl-12">
                <p>
                  Historically, automotive fragrance was an industrial afterthought—a cocktail of synthetic hydrocarbons designed to mask rather than elevate. The world's most precious 100% natural oil extracts were reserved exclusively for niche personal perfumery.
                </p>
                <p>
                  NOR was founded to bridge this divide. By leveraging advanced solid-state diffusion and direct botanical sourcing, we've created a new category: high-end automotive olfactory art that is as safe for the breath as it is sophisticated for the soul.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative mt-12 lg:mt-0"
            >
              <div className="aspect-[4/5] rounded-[30px] md:rounded-[60px] overflow-hidden border border-white/10 relative group">
                <img 
                  src="/Gemini_Generated_Image_q98tdsq98tdsq98t.jpg" 
                  alt="Botanical Extraction" 
                  className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-[2s]"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-1000" />
              </div>
              {/* Floating Stat */}
              <div className="absolute -bottom-4 -left-4 md:-bottom-10 md:-left-10 p-4 md:p-8 rounded-[20px] md:rounded-[40px] bg-primary/10 border border-primary/20 backdrop-blur-3xl shadow-2xl space-y-1 hidden sm:block">
                <span className="text-2xl md:text-4xl font-display text-primary uppercase leading-none">100%</span>
                <p className="text-[6px] md:text-[8px] uppercase tracking-[0.2em] font-black text-white/60">Natural Oil Extracts</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder's Studio Section */}
      <section className="px-4 md:px-6 py-20 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/[0.02] -skew-y-3" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-6 lg:order-2"
            >
              <div className="relative aspect-square md:aspect-[4/5] rounded-[30px] md:rounded-[60px] overflow-hidden border border-white/10 group">
                <img 
                  src="/IMG_9413.jpg" 
                  alt="NOORUL AMEEN KASIM" 
                  className="w-full h-full object-cover grayscale brightness-75 contrast-[1.1] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6 space-y-6 md:space-y-12 mt-12 lg:mt-0"
            >
              <div className="space-y-4 md:space-y-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em]">The Curator</span>
                <h2 className="font-display text-3xl sm:text-5xl md:text-8xl text-white uppercase tracking-tighter leading-[0.8]">
                  Founder's <br /> <span className="text-primary italic font-light lowercase">Obsession</span>
                </h2>
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-6 -left-2 md:-top-12 md:-left-8 w-12 h-12 md:w-24 md:h-24 text-primary/5 -z-10" />
                <p className="text-white/80 text-base md:text-2xl font-light italic leading-relaxed">
                  "Car perfume should never be an afterthought. We are obsessed with botanical authenticity—treating every milliliter of essential oil with the reverence of a master jeweler. Our goal is to ensure the air you breathe is as luxurious as the car you drive."
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-display text-lg md:text-2xl text-primary tracking-widest uppercase font-bold">NOORUL AMEEN KASIM (AK)</p>
                <p className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-[0.4em] font-medium">FOUNDER</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Core Pillars Grid */}
      <section className="px-6 py-24 md:py-40 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
          <div className="space-y-6 text-center">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em]">Quality Architecture</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-8xl text-white uppercase tracking-tighter">The Four <span className="text-primary italic font-light lowercase">Pillars</span></h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-fr">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className={`group relative overflow-hidden rounded-[40px] border border-white/10 ${v.className}`}
              >
                {/* Full-bleed Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={v.image} 
                    alt={v.title}
                    className="w-full h-full object-cover grayscale brightness-[0.3] group-hover:grayscale-0 group-hover:brightness-50 group-hover:scale-110 transition-all duration-[2s] ease-out"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                </div>

                {/* Glassmorphism Content Card */}
                <div className="absolute inset-0 z-10 p-6 md:p-12 flex flex-col justify-end">
                  <div className="space-y-4 md:space-y-6 translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <div className="space-y-1 md:space-y-2">
                      <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.4em] opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        Pillar 0{i + 1}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl md:text-5xl text-white uppercase tracking-tighter leading-none">
                        {v.title.split(' ')[0]} <br />
                        <span className="text-primary italic font-light lowercase">{v.title.split(' ').slice(1).join(' ')}</span>
                      </h3>
                    </div>
                    
                    <p className="text-white/60 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-md opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      {v.desc}
                    </p>
                    
                    <div className="pt-2 md:pt-4 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                      <div className="w-12 h-px bg-primary lg:group-hover:w-full transition-all duration-1000" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutUs;
