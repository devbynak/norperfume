import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { blogPosts } from "@/data/blogs";

const Blogs = () => {
 const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];
 const otherPosts = blogPosts.filter(post => post.id !== featuredPost.id);
 const containerRef = useRef<HTMLDivElement>(null);
 
 const { scrollYProgress } = useScroll({
 target: containerRef,
 offset: ["start start","end end"]
 });

 const titleY = useTransform(scrollYProgress, [0, 0.2], ["0%","30%"]);
 const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
 const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
 const featuredY = useTransform(scrollYProgress, [0.1, 0.4], ["0%","15%"]);

 return (
 <main className="min-h-dvh bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#020202] text-foreground selection:bg-primary/30 overflow-x-hidden" ref={containerRef}>
 <SEO 
 title="The Journal | Luxury Car Fragrance & Scent Science | NOR PERFUME"
 description="Explore the NOR Journal: A curated collection of insights into olfactory science, handcrafted luxury car perfumes, and the premium automotive lifestyle."
 />
 <Navbar />

 {/* Cinematic Hero Section */}
 <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-black">
 {/* Background Image with Parallax and Overlay */}
 <motion.div 
 style={{ scale: heroScale }}
 className="absolute inset-0 z-0"
 >
 <img 
 src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=2000" 
 alt="Elite Luxury Background" 
 className="w-full h-full object-cover brightness-[0.25] contrast-[1.2] saturate-[0.8]"
 />
 <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black z-10" />
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
 <span className="text-[10px] tracking-[0.8em] uppercase text-primary font-black py-2 px-8">
 Elite Lifestyle
 </span>
 </motion.div>
 
 <motion.span
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 1, delay: 0.2 }}
 className="font-display text-6xl sm:text-7xl md:text-[12rem] lg:text-[14rem] text-white leading-none tracking-tighter uppercase font-black drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
 >
 The
 </motion.span>
 <motion.h1 
 initial={{ opacity: 0, y: 40 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
 className="font-display text-5xl sm:text-6xl md:text-[14rem] lg:text-[18rem] leading-[0.75] uppercase tracking-[0.1em] text-primary select-none mt-[-2vw] md:mt-[-3vw] drop-shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
 >
 Journal
 </motion.h1>
 </div>
 </motion.div>
 </section>

 {/* Featured Masterpiece Section */}
 <section className="px-4 md:px-6 py-12 md:py-40 relative z-10">
 <div className="max-w-7xl mx-auto">
 <motion.div
 style={{ y: featuredY }}
 initial={{ opacity: 0, y: 100 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
 className="group relative"
 >
 <Link to={`/blogs/${featuredPost.id}`} className="block relative overflow-hidden rounded-[40px] md:rounded-[80px] aspect-[4/5] md:aspect-[21/9] border border-white/10">
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 group-hover:via-black/10 transition-colors duration-1000" />
 <motion.img 
 src={featuredPost.image} 
 alt={featuredPost.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform [transition-duration:3s] ease-out"
 />
 
 <div className="absolute inset-0 z-20 p-8 md:p-24 flex flex-col justify-end">
 <div className="grid md:grid-cols-12 gap-6 md:gap-12 items-end">
 <div className="md:col-span-8 space-y-4 md:space-y-8">
 <motion.div 
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 className="flex items-center gap-4 md:gap-6"
 >
 <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.5em] px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20">
 Featured Issue
 </span>
 <span className="text-[8px] md:text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">{featuredPost.date}</span>
 </motion.div>
 
 <h2 className="font-display text-3xl sm:text-4xl md:text-8xl lg:text-9xl text-white uppercase tracking-tighter leading-[0.8] group-hover:-translate-y-2 md:group-hover:-translate-y-4 transition-transform duration-1000">
 {featuredPost.title}
 </h2>
 </div>
 
 <div className="md:col-span-4 space-y-4 md:space-y-8 pb-4">
 <p className="text-white/50 text-base md:text-lg font-light leading-relaxed border-l border-primary/30 pl-6 md:pl-8 group-hover:text-white/80 transition-colors duration-700 line-clamp-2 md:line-clamp-none">
 {featuredPost.excerpt}
 </p>
 <div className="pl-6 md:pl-8">
 <span className="inline-flex items-center gap-4 md:gap-6 text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-primary group-hover:gap-6 md:group-hover:gap-10 transition-all duration-1000">
 Explore Story <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
 </span>
 </div>
 </div>
 </div>
 </div>
 </Link>
 </motion.div>
 </div>
 </section>

 {/* Modern Editorial Grid */}
 <section className="px-4 md:px-6 py-12 md:py-40 relative z-10">
 <div className="max-w-7xl mx-auto">
 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-24">
 {otherPosts.map((post, idx) => (
 <motion.div
 key={post.id}
 initial={{ opacity: 0, y: 100 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-50px" }}
 className={`flex flex-col ${
 idx % 3 === 0 ? 'md:col-span-12' : 'md:col-span-6'
 }`}
 >
 <Link to={`/blogs/${post.id}`} className="group relative block overflow-hidden rounded-[30px] md:rounded-[50px] bg-white/[0.02] border border-white/5 transition-all duration-700 hover:border-primary/20">
 <div className={`relative overflow-hidden ${
 idx % 3 === 0 ? 'aspect-[4/5] md:aspect-[21/9]' : 'aspect-square'
 }`}>
 <motion.img 
 src={post.image} 
 alt={post.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform [transition-duration:2s] ease-out opacity-60 group-hover:opacity-100 transition-opacity"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-1000" />
 </div>
 
 <div className="absolute inset-0 p-6 md:p-16 flex flex-col justify-end">
 <div className="space-y-4 md:space-y-6 max-w-2xl">
 <div className="flex items-center gap-4 text-primary text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-black">
 <span>{post.category}</span>
 <div className="flex items-center gap-2 text-white/40">
 <Clock className="w-3 h-3" /> {post.readTime}
 </div>
 </div>
 
 <h3 className={`font-display text-white uppercase tracking-tighter leading-none group-hover:text-primary transition-colors duration-700 ${
 idx % 3 === 0 ? 'text-3xl md:text-7xl' : 'text-2xl md:text-5xl'
 }`}>
 {post.title}
 </h3>
 
 <p className="text-white/40 font-light text-sm md:text-lg leading-relaxed line-clamp-2 max-w-lg group-hover:text-white/70 transition-colors duration-700">
 {post.excerpt}
 </p>
 </div>
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

export default Blogs;

