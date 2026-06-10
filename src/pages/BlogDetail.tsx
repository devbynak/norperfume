import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Clock, Share2, ChevronLeft, Check } from "lucide-react";
import SEO from "@/components/SEO";
import { useRef, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { blogPosts } from "@/data/blogs";
import { useToast } from "@/components/ui/use-toast";
import { haptic } from "@/lib/haptics";

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    toast({
      title: "Link Copied",
      description: "The article link has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  if (!post) return <Navigate to="/blogs" replace />;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author
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
    "image": post.image
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.norperfume.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Journal",
        "item": "https://www.norperfume.com/blogs"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": window.location.href
      }
    ]
  };

  return (
    <main className="min-h-dvh bg-[#020202] text-foreground selection:bg-primary/30" ref={containerRef}>
      <SEO 
        title={`${post.title} | Scent Science & Luxury Insights | NOR Journal`}
        description={post.excerpt}
        schema={[articleSchema, breadcrumbSchema]}
      />
      <Navbar />

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed left-4 md:left-12 z-50"
        style={{ top: "calc(env(safe-area-inset-top) + 6rem)" }}
      >
        <Link 
          to="/blogs" 
          onClick={() => haptic("light")}
          className="group flex items-center gap-2.5 px-4 md:px-5 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
          <span className="text-[7px] md:text-[8px] tracking-[0.3em] uppercase font-bold text-white/50 group-hover:text-white transition-colors">Journal</span>
        </Link>
      </motion.div>

      {/* Cinematic Hero Section */}
      <section className="relative h-[75vh] sm:h-[85vh] md:h-screen flex items-center justify-center overflow-hidden bg-black">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-background z-10" />
          <div className="absolute inset-0 bg-black/20 z-10" />
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover brightness-[0.5] contrast-[1.1] scale-105"
            loading="eager"
            {...{ fetchpriority: "high" } as any}
            decoding="async"
            sizes="100vw"
          />
        </motion.div>

        <div className="max-w-7xl mx-auto text-center relative z-20 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-10"
          >
            <div className="inline-flex items-center gap-4 px-4 md:px-5 py-1.5 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-xl">
              <span className="text-[7px] md:text-[9px] tracking-[0.4em] md:tracking-[0.5em] uppercase text-primary/80 font-bold">{post.category}</span>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(2.5rem,10vw,11rem)] text-white tracking-[-0.05em] uppercase leading-[0.9] md:leading-[0.75] italic px-2 mix-blend-difference"
              >
                {post.title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 === 1 ? "text-primary italic font-light lowercase" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </motion.h1>
              {post.subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="text-white/60 font-display text-base md:text-2xl tracking-[0.2em] md:tracking-widest uppercase font-light max-w-2xl mx-auto px-4 italic"
                >
                  {post.subtitle}
                </motion.p>
              )}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-16 gap-y-4 text-[8px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/40 font-bold pt-8 md:pt-12"
            >
              <div className="group flex items-center gap-2 md:gap-3">
                <div className="w-6 md:w-8 h-[1px] bg-primary/30 group-hover:w-12 transition-all" />
                <span>By {post.author}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Clock className="w-3 h-3 text-primary/40" />
                <span>{post.readTime} Read</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Article Content Layout */}
      <section className="relative z-10 px-4 md:px-6 pt-16 md:pt-48 pb-24 md:pb-64">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/[0.03] rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-32 relative z-10">
          
          {/* Sidebar Info - Desktop Only */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-40 h-fit space-y-24">
            <div className="space-y-10">
              <h4 className="text-[9px] uppercase tracking-[0.6em] text-primary/40 font-bold">
                Share Perspective
              </h4>
              <div className="flex flex-col gap-6">
                <button 
                  onClick={handleShare}
                  className="group flex items-center gap-5 text-[9px] uppercase tracking-[0.4em] text-white/30 hover:text-primary transition-all font-bold"
                >
                  <div className="w-11 h-11 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:scale-110 transition-all duration-500">
                    {isCopied ? <Check className="w-3.5 h-3.5 text-black" /> : <Share2 className="w-3.5 h-3.5 group-hover:text-black transition-colors" />}
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">Copy Link</span>
                </button>
              </div>
            </div>

            {post.id === 'essential-revolution' && (
              <div className="p-10 rounded-[40px] bg-white/[0.01] border border-white/5 space-y-12 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:h-full group-hover:bg-primary/40 transition-all duration-700" />
                <h4 className="text-[9px] uppercase tracking-[0.6em] text-primary/40 font-bold">
                  Story Index
                </h4>
                <nav className="flex flex-col gap-10 text-[10px] uppercase tracking-[0.4em] font-bold text-white/20">
                  <a href="#synthetic" className="hover:text-primary transition-all hover:translate-x-4 flex items-center gap-4 group/item">
                    <span className="text-[8px] font-numbers-inter text-primary/30 group-hover/item:text-primary group-hover/item:scale-125 transition-all">01.</span>
                    Synthetic Flaws
                  </a>
                  <a href="#revolution" className="hover:text-primary transition-all hover:translate-x-4 flex items-center gap-4 group/item">
                    <span className="text-[8px] font-numbers-inter text-primary/30 group-hover/item:text-primary group-hover/item:scale-125 transition-all">02.</span>
                    The Scent Science
                  </a>
                  <a href="#experience" className="hover:text-primary transition-all hover:translate-x-4 flex items-center gap-4 group/item">
                    <span className="text-[8px] font-numbers-inter text-primary/30 group-hover/item:text-primary group-hover/item:scale-125 transition-all">03.</span>
                    Modern Ritual
                  </a>
                </nav>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-8 lg:col-start-5 space-y-16 md:space-y-40">
            <div className="prose prose-invert prose-gold max-w-none">
              <div 
                className="blog-content space-y-10 md:space-y-24 leading-[1.8] text-base sm:text-lg md:text-2xl font-light text-white/50 first-letter:text-6xl sm:first-letter:text-7xl first-letter:font-display first-letter:text-primary first-letter:mr-4 first-letter:float-left first-letter:mt-2"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />

              {/* Related Images Gallery */}
              {post.relatedImages && post.relatedImages.length > 0 && (
                <div className="py-16 md:py-48 space-y-8 md:space-y-20">
                  <div className="flex items-center gap-4 md:gap-6">
                    <span className="text-[8px] md:text-[9px] font-bold text-primary/40 uppercase tracking-[0.5em] md:tracking-[0.6em]">Lookbook Perspective</span>
                    <div className="flex-1 h-[1px] bg-white/5" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-16">
                    {post.relatedImages.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className={`relative overflow-hidden rounded-[30px] md:rounded-[40px] border border-white/5 group ${i === 0 ? 'aspect-[3/4]' : 'aspect-square sm:mt-16 md:mt-32'}`}
                      >
                        <img 
                          src={img} 
                          alt={`Related to ${post.title}`}
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Image/Quote Break */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative py-16 md:py-48 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-primary/[0.02] scale-x-0 group-hover:scale-x-100 transition-transform duration-[2s] origin-left" />
                
                <blockquote className="relative z-10 text-center space-y-8 md:space-y-16 px-4">
                  <p className="font-display text-[clamp(1.5rem,6vw,5rem)] md:text-7xl lg:text-8xl text-white uppercase tracking-tighter leading-[1] md:leading-[0.9] italic max-w-4xl mx-auto">
                    "Luxury is no longer just about what you see... it's about the <span className="text-primary italic font-light lowercase">air you breathe</span>."
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <cite className="block text-[8px] md:text-[9px] uppercase tracking-[0.5em] md:tracking-[0.6em] text-primary/60 font-bold not-italic">— Ameen Kasim, Founder</cite>
                  </div>
                </blockquote>
              </motion.div>

              {/* Redesigned Ultra-Premium CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="relative p-8 sm:p-12 md:p-24 rounded-[40px] sm:rounded-[60px] md:rounded-[80px] bg-[#050505] border border-white/5 text-center mt-16 md:mt-48 overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] max-w-4xl mx-auto"
              >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-[80px] md:blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-colors duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-primary/5 rounded-full blur-[80px] md:blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000" />
                
                <div className="space-y-8 md:space-y-16 relative z-10">
                  <div className="space-y-4">
                    <span className="text-[8px] md:text-[9px] font-bold text-primary/40 uppercase tracking-[0.5em] md:tracking-[0.6em]">The Artisan Collection</span>
                    <div className="space-y-2">
                      <h3 className="font-display text-4xl sm:text-6xl md:text-[9rem] text-white font-bold tracking-tighter uppercase leading-[0.8] select-none">
                        Elevate Your <span className="text-primary italic font-light lowercase">Journey</span>
                      </h3>
                    </div>
                  </div>

                  <p className="text-white/40 max-w-md mx-auto text-[10px] sm:text-xs md:text-lg font-light leading-relaxed tracking-wide px-2 italic">
                    Experience the future of automotive fragrance. Handcrafted with 100% natural oil extracts for the discerning driver.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8 relative z-10 px-4">
                    <Link 
                      to="/products" 
                      onClick={() => { haptic("medium"); window.scrollTo(0, 0); }}
                      className="group/btn relative w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 rounded-full bg-primary text-black font-bold text-[9px] md:text-[11px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_60px_rgba(212,175,55,0.3)] inline-flex items-center justify-center gap-3 md:gap-4 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                      <span className="relative z-10">Shop Collection</span> 
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform relative z-10" />
                    </Link>
                    <Link 
                      to="/products" 
                      onClick={() => { haptic("light"); window.scrollTo(0, 0); }}
                      className="group/btn-alt w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 rounded-full bg-transparent border border-white/10 text-white font-bold text-[9px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-white/5 hover:border-white/20 transition-all inline-flex items-center justify-center gap-3"
                    >
                      Explore Science
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-only Sharing Bar */}
      <motion.div 
        initial={{ y: 100 }}
        whileInView={{ y: 0 }}
        className="fixed left-4 right-4 z-50 lg:hidden flex justify-center"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
      >
        <button 
          onClick={() => { haptic("medium"); handleShare(); }}
          className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl active:scale-95 transition-all"
        >
          {isCopied ? (
            <Check className="w-4 h-4 text-primary" />
          ) : (
            <Share2 className="w-4 h-4 text-white/70" />
          )}
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-white/70">
            {isCopied ? "Link Copied" : "Share Story"}
          </span>
        </button>
      </motion.div>

      <Footer />
    </main>
  );
};

export default BlogDetail;
