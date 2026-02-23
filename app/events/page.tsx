import { EventsHeroSection, EventsContentSection } from "@/components/events";
import { Footer } from "@/components/layout";
import { prisma } from "@/lib/prisma";
import { getEventsWithTranslations } from "@/lib/events/get-event-with-translation";
import { getLocaleFromRequest } from "@/lib/i18n/get-locale-server";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover and join events in your community.",
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

export default async function EventsPage() {
  const locale = await getLocaleFromRequest();
  const eventsRaw = await prisma.event.findMany({
    include: { registrations: true },
    orderBy: { createdAt: "desc" },
  });
  const withTranslations = await getEventsWithTranslations(eventsRaw, locale);
  const events = withTranslations.map(toApiEvent);

  return (
    <main className="flex flex-1 flex-col pt-20">
      <EventsHeroSection />
      <EventsContentSection events={events} />
      <Footer />
    </main>
  );
}
