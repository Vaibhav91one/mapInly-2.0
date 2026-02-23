"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { isSameDay } from "date-fns";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";
import { CreateEventDialog } from "@/components/dialogs/create-event-dialog";
import { CreateForumDialog } from "@/components/dialogs/create-forum-dialog";
import { StatCard } from "./stat-card";
import { DashboardCalendar } from "./dashboard-calendar";
import { UpcomingEventCard } from "./upcoming-event-card";
import { DashboardEventsCarousel } from "./dashboard-events-carousel";
import { DashboardForumsCarousel } from "./dashboard-forums-carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/event";
import type { Forum } from "@/types/forum";
import {
  parseEventDate,
  eventToUpcomingCard,
} from "@/lib/parse-event-date";
import { keys } from "@/lib/i18n/keys";

interface Stat {
  titleKey: string;
  value: number;
  trend: { direction: "up" | "down"; percent: number; label: string };
}

interface DashboardContentSectionProps {
  stats: Stat[];
  activeOrganizedEvents: Event[];
  inactiveOrganizedEvents: Event[];
  activeForums: Forum[];
  inactiveForums: Forum[];
  upcomingEventsList: Event[];
  datesWithEvents: Date[];
}

export function DashboardContentSection({
  stats,
  activeOrganizedEvents,
  inactiveOrganizedEvents,
  activeForums,
  inactiveForums,
  upcomingEventsList,
  datesWithEvents,
}: DashboardContentSectionProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) {
      return upcomingEventsList
        .sort((a, b) => {
          const da = parseEventDate(a.date)?.getTime() ?? 0;
          const db = parseEventDate(b.date)?.getTime() ?? 0;
          return da - db;
        })
        .map((e, i) => eventToUpcomingCard(e, i));
    }
    return upcomingEventsList
      .filter((e) => {
        const eventDate = parseEventDate(e.date);
        return eventDate && isSameDay(eventDate, selectedDate);
      })
      .sort((a, b) => {
        const da = parseEventDate(a.date)?.getTime() ?? 0;
        const db = parseEventDate(b.date)?.getTime() ?? 0;
        return da - db;
      })
      .map((e, i) => eventToUpcomingCard(e, i));
  }, [upcomingEventsList, selectedDate]);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingForum, setEditingForum] = useState<Forum | null>(null);

  async function handleDeleteEvent(event: Event) {
    const res = await fetch(`/api/events/${event.slug}`, { method: "DELETE" });
    if (!res.ok) return;
    setEditingEvent((current) => (current?.id === event.id ? null : current));
    router.refresh();
  }

  async function handleDeleteForum(forum: Forum) {
    const res = await fetch(`/api/forums/${forum.slug}`, { method: "DELETE" });
    if (!res.ok) return;
    setEditingForum((current) => (current?.id === forum.id ? null : current));
    router.refresh();
  }

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
        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[1fr_minmax(0,3fr)] lg:gap-16">
          {/* 1/4 Sidebar */}
          <div className="flex flex-col gap-8">
            <div className="rounded-lg border border-white/20 bg-white/10 p-4">
              <DashboardCalendar
                date={selectedDate}
                onDateChange={setSelectedDate}
                datesWithEvents={datesWithEvents}
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-regular leading-tight tracking-tight text-white">
                {t(keys.dashboard.upcomingEvents)}
                {selectedDate && (
                  <span className="ml-2 text-lg font-normal text-white/70">
                    {selectedDate.toLocaleDateString(i18n.language || "en", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </h3>
              <ScrollArea className="h-[642px] pr-4">
                <div className="space-y-3">
                  {eventsForSelectedDate.length === 0 ? (
                    <p className="py-8 text-center text-white/60">
                      {selectedDate
                        ? t(keys.dashboard.noEventsOnDate)
                        : t(keys.dashboard.noUpcomingEvents)}
                    </p>
                  ) : (
                    eventsForSelectedDate.map((ev) => (
                      <UpcomingEventCard key={ev.href} {...ev} />
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* 3/4 Main */}
          <div className="flex min-w-0 flex-col gap-10 overflow-hidden">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatCard
                  key={stat.titleKey}
                  title={t(stat.titleKey)}
                  value={stat.value}
                  trend={stat.trend}
                />
              ))}
            </div>
            <DashboardEventsCarousel
              activeEvents={activeOrganizedEvents}
              inactiveEvents={inactiveOrganizedEvents}
              onEditEvent={setEditingEvent}
              onDeleteEvent={handleDeleteEvent}
            />
            <DashboardForumsCarousel
              activeForums={activeForums}
              inactiveForums={inactiveForums}
              onEditForum={setEditingForum}
              onDeleteForum={handleDeleteForum}
            />
          </div>
        </div>
      </div>
      <CreateEventDialog
        open={!!editingEvent}
        onOpenChange={(open: boolean) => !open && setEditingEvent(null)}
        event={editingEvent}
      />
      <CreateForumDialog
        open={!!editingForum}
        onOpenChange={(open: boolean) => !open && setEditingForum(null)}
        forum={editingForum}
      />
    </section>
  );
}
