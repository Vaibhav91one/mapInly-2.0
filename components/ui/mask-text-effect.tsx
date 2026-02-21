"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

interface MaskTextEffectProps {
  phrases: string[];
  className?: string;
  textClassName?: string;
}

export function MaskTextEffect({
  phrases,
  className,
  textClassName,
}: MaskTextEffectProps) {
  const bodyRef = useRef(null);
  const isInView = useInView(bodyRef, { once: true, amount: 0.5 });

  const animation = {
    initial: { y: "100%" },
    enter: (i: number) => ({
      y: "0",
      transition: {
        duration: 0.75,
        ease: [0.33, 1, 0.68, 1] as const,
        delay: 0.075 * i,
      },
    }),
  };

  return (
    <div ref={bodyRef} className={className}>
      {phrases.map((phrase, index) => (
        <div key={index} className="overflow-hidden">
          <motion.span
            custom={index}
            variants={animation}
            initial="initial"
            animate={isInView ? "enter" : "initial"}
            className={cn("block", textClassName)}
          >
            {phrase}
          </motion.span>
        </div>
      ))}
    </div>
  );
}
