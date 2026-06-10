import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-dvh bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <SEO 
        title="404 - Page Not Found | NOR PERFUME"
        description="The requested page could not be found. Return to the NOR PERFUME luxury experience."
        noindex={true}
      />

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center space-y-12">
        <div className="space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] tracking-[0.6em] uppercase text-primary font-black"
          >
            Lost in Scent
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[10rem] md:text-[15rem] leading-none text-white/5 tracking-tighter select-none"
          >
            404
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl md:text-5xl text-white uppercase tracking-tight mt-[-4rem] md:mt-[-6rem]"
          >
            Page <span className="text-primary italic font-light lowercase">Not Found</span>
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/40 font-light text-base md:text-lg max-w-md mx-auto leading-relaxed"
        >
          The requested trail has vanished. Allow us to guide you back to our curated collections.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white/[0.03] border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary hover:border-primary hover:text-black transition-all group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Return to Store
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default NotFound;
