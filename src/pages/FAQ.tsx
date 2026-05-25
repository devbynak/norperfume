import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ExternalLink, SlidersHorizontal, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/SEO";
import { useCart } from "@/context/CartContext";

const haptic = (type: "light" | "medium" | "success" | "warning" | "error" | "selection") => {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      success: [10, 30, 10],
      warning: [30, 50, 30],
      error: [50, 100, 50],
      selection: [1]
    };
    navigator.vibrate(patterns[type]);
  }
};

interface FAQItemData {
  q: string;
  a: string;
  steps?: string[];
  pill?: { text: string; type: string };
  note?: string;
}

interface FAQCategory {
  category: string;
  id: string;
  questions: FAQItemData[];
}

const faqData: FAQCategory[] = [
  {
    category: "Product & Fragrance",
    id: "product",
    questions: [
      {
        q: "What is NOR Perfume?",
        a: "NOR is a luxury car perfume brand from Kerala, India. We make toxin-free, natural fragrances specially designed for your car. Our perfumes smell great, last long, and are safe enough to use on your skin too."
      },
      {
        q: "What fragrances do you sell?",
        a: "We currently have two fragrances — MUSK NOR and AQUA NOR. Every order includes a 20ml perfume spray bottle and one NOR luxury diffusion tag.",
        pill: { text: "MUSK NOR • AQUA NOR", type: "info" }
      },
      {
        q: "What does MUSK NOR smell like?",
        a: "MUSK NOR is a warm, deep, and woody fragrance. It gives your car a rich and sophisticated feel. If you like strong, bold scents, MUSK NOR is the one for you."
      },
      {
        q: "What does AQUA NOR smell like?",
        a: "AQUA NOR is a fresh, clean, and light fragrance — like a cool ocean breeze. It keeps your car smelling crisp and refreshing. Great for everyday use, especially in warm weather."
      },
      {
        q: "Is NOR safe to use?",
        a: "Yes, completely. NOR is 100% toxin-free and made with natural fragrance oils. It is safe to use inside your car every day. It is even gentle enough to use on your skin.",
        pill: { text: "Toxin-free • Safe on skin", type: "success" }
      },
      {
        q: "Where is NOR made?",
        a: "NOR is designed and made in Kerala, India. We personally oversee every step — from choosing the fragrance oils to packing your order — to make sure you get the best quality every time."
      }
    ]
  },
  {
    category: "How to Use",
    id: "usage",
    questions: [
      {
        q: "What comes in the box?",
        a: "Inside every NOR box you will find a 20ml fragrance spray bottle and one NOR luxury diffusion tag. That is everything you need to get started."
      },
      {
        q: "How do I use NOR in my car?",
        a: "It is very easy. Just follow these steps:",
        steps: [
          "Take the perfume bottle and the NOR tag out of the box.",
          "Hold the bottle about 10–15 cm away from the tag.",
          "Spray the perfume evenly on the tag.",
          "Hang the tag on your rear-view mirror or anywhere with good airflow.",
          "When the scent fades, just spray again to refresh it.",
          "After use, close the bottle tightly and keep it in a cool, dry place away from sunlight."
        ],
        pill: { text: "Ready in under a minute", type: "success" }
      },
      {
        q: "Where should I hang the NOR tag in my car?",
        a: "The best spots are your rear-view mirror or near an air vent — anywhere air flows freely. Good airflow helps the scent spread evenly through your car. Try to keep the tag out of direct sunlight to make the fragrance last longer."
      },
      {
        q: "How do I make the scent stronger or lighter?",
        a: "Simple — spray more for a stronger scent, spray less for something lighter. You are fully in control. Just reapply whenever you feel the fragrance is fading."
      },
      {
        q: "How long will the fragrance last?",
        a: "It depends on how much you spray, your car's ventilation, and the temperature. The NOR tag is designed to release the scent slowly over time. Once the smell fades, just spray the tag again to bring it back."
      },
      {
        q: "How should I store the perfume bottle?",
        a: "Always close the bottle tightly after use. Store it in a cool, dry place away from direct sunlight. Do not leave it inside a hot car for long periods — heat can affect the fragrance quality."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    id: "shipping",
    questions: [
      {
        q: "Do you deliver across India?",
        a: "Yes, we ship to all locations across India. International shipping is something we are working on — follow us on Instagram @norperfumeofficial for updates."
      },
      {
        q: "How long does delivery take?",
        a: "Most orders are delivered within 4–7 business days after your order is confirmed. Once your order ships, you will receive a tracking link by email or SMS."
      },
      {
        q: "Do you offer Cash on Delivery?",
        a: "No, we only accept prepaid payments right now. You can pay using UPI, debit card, credit card, or net banking. COD is not available.",
        pill: { text: "Prepaid only — no COD", type: "info" }
      },
      {
        q: "How do I track my order?",
        a: "Once your order is shipped, you will get a tracking link via SMS or email. You can also click Track Order in our website menu to check your delivery status anytime."
      },
      {
        q: "Is shipping free?",
        a: "We do not offer free shipping at the moment. A standard shipping fee will be applied to all orders based on your location — you will see the final shipping cost clearly at checkout."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    id: "returns",
    questions: [
      {
        q: "Can I return my order?",
        a: "We do not accept returns on opened or used products. However, if your product arrives damaged, we will sort it out for you right away. See below for how to report a damaged order.",
        pill: { text: "No returns on opened products", type: "warning" }
      },
      {
        q: "What if my order arrives damaged?",
        a: "We are sorry to hear that. Please contact us immediately and share the following:",
        steps: [
          "A video of you unboxing the order — recorded at the time of delivery, before opening.",
          "Clear photos of the damaged product and packaging.",
          "Your order number."
        ],
        pill: { text: "Unboxing video is required — no exceptions", type: "warning" },
        note: "Reach out to us on Instagram @norperfumeofficial or via our Contact page. We cannot process claims without the unboxing video."
      },
      {
        q: "What if I got the wrong product?",
        a: "We apologise for that! Please contact us within 48 hours of receiving your order. Send us your order number and a photo of what you received. We will send you the correct product at no extra charge."
      },
      {
        q: "Can I exchange my fragrance?",
        a: "Exchanges are only possible if your product arrived damaged or you received the wrong item. We do not exchange based on scent preference. We recommend reading the MUSK NOR and AQUA NOR descriptions carefully before ordering."
      }
    ]
  }
];

const FAQItem = ({ item }: { item: FAQItemData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="last:border-0">
      <button
        onClick={() => { haptic("light"); setIsOpen(!isOpen); }}
        className="w-full py-7 flex items-center justify-between text-left group outline-none"
      >
        <span className="text-[16px] md:text-[17px] font-medium text-foreground/90 group-hover:text-primary transition-colors pr-8 leading-snug">
          {item.q}
        </span>
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-primary border-primary rotate-180' : 'bg-white/[0.03] group-hover:border-primary/50'}`}>
          {isOpen ? <Minus className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-foreground" /> : <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-10 space-y-6">
              <p className="text-muted-foreground text-[14px] md:text-[15px] leading-relaxed pr-6 md:pr-12">
                {item.a}
              </p>

              {item.steps && (
                <ol className="space-y-4 pl-5 list-decimal text-muted-foreground/80 text-[14px]">
                  {item.steps.map((step, i) => (
                    <li key={i} className="pl-3 marker:text-primary/60 marker:font-bold">{step}</li>
                  ))}
                </ol>
              )}

              {item.pill && (
                <div className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase ${item.pill.type === 'success' ? 'bg-primary/10 text-primary border border-primary/20' :
                  item.pill.type === 'info' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                  {item.pill.text}
                </div>
              )}

              {item.note && (
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-6">
                  <p className="text-[12px] md:text-[13px] leading-relaxed text-muted-foreground/70">
                    <span className="text-primary font-bold mr-2">Note:</span>
                    {item.note}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categories = [
    { label: "All Questions", id: "ALL" },
    { label: "Product & Scent", id: "product" },
    { label: "Usage Guide", id: "usage" },
    { label: "Shipping Info", id: "shipping" },
    { label: "Returns Policy", id: "returns" }
  ];

  const filteredData = faqData.filter(cat => {
    if (activeCategory === "ALL") return true;
    return cat.id === activeCategory;
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.flatMap(cat => cat.questions).map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <main className="min-h-dvh bg-background text-foreground pb-[env(safe-area-inset-bottom,2rem)]">
      <SEO 
        title="FAQ | Support | NOR PERFUME"
        description="Find answers to common questions about NOR car perfumes, delivery times, usage instructions, and return policies."
        schema={faqSchema}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="text-primary text-[11px] font-bold tracking-[0.4em] uppercase">NOR PERFUME • FAQ</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl text-foreground mb-8 leading-[0.9] tracking-tighter uppercase"
          >
            Frequently Asked <br className="md:hidden" /> Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground/60 text-[14px] md:text-[16px] max-w-lg mx-auto leading-relaxed tracking-wide"
          >
            Everything you need to know about our luxury fragrances and services.
          </motion.p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="pb-8 px-6 sticky top-[90px] md:top-[100px] z-30 bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Desktop Filter View */}
          <div className="hidden md:flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { haptic("selection"); setActiveCategory(cat.id); }}
                className={`px-8 py-3 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-500 border ${activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white/[0.03] text-foreground/50 border-white/5 hover:border-white/20 hover:text-foreground"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mobile Filter View */}
          <div className="flex md:hidden items-center justify-center w-full py-2">
            <button
              onClick={() => { haptic("light"); setIsMobileFiltersOpen(true); }}
              className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/[0.03] backdrop-blur-xl text-foreground/90 font-bold text-[10px] tracking-[0.2em] uppercase transition-all active:scale-95 border border-white/10"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <span>Filter Categories</span>
              <ChevronRight className="w-3 h-3 text-white/20 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Drawer Slide-out Filter Menu */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden"
            />
            {/* Mobile Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-x-0 bottom-0 bg-card border-t border-white/10 p-8 z-[70] md:hidden rounded-t-[3rem] pb-[env(safe-area-inset-bottom,2rem)]"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-display text-2xl text-foreground tracking-tight">
                  Categories
                </span>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.05] text-foreground outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      haptic("selection");
                      setActiveCategory(cat.id);
                      setIsMobileFiltersOpen(false);
                    }}
                    className={`w-full px-8 py-5 rounded-2xl text-left text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-300 border flex items-center justify-between ${
                      activeCategory === cat.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-white/[0.03] text-foreground/60 border-white/5"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {activeCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAQ Content */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-24"
              >
                {filteredData.map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center justify-center mb-10">
                      <h2 className="font-display text-2xl text-foreground shrink-0 tracking-tight">
                        {category.category}
                      </h2>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] px-6 md:px-10 py-4 shadow-2xl">
                      {category.questions.map((item, i) => (
                        <FAQItem key={item.q} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Support Section - Glassmorphism Redesign */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-32 mb-20 p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl group"
            >
              {/* Ambient Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 rounded-full transition-all duration-700 group-hover:bg-primary/20" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] -ml-32 -mb-32 rounded-full transition-all duration-700 group-hover:bg-primary/15" />
              
              <div className="relative z-10">
                <h3 className="font-display text-4xl md:text-6xl text-foreground mb-6 tracking-tighter">
                  Still have a question?
                </h3>
                
                <p className="text-muted-foreground/50 text-[11px] md:text-[13px] uppercase tracking-[0.3em] mb-12 font-medium">
                  Our concierge team is at your service
                </p>
                
                <a
                  href="/contact"
                  onClick={() => haptic("light")}
                  className="inline-flex items-center gap-6 group/btn"
                >
                  <span className="text-primary font-bold text-[10px] md:text-[11px] tracking-[0.4em] uppercase transition-colors group-hover/btn:text-primary/80">
                    Get in touch
                  </span>
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl group-hover/btn:border-primary group-hover/btn:bg-primary/10 transition-all duration-500">
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </div>
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

export default FAQ;
