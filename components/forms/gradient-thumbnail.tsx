"use client";

import { StaticMeshGradient } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

interface GradientThumbnailProps {
  colors: string[];
  selected?: boolean;
  className?: string;
}

export function GradientThumbnail({
  colors,
  selected = false,
  className,
}: GradientThumbnailProps) {
  return (
    <div
      className={cn(
        "relative h-20 w-full overflow-hidden rounded-md border-2 transition-colors",
        selected ? "border-primary" : "border-white/20",
        className
      )}
    >
      <StaticMeshGradient
        width="100%"
        height="100%"
        fit="cover"
        colors={colors.length >= 4 ? colors : ["#b8cd65", "#6200ff", "#e2a3ff", "#ff99fd"]}
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
  );
}
