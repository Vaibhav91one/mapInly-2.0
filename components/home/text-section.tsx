"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";
import ScrollRotatingAsterisk from "../custom/ScrollingRotatingAsterisk";

const paragraph1 = [
  "Mapinly brings people together across languages and cultures.",
  "Learn, connect, and explore",
];

const paragraph2 = [
  "Whether you're learning a new language or discovering cultures,",
  "Mapinly provides the tools and community to make it happen.",
];

function MaskText({
  phrases,
  className,
}: {
  phrases: string[];
  className?: string;
}) {
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
          <motion.p
            custom={index}
            variants={animation}
            initial="initial"
            animate={isInView ? "enter" : "initial"}
            className="text-5xl md:text-6xl tracking-tight lg:text-7xl font-regular leading-tight"
          >
            {phrase}
          </motion.p>
        </div>
      ))}
    </div>
  );
}

export function TextSection() {
  return (
    <section className={cn(sectionClasses, "min-h-screen")}>
      <div
        className={cn(
          sectionInnerClasses,
          "min-h-screen items-start! justify-center! gap-12 text-left"
        )}
      >
        <MaskText phrases={paragraph1} className="flex flex-col gap-2 pl-20 text-right" />
        <MaskText phrases={paragraph2} className="flex flex-col gap-2" />
      </div>
    </section>
  );
}
