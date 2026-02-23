"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { ValuesLineMarquee } from "./values-line-marquee";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";
import { keys } from "@/lib/i18n/keys";

const LINE_KEYS = [
  { key: keys.values.weListen, align: "pl-0" },
  { key: keys.values.weExperiment, align: "pl-[25%]" },
  { key: keys.values.weMeasure, align: "pl-[20%]" },
  { key: keys.values.weShare, align: "ml-[60%]" },
] as const;

export function ValuesSection() {
  const { t } = useTranslation();
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
        {LINE_KEYS.map((line, index) => (
          <div
            key={line.key}
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
                {t(line.key)}
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
                  text={t(line.key)}
                  running={hoveredIndex === index}
                  speed={0.2}
                  className="h-full"
                />
              </motion.div>
            </div>
            {index < LINE_KEYS.length - 1 && (
              <Separator className="bg-secondary" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
