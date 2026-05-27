import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  scale?: number;
}

export const Reveal = ({ 
  children, 
  className,
  width = "100%", 
  delay = 0.2, 
  duration = 1.0,
  yOffset = 40,
  xOffset = 0,
  direction = "up",
  scale = 1
}: RevealProps) => {
  const getInitial = () => {
    const base = { opacity: 0, scale, filter: "blur(10px)" };
    switch (direction) {
      case "up": return { ...base, y: yOffset, x: 0 };
      case "down": return { ...base, y: -yOffset, x: 0 };
      case "left": return { ...base, x: xOffset || 40, y: 0 };
      case "right": return { ...base, x: -(xOffset || 40), y: 0 };
      case "none": return { ...base, y: 0, x: 0 };
      default: return { ...base, y: yOffset, x: 0 };
    }
  };

  return (
    <div 
      className={cn(className)} 
      style={{ position: "relative", width, overflow: "visible" }}
    >
      <motion.div
        initial={getInitial()}
        whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ 
          duration, 
          delay, 
          ease: [0.22, 1, 0.36, 1] 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
