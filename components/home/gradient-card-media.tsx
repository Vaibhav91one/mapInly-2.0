"use client";

import { StaticMeshGradient } from "@paper-design/shaders-react";

export function GradientCardMedia() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <StaticMeshGradient
        width="100%"
        height="100%"
        fit="cover"
        colors={["#b8cd65", "#6200ff", "#e2a3ff", "#ff99fd"]}
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
