"use client";

import { motion } from "motion/react";

interface BlurTextEffectProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function BlurTextEffect({
  children,
  delay = 0,
  className,
}: BlurTextEffectProps) {
  return (
    <motion.span
      className={className}
      initial={{
        opacity: 0,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        filter: "blur(0px)",
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.span>
  );
}
