import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Leaf, ShieldCheck, Droplet, Star, ArrowRight, Clock, User, Share2, ChevronLeft, Check } from "lucide-react";
import SEO from "@/components/SEO";
import { useRef, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { blogPosts } from "@/data/blogs";
import { useToast } from "@/components/ui/use-toast";

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

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id)
    .slice(0, 2);

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
    <main className="min-h-dvh bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#020202] text-foreground selection:bg-primary/30" ref={containerRef}>
      <SEO 
        title={`${post.title} | Scent Science & Luxury Insights | NOR Journal`}
        description={post.excerpt}
        schema={[articleSchema, breadcrumbSchema]}
      />
      <Navbar />

      <div className="fixed top-24 left-4 md:left-12 z-50">
        <Link 
          to="/blogs" 
          className="group flex items-center gap-3 px-6 py-2.5 rounded-full bg-black border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all shadow-2xl"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-white" />
          <span className="text-[9px] tracking-[0.2em] uppercase font-black text-white">Back to Journal</span>
        </Link>
      </div>

      {/* Cinematic Hero Section */}
      <section className="relative h-[80vh] md:h-screen flex items-center justify-center overflow-hidden bg-black">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/30 to-[#020202] z-10" />
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover brightness-[0.4] contrast-[1.1]"
          />
        </motion.div>

        <div className="max-w-6xl mx-auto text-center relative z-20 px-4 md:px-6 space-y-8 md:space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-4 px-6 md:px-8 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-3xl shadow-2xl"
          >
            <span className="text-[8px] md:text-[10px] tracking-[0.6em] md:tracking-[0.8em] uppercase text-primary font-black">{post.category}</span>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-3xl sm:text-4xl md:text-8xl lg:text-[10rem] text-white tracking-[-0.04em] uppercase leading-[0.9] md:leading-[0.8] select-none px-2"
            >
              {post.title}
            </motion.h1>
            {post.subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-primary/60 font-display text-lg md:text-3xl italic font-light lowercase tracking-tight px-4"
              >
                {post.subtitle}
              </motion.p>
            )}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 gap-y-4 md:gap-y-6 text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-white/40 font-black pt-8 md:pt-12 w-fit mx-auto"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <User className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Clock className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Star className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              <span>{post.date}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content Layout */}
      <section className="relative z-10 px-4 md:px-6 pt-12 md:pt-32 pb-16 md:pb-48">
        {/* Background Texture/Grain */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 md:gap-24 relative z-10">
          
          {/* Sidebar Info - Desktop Only */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit space-y-20">
            <div className="space-y-8">
              <h4 className="text-[10px] uppercase tracking-[0.6em] text-primary font-black flex items-center gap-4">
                Share
              </h4>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleShare}
                  className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-primary transition-all font-black"
                >
                  <div className="w-12 h-12 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    {isCopied ? <Check className="w-4 h-4 text-black" /> : <Share2 className="w-4 h-4 group-hover:text-black transition-colors" />}
                  </div>
                  <span>Copy Link</span>
                </button>
              </div>
            </div>

            {post.id === 'essential-revolution' && (
              <div className="p-12 rounded-[50px] bg-white/[0.02] border border-white/5 space-y-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <h4 className="text-[10px] uppercase tracking-[0.6em] text-primary font-black flex flex-col gap-3">
                  <span className="text-white/20">Navigate</span>
                  <span className="text-white italic font-light lowercase text-3xl tracking-tight font-display">Chapter</span>
                </h4>
                <nav className="flex flex-col gap-8 text-[11px] uppercase tracking-[0.3em] font-black text-white/30">
                  <a href="#synthetic" className="hover:text-primary transition-all hover:translate-x-3 flex items-center gap-4 group/item">
                    01. The Problem
                  </a>
                  <a href="#revolution" className="hover:text-primary transition-all hover:translate-x-3 flex items-center gap-4 group/item">
                    02. The Science
                  </a>
                  <a href="#experience" className="hover:text-primary transition-all hover:translate-x-3 flex items-center gap-4 group/item">
                    03. The Experience
                  </a>
                </nav>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-8 lg:col-start-5 space-y-12 md:space-y-32">
            <div className="prose prose-invert prose-gold max-w-none">
              <div 
                className="blog-content space-y-8 md:space-y-16 leading-relaxed text-base md:text-xl font-light text-white/60"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />

              {/* Related Images Gallery */}
              {post.relatedImages && post.relatedImages.length > 0 && (
                <div className="py-8 md:py-24 space-y-8 md:space-y-12">
                  <div className="flex items-center gap-6">
                    <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.5em]">Visual Journal</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {post.relatedImages.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className={`relative overflow-hidden rounded-[30px] md:rounded-[40px] border border-white/5 group ${i === 0 ? 'aspect-[4/5]' : 'aspect-square md:mt-24'}`}
                      >
                        <img 
                          src={img} 
                          alt={`Related to ${post.title}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-1000" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Image/Quote Break */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative py-12 md:py-24 group"
              >
                <div className="absolute inset-0 bg-primary/[0.03] -skew-y-2 group-hover:skew-y-0 transition-transform duration-1000" />
                <blockquote className="relative z-10 text-center space-y-6 md:space-y-8 px-4">
                  <p className="font-display text-2xl md:text-6xl text-white uppercase tracking-tighter leading-tight md:leading-none italic">
                    "Luxury is no longer just about what you see... it's about the <span className="text-primary">air you breathe</span>."
                  </p>
                  <cite className="block text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-primary font-black not-italic">— Ameen Kasim, Founder</cite>
                </blockquote>
              </motion.div>

              {/* Redesigned Small & Compact Call to Action Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative p-8 md:p-16 rounded-[40px] md:rounded-[60px] bg-[#050505] border border-white/5 text-center mt-12 md:mt-24 overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] max-w-2xl mx-auto"
              >
                <div className="space-y-8 relative z-10">
                  <span className="text-[8px] font-bold text-primary/60 uppercase tracking-[0.4em]">The Collection</span>
                  
                  <div className="space-y-1">
                    <h3 className="font-display text-4xl md:text-7xl text-white font-bold tracking-tighter uppercase leading-[0.8] select-none">
                      Elevate Your
                    </h3>
                    <p className="font-display text-4xl md:text-8xl text-primary font-bold tracking-tighter leading-[0.8] select-none lowercase">
                      journey
                    </p>
                  </div>

                  <p className="text-white/20 max-w-xs mx-auto text-[9px] md:text-[11px] font-light leading-relaxed">
                    Experience the future of automotive fragrance. Handcrafted with 100% natural oil extracts for the discerning driver.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 relative z-10 px-4">
                    <Link 
                      to="/products" 
                      className="group/btn w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-black font-bold text-[9px] md:text-[10px] uppercase tracking-[0.15em] hover:scale-105 transition-all shadow-[0_0_50px_rgba(212,175,55,0.25)] inline-flex items-center justify-center gap-3"
                    >
                      Shop The Collection <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      to="/products" 
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-transparent border border-white/10 text-white font-bold text-[9px] md:text-[10px] uppercase tracking-[0.15em] hover:bg-white/5 transition-all inline-flex items-center justify-center"
                    >
                      Discover Scent Science
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Read Next Section */}
      <section className="px-6 py-24 md:py-48 relative overflow-hidden bg-black/20">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em]">Continue Exploring</span>
              <h2 className="font-display text-4xl md:text-7xl text-white uppercase tracking-tighter">Read <span className="italic font-light lowercase text-primary">Next</span></h2>
            </div>
            <Link to="/blogs" className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-primary transition-colors pb-2">
              All Stories <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {relatedPosts.map((related, idx) => (
              <motion.div
                key={related.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group"
              >
                <Link to={`/blogs/${related.id}`} className="space-y-8 md:space-y-10 block">
                  <div className="relative aspect-[16/9] rounded-[30px] md:rounded-[40px] overflow-hidden border border-white/5">
                    <img 
                      src={related.image} 
                      alt={related.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="space-y-4 md:space-y-6 px-4">
                      <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.4em] font-black text-primary">
                        <span>{related.category}</span>
                        <span className="text-white/30">{related.readTime}</span>
                      </div>
                    <h3 className="font-display text-3xl md:text-5xl text-white uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BlogDetail;
