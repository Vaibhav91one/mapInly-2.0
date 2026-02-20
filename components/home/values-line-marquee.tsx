"use client";

import { motion, useMotionValue, useAnimationFrame, useTransform } from "motion/react";
import { wrap } from "@motionone/utils";
import ScrollRotatingAsterisk from "@/components/custom/ScrollingRotatingAsterisk";
import { cn } from "@/lib/utils";

interface ValuesLineMarqueeProps {
  text: string;
  className?: string;
  running?: boolean;
  /** Scroll speed (pixels per frame). Higher = faster. Default: 0.3 */
  speed?: number;
}

export function ValuesLineMarquee({
  text,
  className,
  running = true,
  speed = 0.3,
}: ValuesLineMarqueeProps) {
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-30, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (!running) return;
    baseX.set(baseX.get() - speed * (delta / 16));
  });

  const content = (
    <>
      <span className="whitespace-nowrap">{text}</span>
      <ScrollRotatingAsterisk
        mode="default"
        fill="current"
        color="text-white"
        size="size-10 md:size-12"
        className="shrink-0"
      />
    </>
  );

  return (
    <div
      className={cn(
        "overflow-hidden w-full bg-primary py-2 flex items-center",
        className
      )}
    >
      <motion.div
        className="flex items-center gap-6 whitespace-nowrap flex-nowrap text-white text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-tight"
        style={{ x }}
      >
        {content}
        {content}
        {content}
        {content}
      </motion.div>
    </div>
  );
}
