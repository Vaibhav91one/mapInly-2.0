"use client";

import { useState } from "react";
import { addDays } from "date-fns";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";
import { StatCard } from "./stat-card";
import { DashboardCalendar } from "./dashboard-calendar";
import { UpcomingEventCard } from "./upcoming-event-card";
import { DashboardEventsCarousel } from "./dashboard-events-carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const MOCK_STATS = [
  {
    title: "Events Organized",
    value: 32,
    trend: { direction: "up" as const, percent: 10, label: "vs last Month" },
  },
  {
    title: "Events Attended",
    value: 12,
    trend: { direction: "up" as const, percent: 25, label: "vs last Month" },
  },
  {
    title: "Upcoming Events",
    value: 28,
    trend: { direction: "down" as const, percent: 8, label: "vs last Month" },
  },
];

const MOCK_UPCOMING_EVENTS = [
  {
    day: 15,
    dayName: "Sat",
    title: "App MyLugano Launch",
    subtitle: "Discover Lugano through our official city app",
    timeRange: "6:00 PM - 8:00 PM",
    location: "Piazza della Riforma, Lugano",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=Piazza+della+Riforma,+Lugano",
    dateBlockColor: "primary" as const,
    href: "/events/app-mylugano",
  },
  {
    day: 20,
    dayName: "Thu",
    title: "Earn Your Destination",
    subtitle: "Cultural gamification initiative",
    timeRange: "10:00 AM - 2:00 PM",
    location: "LAC Lugano Arte e Cultura",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=LAC+Lugano+Arte+e+Cultura",
    dateBlockColor: "blue" as const,
    href: "/events/earn-your-destination",
  },
  {
    day: 25,
    dayName: "Tue",
    title: "Lugano University City",
    subtitle: "Connecting academia with the city",
    timeRange: "2:00 PM - 5:00 PM",
    location: "USI Campus, Lugano",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=USI+Campus,+Lugano",
    dateBlockColor: "purple" as const,
    href: "/events/university-city",
  },
];

const MOCK_DATES_WITH_EVENTS = [
  addDays(new Date(), 5),
  addDays(new Date(), 10),
  addDays(new Date(), 15),
  addDays(new Date(), 20),
  addDays(new Date(), 25),
];

export function DashboardContentSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <section
      className={cn(
        sectionClasses,
        "min-h-screen bg-black text-white"
      )}
    >
      <div
        className={cn(
          sectionInnerClasses,
          "items-stretch gap-8 lg:gap-16"
        )}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_3fr] lg:gap-16">
          {/* 1/4 Sidebar */}
          <div className="flex flex-col gap-8">
            <div className="rounded-lg border border-white/20 bg-white/10 p-4">
              <DashboardCalendar
                date={selectedDate}
                onDateChange={setSelectedDate}
                datesWithEvents={MOCK_DATES_WITH_EVENTS}
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-regular leading-tight tracking-tight text-white">
                Upcoming Events
              </h3>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {MOCK_UPCOMING_EVENTS.map((event) => (
                    <UpcomingEventCard key={event.title} {...event} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* 3/4 Main */}
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {MOCK_STATS.map((stat) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  trend={stat.trend}
                />
              ))}
            </div>
            <DashboardEventsCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
