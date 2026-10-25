"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProjectCard } from "@/components/home/project-card";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";

export interface Organizer {
  name: string;
  title: string;
  image: string;
}

interface EventOrganizedBySectionProps {
  organizers: Organizer[];
}

export function EventOrganizedBySection({ organizers }: EventOrganizedBySectionProps) {
  if (organizers.length === 0) return null;

  return (
    <section
      className={cn(
        sectionClasses,
        "bg-foreground overflow-visible"
      )}
    >
      <div
        className={cn(
          sectionInnerClasses,
          "grid grid-cols-1 gap-8 lg:grid-cols-[1fr_3fr] lg:items-start lg:gap-16"
        )}
      >
        {/* 1/4: heading */}
        <h2 className="text-4xl font-regular tracking-tight leading-tight text-background md:text-5xl lg:text-6xl">
          Organized by
        </h2>

        {/* 3/4: carousel with gap between cards */}
        <div className="w-full overflow-hidden">
          <Carousel
            opts={{
              loop: true,
              align: "start",
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {organizers.map((org, index) => (
                <CarouselItem
                  key={`${org.name}-${index}`}
                  className="pl-6 basis-full sm:basis-[85%] md:basis-1/2 lg:basis-1/3"
                >
                  <div className="h-full min-h-[340px] w-full">
                    <ProjectCard
                      title={org.name}
                      image={org.image}
                      variant="organizer"
                    />
                  </div>
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
