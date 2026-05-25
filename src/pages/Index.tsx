import { useEffect } from "react";
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

import SEO from "@/components/SEO";

const Index = () => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NOR PERFUME",
    "url": "https://www.norperfume.com",
    "logo": "https://www.norperfume.com/logo.png",
    "description": "Luxury automotive fragrance brand designed and manufactured in India.",
    "sameAs": [
      "https://instagram.com/norperfumeofficial"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kerala",
      "addressCountry": "India"
    }
  };

  return (
    <main id="main-content" className="min-h-dvh bg-background">
      <SEO 
        title="NOR PERFUME | Official Online Store"
        description="Experience automotive luxury with NOR's premium car fragrances. Handcrafted in India with 100% natural oils and zero-liquid technology for a lasting, sophisticated scent."
        schema={orgSchema}
      />
      <Navbar />
      <HeroCarousel />
      <MarqueeBanner
        className="-rotate-[2deg] scale-[1] relative z-10 mt-10 mb-[-8px] py-4 shadow-none"
        items={["Luxury Car Fragrance", "Crafted in India", "Essential Oil Based", "NOR PERFUME", "MUSK NOR", "AQUA NOR"]}
      />
      <Reveal delay={0}>
        <TrustBadges />
      </Reveal>

      <Reveal delay={0} duration={0.6}>
        <ProductGrid />
      </Reveal>
      <Reveal delay={0}>
        <FeaturedProducts />
      </Reveal>
      <Reveal delay={0}>
        <ExperienceSection />
      </Reveal>
      <Reveal delay={0}>
        <CollectionsSection />
      </Reveal>
      <Reveal delay={0}>
        <TestimonialsSection />
      </Reveal>
      <Footer />
      <div className="h-[env(safe-area-inset-bottom,24px)] md:hidden" />
    </main>
  );
};

export default Index;
