"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProjectCard } from "./project-card";
import { GradientCardMedia } from "./gradient-card-media";
import { ArrowLinkButton } from "@/components/ui/arrow-link-button";
import { cn } from "@/lib/utils";
import { sectionClasses } from "@/lib/layout-classes";

const PROJECTS = [
  {
    index: 1,
    title: "App MyLugano",
    description: "Discover Lugano through our official city app.",
    image: "https://picsum.photos/seed/mylugano/600/400",
    href: "/projects/app-mylugano",
    variant: "simple" as const,
    timing: "Mar 15, 2025 · 6:00 PM",
    location: "Piazza della Riforma, Lugano",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=Piazza+della+Riforma,+Lugano",
  },
  {
    index: 2,
    title: "Earn Your Destination",
    description:
      "A cultural gamification initiative to enhance Lugano's cultural heritage, combat overtourism and strengthen the bond between tourists, citizens and territory.",
    image: "https://picsum.photos/seed/destination/600/400",
    media: <GradientCardMedia />,
    href: "/projects/earn-your-destination",
    variant: "detailed" as const,
    timing: "Apr 20, 2025 · 10:00 AM",
    location: "LAC Lugano Arte e Cultura",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=LAC+Lugano+Arte+e+Cultura",
  },
  {
    index: 3,
    title: "Lugano University City",
    description: "Connecting academia with the city.",
    image: "https://picsum.photos/seed/university/600/400",
    href: "/projects/university-city",
    variant: "simple" as const,
    timing: "May 5, 2025 · 2:00 PM",
    location: "USI Campus, Lugano",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=USI+Campus,+Lugano",
  },
  {
    index: 4,
    title: "Project Four",
    description: "An innovative showcase event.",
    image: "https://picsum.photos/seed/project4/600/400",
    href: "/projects/project-four",
    variant: "simple" as const,
    timing: "Jun 12, 2025 · 5:00 PM",
    location: "Parco Ciani, Lugano",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=Parco+Ciani,+Lugano",
  },
];

export function CarouselSection() {
  return (
    <section
      className={cn(
        sectionClasses,
        "min-h-screen bg-foreground py-16 md:py-24 overflow-visible"
      )}
    >
      <div className="px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <p className="text-sm text-background/80 order-2 md:order-1">
            Projects {PROJECTS.length}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-regular tracking-tight leading-tight text-background text-center order-1 md:order-2">
            Upcoming Events
          </h2>
          <div className="order-3">
            <ArrowLinkButton
              href="/projects"
              text="All Events"
              ariaLabel="View all events"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            />
          </div>
        </div>
      </div>

      {/* Full-width Carousel - touches viewport edges */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden">
        <div className="relative">
          <Carousel
            opts={{
              loop: true,
              align: "start",
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {PROJECTS.map((project) => (
                <CarouselItem
                  key={project.index}
                  className="aspect-[4/5] min-h-0 shrink-0 basis-full pl-0 sm:basis-[85%] md:basis-1/2 lg:basis-1/3"
                >
                  <ProjectCard
                    index={project.index}
                    title={project.title}
                    description={project.description}
                    image={project.image}
                    media={project.media}
                    href={project.href}
                    variant={project.variant}
                    timing={project.timing}
                    location={project.location}
                    locationUrl={project.locationUrl}
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
        </div>
      </div>
    </section>
  );
}
