"use client";

import { useRef } from "react";
import Image from "next/image";
import { StaticMeshGradient } from "@paper-design/shaders-react";
import { motion, useScroll, useTransform } from "motion/react";

function isGradient(src: string): boolean {
  return src?.startsWith("gradient:") ?? false;
}

function parseGradientColors(src: string): string[] {
  const colors = src.slice(9).split(",").map((c) => c.trim());
  return colors.length === 4 ? colors : ["#b8cd65", "#6200ff", "#e2a3ff", "#ff99fd"];
}

interface EventImageSectionProps {
  src: string;
  alt: string;
}

export function EventImageSection({ src, alt }: EventImageSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-100%", "100%"]);

  const showGradient = isGradient(src);
  const gradientColors = showGradient ? parseGradientColors(src) : null;

  return (
    <div
      ref={containerRef}
      className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden"
      style={{ clipPath: "inset(0)" }}
    >
      <motion.div
        className="relative aspect-video w-full min-h-[60vh] md:aspect-[16/10] md:min-h-[60vh]"
        style={{ y }}
      >
        {showGradient && gradientColors ? (
          <div className="absolute inset-0 w-full h-full">
            <StaticMeshGradient
              width="100%"
              height="100%"
              fit="cover"
              colors={gradientColors}
              positions={2}
              waveX={1}
              waveXShift={0.6}
              waveY={1}
              waveYShift={0.21}
              mixing={0.93}
              grainMixer={0.31}
              grainOverlay={0.48}
              rotation={270}
            />
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
      </motion.div>
    </div>
  );
}
