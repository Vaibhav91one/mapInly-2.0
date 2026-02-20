"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/home/project-card";
import { cn } from "@/lib/utils";

interface OrganizedEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  variant: "simple" | "detailed";
  timing: string;
  location: string;
  locationUrl?: string;
  active: boolean;
}

const MOCK_ORGANIZED_EVENTS: OrganizedEvent[] = [
  {
    id: "1",
    title: "App MyLugano",
    description: "Discover Lugano through our official city app.",
    image: "https://picsum.photos/seed/mylugano/600/400",
    href: "/events/app-mylugano",
    variant: "simple",
    timing: "Mar 15, 2025 - 6:00 PM",
    location: "Piazza della Riforma, Lugano",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=Piazza+della+Riforma,+Lugano",
    active: true,
  },
  {
    id: "2",
    title: "Earn Your Destination",
    description: "A cultural gamification initiative to enhance Lugano's cultural heritage.",
    image: "https://picsum.photos/seed/destination/600/400",
    href: "/events/earn-your-destination",
    variant: "detailed",
    timing: "Apr 20, 2025 - 10:00 AM",
    location: "LAC Lugano Arte e Cultura",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=LAC+Lugano+Arte+e+Cultura",
    active: true,
  },
  {
    id: "3",
    title: "Lugano University City",
    description: "Connecting academia with the city.",
    image: "https://picsum.photos/seed/university/600/400",
    href: "/events/university-city",
    variant: "simple",
    timing: "May 5, 2025 - 2:00 PM",
    location: "USI Campus, Lugano",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=USI+Campus,+Lugano",
    active: false,
  },
  {
    id: "4",
    title: "Past Event One",
    description: "A completed showcase event.",
    image: "https://picsum.photos/seed/past1/600/400",
    href: "/events/past-one",
    variant: "simple",
    timing: "Jan 10, 2025 - 5:00 PM",
    location: "Parco Ciani, Lugano",
    active: false,
  },
];

export function DashboardEventsCarousel() {
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");

  const filteredEvents = MOCK_ORGANIZED_EVENTS.filter((e) =>
    activeTab === "active" ? e.active : !e.active
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-regular leading-tight tracking-tight text-white md:text-3xl">
          Events you organized
        </h2>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "active" | "inactive")}
        >
          <TabsList className="w-fit border border-white/20 bg-white/10 text-white rounded-none p-0">
            <TabsTrigger
              value="active"
              className="text-white/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className="text-white/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
            >
              Inactive
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative">
        <Carousel
          opts={{
            loop: false,
            align: "start",
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {filteredEvents.map((event, index) => (
              <CarouselItem
                key={event.id}
                className={cn(
                  "pl-4",
                  "basis-full sm:basis-[85%] md:basis-1/2 lg:basis-1/3"
                )}
              >
                <div className="aspect-[4/5]">
                  <ProjectCard
                    index={index + 1}
                    title={event.title}
                    description={event.description}
                    image={event.image}
                    href={event.href}
                    variant={event.variant}
                    timing={event.timing}
                    location={event.location}
                    locationUrl={event.locationUrl}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            size="icon"
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-none border-0 bg-white text-black hover:bg-white/90 disabled:opacity-50"
          />
          <CarouselNext
            size="icon"
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-none border-0 bg-white text-black hover:bg-white/90 disabled:opacity-50"
          />
        </Carousel>
      </div>
    </div>
  );
}
