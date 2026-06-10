import { motion, useReducedMotion, Variants } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  scale?: number;
  xOffset?: number;
  yOffset?: number;
  className?: string;
  width?: "fit-content" | "100%";
}

export const Reveal = ({ 
  children, 
  className,
  width = "100%", 
  direction = "up", 
  delay = 0, 
  duration = 0.5,
  scale = 1,
  xOffset = 20,
  yOffset = 20
}: RevealProps) => {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : scale,
      filter: shouldReduceMotion ? "none" : "blur(10px)",
      x: shouldReduceMotion ? 0 : (direction === "left" ? xOffset : direction === "right" ? -xOffset : 0),
      y: shouldReduceMotion ? 0 : (direction === "up" ? yOffset : direction === "down" ? -yOffset : 0),
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }
    }
  };

  return (
    <div 
      className={cn("relative overflow-hidden", className)} 
      style={{ width }}
    >
      <motion.div
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {children}
      </motion.div>
    </div>
  );
};
