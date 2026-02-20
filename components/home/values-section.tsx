"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { ValuesLineMarquee } from "./values-line-marquee";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";

const LINES = [
  { text: "We listen", align: "pl-0" },
  { text: "We experiment", align: "pl-[25%]" },
  { text: "We measure", align: "pl-[20%]" },
  { text: "We share", align: "ml-[60%]" },
];

export function ValuesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      className={cn(
        sectionClasses,
        "min-h-screen bg-foreground py-16 md:py-24"
      )}
    >
      <div
        className={cn(
          sectionInnerClasses,
          "min-h-0 flex flex-col gap-0 items-stretch"
        )}
      >
        {LINES.map((line, index) => (
          <div
            key={line.text}
            className="flex flex-col"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative overflow-hidden cursor-pointer h-[8rem]">
              {/* Static text - slides up on hover */}
              <motion.p
                className={cn(
                  "absolute inset-x-0 top-0 text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-tight text-background whitespace-nowrap py-2",
                  line.align
                )}
                animate={{
                  y: hoveredIndex === index ? "-100%" : 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.585, 0.039, 0.26, 0.681],
                }}
              >
                {line.text}
              </motion.p>
              {/* Marquee - slides up from bottom on hover */}
              <motion.div
                className="absolute inset-x-0 top-0 h-full w-full"
                animate={{
                  y: hoveredIndex === index ? 0 : "100%",
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.585, 0.039, 0.26, 0.681],
                }}
              >
                <ValuesLineMarquee
                  text={line.text}
                  running={hoveredIndex === index}
                  speed={0.2}
                  className="h-full"
                />
              </motion.div>
            </div>
            {index < LINES.length - 1 && (
              <Separator className="bg-secondary" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
