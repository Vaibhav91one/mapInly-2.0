import { notFound } from "next/navigation";
import {
  EventHeroSection,
  EventImageSection,
  EventDetailsSection,
} from "@/components/events/event";
import { Footer } from "@/components/layout";
import { prisma } from "@/lib/prisma";
import { getEventWithTranslation } from "@/lib/events/get-event-with-translation";
import { getLocaleFromRequest } from "@/lib/i18n/get-locale-server";
import { isEventPast } from "@/lib/event-date";
import { createClient } from "@/utils/supabase/server";

function avatarPlaceholder(id: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(id)}/80/80`;
}

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const locale = await getLocaleFromRequest();
  const eventRaw = await prisma.event.findUnique({
    where: { slug },
    include: { registrations: true },
  });

  if (!eventRaw) {
    notFound();
  }

  const eventWithTx = await getEventWithTranslation(eventRaw, locale);
  const event = {
    ...eventRaw,
    title: eventWithTx.title,
    tagline: eventWithTx.tagline,
    shortDescription: eventWithTx.shortDescription,
    registrations: eventRaw.registrations.map((r) => r.userId),
    createdAt: eventRaw.createdAt.toISOString(),
  };
  const isPast = isEventPast({ date: event.date, timeRange: event.timeRange });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const hasSignedUp =
    !!user &&
    ((event.registrations ?? []).includes(user.id) ||
      event.createdBy === user.id);

  const organizerId = event.createdBy;
  const joinerIds = event.registrations ?? [];
  const profileIds = [organizerId, ...joinerIds].filter(Boolean);
  const profiles = await prisma.profile.findMany({
    where: { id: { in: profileIds } },
    select: { id: true, displayName: true, avatarUrl: true },
  });
  const profileMap = Object.fromEntries(
    profiles.map((p) => [p.id, { id: p.id, displayName: p.displayName, avatarUrl: p.avatarUrl }])
  );

  const organizerProfile = profileMap[organizerId];
  const organizer = organizerProfile
    ? {
        image: organizerProfile.avatarUrl ?? avatarPlaceholder(organizerId),
        name: organizerProfile.displayName,
      }
    : organizerId
      ? {
          image: avatarPlaceholder(organizerId),
          name: "Organizer",
        }
      : undefined;

  const joiners = joinerIds.map((id) => {
    const p = profileMap[id];
    return {
      image: p?.avatarUrl ?? avatarPlaceholder(id),
    };
  });

  return (
    <main className="flex min-h-screen flex-col pt-20">
      <EventHeroSection
        title={event.title}
        date={event.date}
        location={event.location as { displayName: string; latitude: number; longitude: number; mapsUrl?: string }}
        organizer={organizer}
        joiners={joiners}
      />
      <EventImageSection src={event.image} alt={event.title} />
      <EventDetailsSection
        headline={event.tagline}
        description={event.shortDescription}
        hasSignedUp={hasSignedUp}
        isPast={isPast}
        eventId={event.id}
        eventSlug={slug}
        eventTitle={event.title}
        eventImage={event.image}
      />
      <Footer />
    </main>
  );
}
