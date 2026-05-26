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
    switch (direction) {
      case "up": return { opacity: 0, y: yOffset, x: 0, scale };
      case "down": return { opacity: 0, y: -yOffset, x: 0, scale };
      case "left": return { opacity: 0, x: xOffset || 40, y: 0, scale };
      case "right": return { opacity: 0, x: -(xOffset || 40), y: 0, scale };
      case "none": return { opacity: 0, y: 0, x: 0, scale };
      default: return { opacity: 0, y: yOffset, x: 0, scale };
    }
  };

  return (
    <div 
      className={cn(className)} 
      style={{ position: "relative", width, overflow: "visible" }}
    >
      <motion.div
        initial={getInitial()}
        whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
        viewport={{ once: true, margin: "0px" }}
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
