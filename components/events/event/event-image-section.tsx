"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

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
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </motion.div>
    </div>
  );
}
