import {
  HeroSection,
  TextSection,
  ConnectingSection,
  ValuesSection,
  CarouselSection,
  VelocityScrollSection,
} from "@/components/home";
import { Footer } from "@/components/layout";
import { prisma } from "@/lib/prisma";
import { getEventsWithTranslations } from "@/lib/events/get-event-with-translation";
import { getLocaleFromRequest } from "@/lib/i18n/get-locale-server";
import { parseEventDate } from "@/lib/parse-event-date";

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
    location: e.location as {
      displayName: string;
      latitude: number;
      longitude: number;
      mapsUrl?: string;
    },
    tags: e.tags,
    image: e.image,
    imageOverlay: e.imageOverlay ?? undefined,
    createdBy: e.createdBy,
    createdAt: e.createdAt.toISOString(),
    registrations: e.registrations.map((r) => r.userId),
    sourceLocale: e.sourceLocale ?? "en",
  };
}

export default async function Home() {
  const locale = await getLocaleFromRequest();
  const eventsRaw = await prisma.event.findMany({
    include: { registrations: true },
  });
  const withTranslations = await getEventsWithTranslations(eventsRaw, locale);
  const all = withTranslations.map(toApiEvent);
  const now = Date.now();
  const upcomingEvents = all
    .filter((e) => (parseEventDate(e.date)?.getTime() ?? 0) >= now)
    .sort((a, b) => {
      const da = parseEventDate(a.date)?.getTime() ?? 0;
      const db = parseEventDate(b.date)?.getTime() ?? 0;
      return da - db;
    });

  return (
    <main className="flex-1 flex flex-col pt-20">
      <HeroSection />
      <TextSection />
      <ConnectingSection />
      <ValuesSection />
      <CarouselSection events={upcomingEvents} />
      <VelocityScrollSection />
      <Footer />
    </main>
  );
}
