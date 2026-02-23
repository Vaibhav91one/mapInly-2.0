import { prisma } from "@/lib/prisma";

type EventRow = {
  id: string;
  title: string;
  tagline: string;
  shortDescription: string;
  sourceLocale?: string;
  [key: string]: unknown;
};

export type EventWithTranslation = EventRow & {
  title: string;
  tagline: string;
  shortDescription: string;
};

export function mergeEventWithTranslation(
  event: EventRow,
  translation: { title: string; tagline: string; shortDescription: string } | null
): EventWithTranslation {
  if (!translation) {
    return { ...event };
  }
  return {
    ...event,
    title: translation.title,
    tagline: translation.tagline,
    shortDescription: translation.shortDescription,
  };
}

export async function getEventWithTranslation(
  event: EventRow,
  locale: string
): Promise<EventWithTranslation> {
  const sourceLocale = event.sourceLocale ?? "en";
  if (locale === sourceLocale) {
    return { ...event };
  }
  try {
    const tx = await prisma.eventTranslation.findUnique({
    where: { eventId_locale: { eventId: event.id, locale } },
    });
    return mergeEventWithTranslation(event, tx);
  } catch {
    return { ...event };
  }
}

export async function getEventsWithTranslations<T extends EventRow>(
  events: T[],
  locale: string
): Promise<(T & { title: string; tagline: string; shortDescription: string })[]> {
  if (events.length === 0) {
    return events as (T & { title: string; tagline: string; shortDescription: string })[];
  }
  const needTranslations = events.filter((e) => (e.sourceLocale ?? "en") !== locale);
  if (needTranslations.length === 0) {
    return events as (T & { title: string; tagline: string; shortDescription: string })[];
  }
  const ids = needTranslations.map((e) => e.id);
  let translations: { eventId: string; title: string; tagline: string; shortDescription: string }[] = [];
  try {
    translations = await prisma.eventTranslation.findMany({
      where: { eventId: { in: ids }, locale },
    });
  } catch {
    // Table may not exist yet (migration not applied) - fall back to originals
    return events as (T & { title: string; tagline: string; shortDescription: string })[];
  }
  const byEvent = Object.fromEntries(
    translations.map((t) => [t.eventId, t])
  );
  return events.map((e) => {
    if ((e.sourceLocale ?? "en") === locale) {
      return e as T & {
        title: string;
        tagline: string;
        shortDescription: string;
      };
    }
    const tx = byEvent[e.id];
    return mergeEventWithTranslation(e, tx) as T & {
      title: string;
      tagline: string;
      shortDescription: string;
    };
  });
}
