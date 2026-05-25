import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Award, Globe, Heart, Droplet, ShieldCheck, Quote, Sparkles, Clock, Box, Truck, ChevronDown } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/SEO";

const values = [
  { icon: Leaf, title: "100% Natural Oils", desc: "We formulate exclusively with pure botanical extracts and organic essential oils. Zero toxins, zero synthetic chemicals." },
  { icon: Award, title: "Artisanal Craftsmanship", desc: "Every NOR fragrance is meticulously blended and hand-poured by certified perfume artisans in India." },
  { icon: Heart, title: "Interior Safety First", desc: "Our zero-liquid solid diffusion tag technology ensures absolutely zero risk of liquid spills or dashboard damage." },
  { icon: Globe, title: "Worldwide Standard", desc: "We adhere strictly to global IFRA standards, delivering international luxury quality at locally affordable prices." },
];

const AboutUs = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <main className="min-h-dvh bg-background text-foreground pb-[env(safe-area-inset-bottom,3rem)]">
      <SEO 
        title="About Us | NOR PERFUME | Official Online Store"
        description="The vision of NOR PERFUME. Discover how our founder Ameen Kasim is redefining automotive luxury through handcrafted 100% pure oil fragrances made affordable."
      />
      <Navbar />
      
      {/* Hero Header Section */}
      <section className="relative px-4 pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[9px] tracking-[0.4em] uppercase text-primary font-bold">Our Heritage</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-7xl text-foreground tracking-tighter uppercase mb-6"
          >
            The Story of NOR
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/80 text-base md:text-xl leading-relaxed max-w-3xl mx-auto font-light"
          >
            NOR was founded with a single, uncompromising belief: that the space inside your vehicle deserves a fragrance profile as sophisticated, safe, and premium as any luxury personal perfume. We are pioneering automotive olfactory art.
          </motion.p>
        </div>
      </section>

      {/* The Vision Section: Pure Essential Oils Made Affordable */}
      <section className="px-4 py-16 md:py-24 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-6 space-y-6"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Droplet className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight text-foreground">
              Our Vision:<br />
              <span className="text-white/60">Pure Luxury, Made Accessible</span>
            </h2>
            <p className="text-muted-foreground/80 leading-relaxed text-sm md:text-base font-light">
              Historically, genuine 100% pure essential oil extracts were reserved exclusively for high-end personal fragrances costing premium fortunes. The automotive market, by contrast, was flooded with cheap, toxic, synthetic chemical gels and headache-inducing paper boards.
            </p>
            <p className="text-muted-foreground/80 leading-relaxed text-sm md:text-base font-light">
              NOR's founding vision is to shatter this paradigm. By leveraging advanced zero-liquid solid diffusion tags and sourcing pure botanical extracts directly, we create premium, safe, all-natural automotive fragrances that are highly affordable. We believe luxury should be an everyday sensory indulgence.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-6 bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6 relative overflow-hidden backdrop-blur-3xl"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="font-display text-lg text-primary tracking-widest uppercase">The Trustable Guarantee</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground">100% Non-Toxic Formulations</h4>
                  <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">Certified free from phthalates, parabens, and hazardous VOCs. Safe for children, pets, and pregnancy.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground">Premium IFRA Compliance</h4>
                  <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">Formulated strictly in compliance with international safety guidelines set by the International Fragrance Association.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground">Eco-Conscious Extraction</h4>
                  <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">Sourced from sustainable farming cooperatives, ensuring fair compensation and environment-friendly distillation.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Meet the Founder Section: Ameen Kasim */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto bg-white/[0.01] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start relative z-10">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Quote className="w-5 h-5 text-primary" />
            </div>
            
            <div className="space-y-6">
              <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-tight uppercase">Founder's Obsession</h2>
              
              <blockquote className="text-white/80 text-sm md:text-base leading-relaxed font-light italic">
                "For years, car perfume was treated as an afterthought—an industrial chemical cocktail to mask odors, often causing headaches and damaging dashboards. My goal in establishing NOR was to change that completely. We are obsessed with botanical authenticity. By combining the absolute purest 100% natural oil extracts with innovative zero-liquid delivery, we've created a luxurious, non-toxic automotive scent profile that is accessible to every car enthusiast."
              </blockquote>
              
              <div className="pt-2">
                <p className="font-display text-sm text-primary tracking-widest uppercase font-bold">Ameen Kasim</p>
                <p className="text-xs text-muted-foreground/60 uppercase tracking-[0.2em] font-medium mt-1">Founder, Owner &amp; Lead Curator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Support Section (Bonus Trustproofs) */}
      <section className="px-4 py-16 md:py-24 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-semibold">Customer Assurance</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground uppercase tracking-tight">Our Standards FAQ</h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01] backdrop-blur-3xl hover:bg-white/[0.03] transition-colors">
              <button
                onClick={() => toggleSection("pure")}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Droplet className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase">Why 100% Pure Essential Oils?</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground/40 transition-transform duration-500 ${openSection === "pure" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openSection === "pure" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-6 pb-6 pt-0 text-sm text-muted-foreground/70 leading-relaxed">
                      Most generic car fresheners rely on synthetic hydrocarbons, parabens, and cheap chemical diffusers that release harmful gases. We extract our compounds directly from pure plants, flowers, and organic spices. This ensures a clean, therapeutic cabin atmosphere that doesn't trigger respiratory distress or headaches.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01] backdrop-blur-3xl hover:bg-white/[0.03] transition-colors">
              <button
                onClick={() => toggleSection("afford")}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Box className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase">How is it affordable?</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground/40 transition-transform duration-500 ${openSection === "afford" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openSection === "afford" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-6 pb-6 pt-0 text-sm text-muted-foreground/70 leading-relaxed">
                      By cutting out standard premium middle-men, distributors, and unnecessary decorative glass bottling costs, and utilizing direct-to-consumer delivery, we transfer every single saved margin back to our buyers. Our investment goes entirely inside the formula, bringing international niche fragrance profiles directly to your car affordably.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01] backdrop-blur-3xl hover:bg-white/[0.03] transition-colors">
              <button
                onClick={() => toggleSection("zero")}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase">What is Zero-Liquid Technology?</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground/40 transition-transform duration-500 ${openSection === "zero" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openSection === "zero" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-6 pb-6 pt-0 text-sm text-muted-foreground/70 leading-relaxed">
                      Instead of using high-risk liquid bottles that can leak, spill, or evaporate instantly when parked under direct sunlight, we infuse our essential oil complexes inside safe, advanced solid diffusion tags. This allows a sustained molecular release of scent for up to 45 days, remaining fully dry and safe for dashboard woods, plastics, and high-end leathers.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Core Pillars Grid */}
      <section className="px-4 py-16 md:py-24 border-t border-white/5 bg-black/[0.15]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-semibold">Quality Architecture</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground uppercase tracking-tight">Our Four Pillars</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-center hover:border-primary/20 transition-all duration-500 hover:bg-white/[0.03]"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-foreground text-sm tracking-wide uppercase font-bold mb-2">{v.title}</h3>
                <p className="text-muted-foreground/60 text-xs leading-relaxed font-light">{v.desc}</p>
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
