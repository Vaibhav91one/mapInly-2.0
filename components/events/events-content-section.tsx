"use client";

import { useMemo, useState } from "react";
import { CalendarX2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { EventCard } from "./event-card";
import { cn } from "@/lib/utils";
import { sectionClasses } from "@/lib/layout-classes";
import { isEventPast } from "@/lib/event-date";
import type { Event } from "@/types/event";

interface EventsContentSectionProps {
  events: Event[];
}

export function EventsContentSection({ events }: EventsContentSectionProps) {
  const [mainEventsOnly, setMainEventsOnly] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);

  const filteredEvents = useMemo(() => {
    if (showPastEvents) return events;
    return events.filter((e) => !isEventPast(e));
  }, [events, showPastEvents]);

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
        <aside className="flex w-full shrink-0 flex-col gap-4 lg:sticky lg:top-28 lg:w-1/4">
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
          <div className="flex items-center justify-between gap-4 rounded-none bg-secondary/50 px-5 py-4 hover:bg-secondary/80 transition-colors">
            <span className="text-base font-medium text-background">
              Past events
            </span>
            <Switch
              checked={showPastEvents}
              onCheckedChange={setShowPastEvents}
              aria-label="Show past events"
            />
          </div>
        </aside>

        {/* Right: Event cards (2/3) */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:w-3/4">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-none border border-secondary/50 bg-secondary/20 px-8 py-16 text-center">
              <CalendarX2 className="mb-4 size-16 text-background/50" aria-hidden />
              <h3 className="mb-2 text-xl font-medium text-background">
                No events to show
              </h3>
              <p className="max-w-md text-background/70">
                {showPastEvents
                  ? "There are no events in the system yet."
                  : "There are no upcoming events. Try enabling Past events to see previous events."}
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                shortDescription={event.shortDescription}
                tagline={event.tagline}
                date={event.date}
                location={event.location.displayName}
                tags={event.tags}
                image={event.image}
                imageOverlay={event.imageOverlay}
                href={`/events/${event.slug}`}
                isPast={isEventPast(event)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
