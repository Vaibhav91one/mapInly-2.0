"use client";

import { useMemo } from "react";
import { EventsHeroSection, EventsContentSection } from "@/components/events";
import { Footer } from "@/components/layout";
import { useLocalizedEvents } from "@/lib/demo/localize";

export function EventsView() {
  const events = useLocalizedEvents();
  const newestFirst = useMemo(
    () => [...events].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [events]
  );
  return (
    <main className="flex flex-1 flex-col pt-20">
      <EventsHeroSection />
      <EventsContentSection events={newestFirst} />
      <Footer />
    </main>
  );
}
