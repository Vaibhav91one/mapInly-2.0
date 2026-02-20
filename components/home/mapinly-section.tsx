"use client";

import ScrollRotatingAsterisk from "@/components/custom/ScrollingRotatingAsterisk";
import { sectionClasses } from "@/lib/layout-classes";
import { cn } from "@/lib/utils";

export function MapInlySection() {
  return (
    <section
      className={cn(
        sectionClasses,
        "flex min-h-[40vh] flex-col items-center justify-center bg-black py-24"
      )}
    >
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
        <ScrollRotatingAsterisk
          size="size-24 md:size-32"
          mode="default"
          fill="current"
          color="text-white"
        />
        <h2 className="text-6xl font-light tracking-tight text-white md:text-8xl lg:text-9xl">
          MapInly
        </h2>
      </div>
    </section>
  );
}
