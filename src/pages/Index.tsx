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
      <Reveal delay={0} direction="none" scale={1.05}>
        <MarqueeBanner
          className="-rotate-[2deg] scale-[1] relative z-10 mt-10 mb-[-8px] py-4 shadow-none"
          items={["Luxury Car Fragrance", "Crafted in India", "Essential Oil Based", "NOR PERFUME", "MUSK NOR", "AQUA NOR"]}
        />
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
      <Reveal delay={0} direction="up" yOffset={20}>
        <Footer />
      </Reveal>
      <div className="h-[env(safe-area-inset-bottom,24px)] md:hidden" />
    </main>
  );
};

export default Index;
