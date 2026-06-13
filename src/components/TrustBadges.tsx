import React from "react";
import { Truck, ShieldCheck, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  { icon: Truck, label: "All India Shipping" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: Headphones, label: "24/7 Support" },
];

const TrustBadges = () => (
  <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto py-8 px-2 sm:px-4">
    {badges.map(({ icon: Icon, label }, idx) => (
      <motion.div 
        key={label} 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1, duration: 0.8 }}
        viewport={{ once: true }}
        className="flex flex-col items-center gap-2 text-center group"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:border-primary/30 transition-colors duration-500">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <span className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.15em] uppercase text-muted-foreground/60 group-hover:text-foreground transition-colors duration-500">{label}</span>
      </motion.div>
    ))}
  </div>
);

export default TrustBadges;
