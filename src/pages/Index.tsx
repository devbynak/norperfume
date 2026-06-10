import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import MarqueeBanner from "@/components/MarqueeBanner";
import TrustBadges from "@/components/TrustBadges";
import ProductGrid from "@/components/ProductGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import CollectionsSection from "@/components/CollectionsSection";
import ExperienceSection from "@/components/ExperienceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/ScrollReveal";
import { blogPosts } from "@/data/blogs";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

import SEO from "@/components/SEO";

const Index = () => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NOR PERFUME",
    "url": "https://www.norperfume.com",
    "logo": "https://www.norperfume.com/logo.png",
    "description": "NOR PERFUME is the best luxury car perfume brand in India, UAE, and GCC. Handcrafted with 100% natural essential oils for a premium automotive experience.",
    "sameAs": [
      "https://instagram.com/norperfumeofficial"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kerala",
      "addressCountry": "India"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": ["IN", "AE", "SA", "QA", "KW", "OM", "BH"],
      "availableLanguage": "English"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Which is the best car perfume in India for luxury cars?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "NOR PERFUME is widely considered the best car perfume in India for luxury vehicles. It uses 100% natural essential oils and zero-liquid technology, making it safe for high-end interiors while providing a lasting, artisanal scent profile."
        }
      },
      {
        "@type": "Question",
        "name": "What are the best long lasting car perfumes in UAE and GCC?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For the UAE and GCC markets, MUSK NOR and AQUA NOR by NOR PERFUME are the top-rated long-lasting car fragrances. Designed to withstand high temperatures, they offer a consistent luxury aroma for over 60 days."
        }
      }
    ]
  };

  return (
    <main id="main-content" className="min-h-dvh bg-background">
      <SEO 
        title="NOR PERFUME | Official Online Store"
        description="Discover the best car perfume in India and UAE for 2026. NOR PERFUME offers artisanal, 100% natural oil fragrances like AQUA NOR and MUSK NOR. Handcrafted for luxury cars."
        schema={[orgSchema, faqSchema]}
      />
      <Navbar />
      <HeroCarousel />
      <Reveal delay={0} direction="none" scale={1}>
        <div className="relative py-6 overflow-hidden">
          <MarqueeBanner
            className="-rotate-[1.5deg] scale-[1.02] relative z-10 shadow-[0_15px_35px_rgba(0,0,0,0.3)]"
            items={["Luxury Car Fragrance", "Crafted in India", "Essential Oil Based", "NOR PERFUME", "MUSK NOR", "AQUA NOR"]}
          />
        </div>
      </Reveal>
      <Reveal delay={0} direction="up" yOffset={20}>
        <TrustBadges />
      </Reveal>

      <Reveal delay={0} duration={0.8} direction="up" yOffset={30}>
        <ProductGrid />
      </Reveal>
      
      <Reveal delay={0.1} direction="up" yOffset={40}>
        <FeaturedProducts />
      </Reveal>
      
      <Reveal delay={0} direction="right" xOffset={50}>
        <ExperienceSection />
      </Reveal>
      
      <Reveal delay={0} direction="left" xOffset={50}>
        <CollectionsSection />
      </Reveal>
      
      <Reveal delay={0} direction="up" scale={0.95}>
        <TestimonialsSection />
      </Reveal>

      {/* Latest from the Journal Section */}
      <section className="py-24 md:py-40 px-4 bg-[#050505] relative overflow-hidden">
        {/* Top & Bottom Blend Gradients */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />
        
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 md:mb-24">
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.6em] uppercase text-primary font-black">The Journal</span>
              <h2 className="font-display text-4xl md:text-7xl text-white uppercase tracking-tighter leading-none">
                Scent <span className="text-primary italic font-light lowercase">Science</span>
              </h2>
            </div>
            <Link 
              to="/blogs" 
              className="group flex items-center gap-3 text-white/40 hover:text-primary transition-colors pb-2 border-b border-white/10 hover:border-primary"
            >
              <span className="text-[10px] tracking-[0.4em] uppercase font-black">View All Articles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {blogPosts.slice(0, 2).map((post, index) => (
              <Reveal key={post.id} delay={index * 0.1} direction="up" yOffset={30}>
                <Link to={`/blogs/${post.id}`} className="group block space-y-8">
                  <div className="relative aspect-[16/9] rounded-[40px] overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      loading="lazy"
                      className="w-full h-full object-cover brightness-[0.6] group-hover:scale-110 transition-transform duration-[1500ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute top-8 left-8">
                      <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[8px] tracking-[0.3em] uppercase text-white font-black">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 px-4">
                    <div className="flex items-center gap-6 text-white/30 text-[10px] tracking-[0.2em] uppercase font-bold">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="font-display text-2xl md:text-4xl text-white uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">
                      {post.title}
                    </h3>
                    <p className="text-white/40 font-light leading-relaxed line-clamp-2 max-w-xl">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reveal delay={0} direction="up" yOffset={20}>
        <Footer />
      </Reveal>
      <div className="h-[env(safe-area-inset-bottom,24px)] md:hidden" />
    </main>
  );
};

export default Index;
