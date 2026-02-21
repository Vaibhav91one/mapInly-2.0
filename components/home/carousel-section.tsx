"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProjectCard } from "./project-card";
import { ArrowLinkButton } from "@/components/ui/arrow-link-button";
import { StaticMeshGradient } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";
import { sectionClasses } from "@/lib/layout-classes";
import type { Event } from "@/types/event";

function isGradient(src: string): boolean {
  return src?.startsWith("gradient:") ?? false;
}

function parseGradientColors(src: string): string[] {
  const colors = src.slice(9).split(",").map((c) => c.trim());
  return colors.length === 4 ? colors : ["#b8cd65", "#6200ff", "#e2a3ff", "#ff99fd"];
}

function locationUrl(location: Event["location"]): string | undefined {
  if (location.mapsUrl) return location.mapsUrl;
  const q = encodeURIComponent(location.displayName);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

interface CarouselSectionProps {
  events: Event[];
}

export function CarouselSection({ events }: CarouselSectionProps) {
  const count = events.length;

  return (
    <section
      className={cn(
        sectionClasses,
        "min-h-screen bg-foreground py-16 md:py-24 overflow-visible"
      )}
    >
      <div className="px-6 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <p className="text-sm text-background/80 order-2 md:order-1">
            Events {count}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-regular tracking-tight leading-tight text-background text-center order-1 md:order-2">
            Upcoming Events
          </h2>
          <div className="order-3">
            <ArrowLinkButton
              href="/events"
              text="All Events"
              ariaLabel="View all events"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            />
          </div>
        </div>
      </div>

      <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden">
        <div className="relative">
          {count === 0 ? (
            <div
              className="flex aspect-[21/6] w-full items-center justify-center bg-foreground/50"
              role="status"
            >
              <p className="text-lg text-background/70">No upcoming events</p>
            </div>
          ) : (
            <Carousel
              opts={{
                loop: true,
                align: "start",
                slidesToScroll: 1,
              }}
              className="w-full"
            >
              <CarouselContent className="ml-0">
                {events.map((event, index) => (
                  <CarouselItem
                    key={event.id}
                    className="aspect-[4/5] min-h-0 shrink-0 basis-full pl-0 sm:basis-[85%] md:basis-1/2 lg:basis-1/3"
                  >
                    <ProjectCard
                      index={index + 1}
                      title={event.title}
                      description={event.shortDescription}
                      image={isGradient(event.image) ? undefined : event.image}
                      media={
                        isGradient(event.image) ? (
                          <StaticMeshGradient
                            width="100%"
                            height="100%"
                            fit="cover"
                            colors={parseGradientColors(event.image)}
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
                        ) : undefined
                      }
                      href={`/events/${event.slug}`}
                      variant="simple"
                      timing={`${event.date} · ${event.timeRange}`}
                      location={event.location.displayName}
                      locationUrl={locationUrl(event.location)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                size="icon"
                className="absolute top-1/2 -translate-y-1/2 z-10 left-4 rounded-none size-12 bg-foreground text-background border-0 hover:bg-foreground/90 disabled:opacity-50"
              />
              <CarouselNext
                size="icon"
                className="absolute top-1/2 -translate-y-1/2 z-10 right-4 rounded-none size-12 bg-foreground text-background border-0 hover:bg-foreground/90 disabled:opacity-50"
              />
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}
