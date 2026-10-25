"use client";

import { notFound } from "next/navigation";
import {
  EventHeroSection,
  EventImageSection,
  EventDetailsSection,
} from "@/components/events/event";
import { Footer } from "@/components/layout";
import { isEventPast } from "@/lib/event-date";
import { useLocale, localize } from "@/lib/demo/localize";
import { useAuthStore } from "@/stores/auth-store";
import { useDataStore } from "@/stores/data-store";

function avatarPlaceholder(id: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(id)}/80/80`;
}

export function EventView({ slug }: { slug: string }) {
  const locale = useLocale();
  const user = useAuthStore((s) => s.user);
  const users = useDataStore((s) => s.users);
  const stored = useDataStore((s) => s.events.find((e) => e.slug === slug));
  if (!stored) notFound();

  const event = localize(stored, locale);
  const registrations = event.registrations ?? [];
  const hasSignedUp = !!user && (registrations.includes(user.id) || event.createdBy === user.id);
  const person = (id: string) => users.find((u) => u.id === id);

  const organizerProfile = person(event.createdBy);
  const organizer = {
    image: organizerProfile?.avatarUrl ?? avatarPlaceholder(event.createdBy),
    name: organizerProfile?.displayName ?? "Organizer",
  };
  const joiners = registrations.map((id) => ({ image: person(id)?.avatarUrl ?? avatarPlaceholder(id) }));

  return (
    <main className="flex min-h-screen flex-col pt-20">
      <EventHeroSection
        title={event.title}
        date={event.date}
        location={event.location}
        organizer={organizer}
        joiners={joiners}
      />
      <EventImageSection src={event.image} alt={event.title} />
      <EventDetailsSection
        headline={event.tagline}
        description={event.shortDescription}
        hasSignedUp={hasSignedUp}
        isPast={isEventPast({ date: event.date, timeRange: event.timeRange })}
        eventId={event.id}
        eventSlug={slug}
        eventTitle={event.title}
        eventImage={event.image}
      />
      <Footer />
    </main>
  );
}
