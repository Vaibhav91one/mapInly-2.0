"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { EventCard } from "./event-card";
import { cn } from "@/lib/utils";
import { sectionClasses } from "@/lib/layout-classes";

const MOCK_EVENTS = [
  {
    id: "1",
    title: "Lugano AI Week 2025",
    description:
      "Discover how Artificial Intelligence is transforming the world",
    date: "01 – 05.12.2025",
    location: "Asilo Ciani, Lugano",
    tags: ["AI", "divulgazione", "formazione"],
    image: "https://picsum.photos/seed/aiweek/400/400",
    imageOverlay: "AI WEEK",
    href: "/events/lugano-ai-week-2025",
  },
  {
    id: "2",
    title: "SwissLedger - Art Edition. AI and Blockchain at the service of art.",
    description: "Free conference dedicated to innovation for the art world",
    date: "04.06.2025",
    location: "Asilo Ciani, Lugano",
    tags: ["artecultura", "blockchain", "network"],
    image: "https://picsum.photos/seed/swissledger/400/400",
    href: "/events/swissledger-art-edition",
  },
  {
    id: "3",
    title: "Ticino Tech Meetup",
    description: "Monthly meetup for tech enthusiasts in the Ticino region",
    date: "15.03.2025",
    location: "USI Campus, Lugano",
    tags: ["tech", "community", "innovation"],
    image: "https://picsum.photos/seed/ticinotech/400/400",
    href: "/events/ticino-tech-meetup",
  },
];

export function EventsContentSection() {
  const [mainEventsOnly, setMainEventsOnly] = useState(false);

  return (
    <section
      className={cn(
        sectionClasses,
        "min-h-screen bg-foreground px-14"
      )}
    >
      {/* Full-width search bar */}
      <div className="mb-8 w-full">
        <div className="relative">
          <Search
            className="absolute left-6 top-1/2 size-14 -translate-y-1/2 text-white/60 md:size-10"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search"
            className="h-[80px] w-full rounded-none border-secondary pl-16 text-4xl md:pl-20 md:text-4xl font-regular leading-tight tracking-tight text-background placeholder:text-background/60 focus-visible:border-white/40 focus-visible:ring-white/20"
            aria-label="Search events"
          />
        </div>
      </div>

      {/* Two columns: 1/3 sticky sidebar | 2/3 event cards */}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Left: Sticky sidebar (1/3) */}
        <aside className="w-full shrink-0 lg:sticky lg:top-28 lg:w-1/4">
          <div className="flex items-center justify-between gap-4 rounded-none bg-secondary/50 px-5 py-4 hover:bg-secondary/80 transition-colors">
            <span className="text-base font-medium text-background">
              Main Events
            </span>
            <Switch
              checked={mainEventsOnly}
              onCheckedChange={setMainEventsOnly}
              aria-label="Filter main events only"
            />
          </div>
        </aside>

        {/* Right: Event cards (2/3) */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:w-3/4">
          {MOCK_EVENTS.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              description={event.description}
              date={event.date}
              location={event.location}
              tags={event.tags}
              image={event.image}
              imageOverlay={event.imageOverlay}
              href={event.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
