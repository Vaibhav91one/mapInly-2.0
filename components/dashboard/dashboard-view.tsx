"use client";

import { DashboardHeroSection, DashboardContentSection } from "@/components/dashboard";
import { keys } from "@/lib/i18n/keys";
import { Footer } from "@/components/layout";
import { parseEventDate } from "@/lib/parse-event-date";
import { useLocalizedEvents, useLocalizedForums } from "@/lib/demo/localize";
import { useAuthStore } from "@/stores/auth-store";
import type { Event } from "@/types/event";
import type { Forum } from "@/types/forum";

export function DashboardView() {
  const user = useAuthStore((s) => s.user);
  const events = useLocalizedEvents();
  const forums = useLocalizedForums();

  const organizedEvents = user
    ? events.filter((e) => e.createdBy === user.id)
    : [];
  const organizedForums = user
    ? forums.filter((f: Forum) => f.createdBy === user.id)
    : [];

  const now = Date.now();
  // Upcoming = events user organized OR registered for
  const upcomingEventsList = user
    ? [...events]
        .filter((e) => {
          const isUpcoming = (parseEventDate(e.date)?.getTime() ?? 0) >= now;
          const isOrganizer = e.createdBy === user.id;
          const isRegistered = e.registrations?.includes(user.id);
          return isUpcoming && (isOrganizer || isRegistered);
        })
        .sort((a: Event, b: Event) => {
          const da = parseEventDate(a.date)?.getTime() ?? 0;
          const db = parseEventDate(b.date)?.getTime() ?? 0;
          return da - db;
        })
    : [];

  const datesWithEvents = upcomingEventsList
    .map((e) => parseEventDate(e.date))
    .filter((d): d is Date => d !== null);

  const activeOrganized = organizedEvents.filter((e) => {
    const d = parseEventDate(e.date);
    return d && d.getTime() >= now;
  });
  const inactiveOrganized = organizedEvents.filter((e: Event) => {
    const d = parseEventDate(e.date);
    return d && d.getTime() < now;
  });

  const activeForums = organizedForums.filter((f) => f.status === "active");
  const inactiveForums = organizedForums.filter((f) => f.status === "closed");

  const stats = [
    {
      titleKey: keys.dashboard.statsEventsOrganized,
      value: organizedEvents.length,
      trend: { direction: "up" as const, percent: 0, label: "total" },
    },
    {
      titleKey: keys.dashboard.statsForumsCreated,
      value: organizedForums.length,
      trend: { direction: "up" as const, percent: 0, label: "total" },
    },
    {
      titleKey: keys.dashboard.statsEventsAttended,
      value: user
        ? events.filter((e: Event) => e.registrations?.includes(user.id)).length
        : 0,
      trend: { direction: "up" as const, percent: 0, label: "total" },
    },
    {
      titleKey: keys.dashboard.statsUpcomingEvents,
      value: upcomingEventsList.length,
      trend: { direction: "down" as const, percent: 0, label: "total" },
    },
  ];

  return (
    <main className="flex flex-1 flex-col bg-black pt-20 text-white">
      <DashboardHeroSection />
      <DashboardContentSection
        stats={stats}
        activeOrganizedEvents={activeOrganized}
        inactiveOrganizedEvents={inactiveOrganized}
        activeForums={activeForums}
        inactiveForums={inactiveForums}
        upcomingEventsList={upcomingEventsList}
        datesWithEvents={datesWithEvents}
      />
      <Footer />
    </main>
  );
}
