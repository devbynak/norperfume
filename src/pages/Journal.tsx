import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Sparkles, Leaf, ShieldCheck, Droplet, Star, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const Journal = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Why Essential Oils are Replacing Synthetic Car Fresheners in Luxury Vehicles",
    "description": "Discover why luxury car owners in India and UAE are switching from synthetic car perfumes to natural essential oil fragrances for safety, health, and a premium scent profile.",
    "author": {
      "@type": "Person",
      "name": "Ameen Kasim"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NOR PERFUME",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.norperfume.com/logo.png"
      }
    },
    "datePublished": "2026-06-08",
    "image": "https://www.norperfume.com/Gemini_Generated_Image_3e8qdw3e8qdw3e8q.png"
  };

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SEO 
        title="Why Essential Oils for Luxury Car Perfumes | NOR Journal"
        description="Learn why pure essential oils are the superior choice for luxury car fragrances. Explore the health benefits and safety of natural car perfumes over synthetic chemicals."
        schema={articleSchema}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-black">Fragrance Journal</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground tracking-tighter uppercase leading-[0.9]"
          >
            Why Essential Oils are Replacing Synthetic Car Fresheners in Luxury Vehicles
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold"
          >
            <span>June 8, 2026</span>
            <span className="w-1 h-1 rounded-full bg-primary/40" />
            <span>6 Min Read</span>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="px-4 pb-24 relative">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert prose-gold max-w-none space-y-12">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-xl md:text-2xl leading-relaxed text-white/90 font-light italic border-l-2 border-primary/30 pl-8">
                "Your car is an extension of your personal space. In 2026, luxury is no longer just about what you see or touch—it's about the air you breathe."
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                For decades, the "new car smell" was something we associated with luxury. But as we've become more conscious of our health and environment, we've discovered that most traditional car fresheners are little more than a cocktail of synthetic chemicals, phthalates, and VOCs (Volatile Organic Compounds).
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-display text-3xl uppercase text-foreground tracking-tight flex items-center gap-4">
                <span className="w-8 h-[1px] bg-primary/50" />
                The Problem with Synthetic Scent
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Standard car perfumes often rely on cheap, lab-created molecules to mimic scents like "Ocean Breeze" or "New Car." While these might smell pleasant initially, they frequently cause headaches, respiratory irritation, and can even damage your car's interior surfaces if they leak.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <ShieldCheck className="w-6 h-6 text-red-400/70" />
                  <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">Synthetic Risks</h4>
                  <p className="text-xs text-muted-foreground">Contains Phthalates and Benzenes which are known endocrine disruptors and respiratory irritants.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <Droplet className="w-6 h-6 text-red-400/70" />
                  <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">Interior Damage</h4>
                  <p className="text-xs text-muted-foreground">Liquid-based synthetic perfumes are notorious for leaking and melting dashboard plastics.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-display text-3xl uppercase text-foreground tracking-tight flex items-center gap-4">
                <span className="w-8 h-[1px] bg-primary/50" />
                The Essential Oil Revolution
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Luxury car owners in regions like India, UAE, and the GCC are now demanding artisanal alternatives. Pure essential oils, like those used in <strong>AQUA NOR</strong> and <strong>MUSK NOR</strong>, offer a multi-dimensional scent profile that synthetic perfumes simply cannot match.
              </p>
              <ul className="space-y-6 mt-8">
                <li className="flex gap-4">
                  <div className="mt-1"><Leaf className="w-5 h-5 text-primary" /></div>
                  <div>
                    <h4 className="font-bold text-foreground uppercase text-sm tracking-widest mb-1">True Aromatherapy</h4>
                    <p className="text-sm text-muted-foreground">Essential oils like Bergamot and Sandalwood don't just smell good; they help reduce driving stress and improve focus.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1"><Star className="w-5 h-5 text-primary" /></div>
                  <div>
                    <h4 className="font-bold text-foreground uppercase text-sm tracking-widest mb-1">Sophisticated Aging</h4>
                    <p className="text-sm text-muted-foreground">Natural oils evolve over time, revealing different notes as you drive, much like a high-end personal parfum.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[32px] bg-primary/5 border border-primary/20 space-y-6 text-center"
            >
              <h3 className="font-display text-2xl uppercase text-primary">Experience the Difference</h3>
              <p className="text-muted-foreground max-w-xl mx-auto">
                NOR PERFUME is pioneering this shift by combining 100% natural oil extracts with zero-liquid diffusion technology. Safe for your car, safe for your family.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <a href="/products" className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform inline-flex items-center gap-2">
                  Shop AQUA NOR <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/products" className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                  Discover MUSK NOR
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Journal;
