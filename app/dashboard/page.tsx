import { DashboardHeroSection, DashboardContentSection } from "@/components/dashboard";
import { keys } from "@/lib/i18n/keys";
import { Footer } from "@/components/layout";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { getEventsWithTranslations } from "@/lib/events/get-event-with-translation";
import { getForumsWithTranslations } from "@/lib/forums/get-forum-with-translation";
import { getLocaleFromRequest } from "@/lib/i18n/get-locale-server";
import { parseEventDate } from "@/lib/parse-event-date";
import type { Event } from "@/types/event";
import type { Forum, ForumStatus } from "@/types/forum";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your events and forums – manage what you create and join.",
};

function toApiEvent(e: {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  date: string;
  timeRange: string;
  location: unknown;
  tags: string[];
  image: string;
  imageOverlay: string | null;
  createdBy: string;
  createdAt: Date;
  registrations: { userId: string }[];
  sourceLocale?: string;
}) {
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    tagline: e.tagline,
    shortDescription: e.shortDescription,
    date: e.date,
    timeRange: e.timeRange,
    location: e.location as { displayName: string; latitude: number; longitude: number; mapsUrl?: string },
    tags: e.tags,
    image: e.image,
    imageOverlay: e.imageOverlay ?? undefined,
    createdBy: e.createdBy,
    createdAt: e.createdAt.toISOString(),
    registrations: e.registrations.map((r) => r.userId),
    sourceLocale: e.sourceLocale ?? "en",
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = await getLocaleFromRequest();
  const [eventsRaw, forumsRaw] = await Promise.all([
    prisma.event.findMany({ include: { registrations: true } }),
    prisma.forum.findMany(),
  ]);
  const [eventsWithTx, forumsWithTx] = await Promise.all([
    getEventsWithTranslations(eventsRaw, locale),
    getForumsWithTranslations(forumsRaw, locale),
  ]);
  const events = eventsWithTx.map(toApiEvent) as Event[];
  type ForumRow = (typeof forumsWithTx)[number];
  const forums = forumsWithTx.map((f: ForumRow) => ({
    id: f.id,
    slug: f.slug,
    title: f.title,
    tagline: f.tagline,
    shortDescription: f.shortDescription,
    status: f.status as ForumStatus,
    tags: f.tags,
    image: f.image ?? undefined,
    createdBy: f.createdBy,
    createdAt: f.createdAt.toISOString(),
    sourceLocale: f.sourceLocale ?? "en",
  })) as Forum[];

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
