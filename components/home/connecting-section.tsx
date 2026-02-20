"use client";

import { ArrowLinkButton } from "@/components/ui/arrow-link-button";
import { MeshGradient } from "@paper-design/shaders-react";
import ScrollRotatingAsterisk from "@/components/custom/ScrollingRotatingAsterisk";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";

const EVENT_DATE = "1-5.12.2025";
const EVENT_LOCATION = "Asilo Ciani, Lugano";
const EVENT_TITLE = "Connecting has never been easier";
const EVENT_PAGE_URL = "/events";

export function ConnectingSection() {
  return (
    <section className={cn(sectionClasses, "h-[90dvh] relative flex flex-col")}>
      {/* MeshGradient background - full width and height */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden opcaity-60">
        <MeshGradient
          width="100%"
          height="100%"
          colors={["#e0eaff", "#241d9a", "#f75092", "#9f50d3"]}
          distortion={0.8}
          swirl={0.1}
          grainMixer={0}
          grainOverlay={0}
          speed={1}
        />
      </div>

      {/* Main content: left = event details, right = title + asterisk */}
      <div
        className={cn(
          sectionInnerClasses,
          "relative z-10 flex-1 flex flex-row items-center justify-center gap-12 pt-8 pb-4"
        )}
      >
        <div className="flex flex-row items-center justify-center gap-6 flex-wrap w-full">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-regular text-center text-white max-w-2xl">
            {EVENT_TITLE}
          </h2>
          <ScrollRotatingAsterisk
            mode="default"
            fill="current"
            color="text-white"
            size="size-14 md:size-16"
            className="shrink-0"
          />
          <ArrowLinkButton
            href={EVENT_PAGE_URL}
            text="See All Events"
            ariaLabel="See all events"
          />
        </div>
      </div>
    </section>
  );
}
