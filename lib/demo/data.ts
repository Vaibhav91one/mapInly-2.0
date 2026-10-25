import raw from "@/data/demo.json";
import type { Event } from "@/types/event";
import type { Forum } from "@/types/forum";

/** The fixed "logged-in" visitor: the demo has no auth. */
export const DEMO_USER_ID = "demo-user";

export type Translations<T> = Partial<Record<string, T>>;
export type StoredEvent = Event & { translations: Translations<Pick<Event, "title" | "tagline" | "shortDescription">> };
export type StoredForum = Forum & { translations: Translations<Pick<Forum, "title" | "tagline" | "shortDescription">> };
export type DemoUser = { id: string; displayName: string; avatarUrl: string | null };
export type StoredComment = {
  id: string;
  forumSlug: string;
  parentId: string | null;
  authorId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  translations: Translations<{ content: string }>;
};
export type StoredMessage = {
  id: string;
  eventSlug: string;
  userId: string;
  content: string;
  createdAt: string;
  translations: Translations<{ content: string }>;
};

const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, "0");

/** Seed dates are offsets from today, so the demo never goes stale (events stay upcoming / past as designed). */
function eventDate(startOffsetDays: number, durationDays: number, today: Date): string {
  const start = new Date(today.getTime() + startOffsetDays * DAY);
  const end = new Date(start.getTime() + durationDays * DAY);
  const mm = pad(start.getMonth() + 1);
  const single = `${pad(start.getDate())}.${mm}.${start.getFullYear()}`;
  // the app's range format ("01 – 05.12.2025") has one month, so a range crossing months falls back to its first day
  if (durationDays <= 0 || end.getMonth() !== start.getMonth()) return single;
  return `${pad(start.getDate())} – ${pad(end.getDate())}.${mm}.${start.getFullYear()}`;
}

export function loadDemo() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const iso = (offsetDays: number) => new Date(today.getTime() + offsetDays * DAY).toISOString();

  const events: StoredEvent[] = raw.events.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    tagline: e.tagline,
    shortDescription: e.shortDescription,
    date: eventDate(e.startOffsetDays, e.durationDays, today),
    timeRange: e.timeRange,
    location: e.location,
    tags: e.tags,
    image: e.image,
    imageOverlay: e.imageOverlay ?? undefined,
    sourceLocale: e.sourceLocale,
    createdBy: e.createdBy,
    createdAt: iso(e.createdOffsetDays),
    registrations: e.registrations,
    translations: e.translations,
  }));
  const forums: StoredForum[] = raw.forums.map((f) => ({
    id: f.id,
    slug: f.slug,
    title: f.title,
    tagline: f.tagline,
    shortDescription: f.shortDescription,
    status: f.status as Forum["status"],
    tags: f.tags,
    image: f.image ?? undefined,
    sourceLocale: f.sourceLocale,
    createdBy: f.createdBy,
    createdAt: iso(f.createdOffsetDays),
    translations: f.translations,
  }));
  const comments: StoredComment[] = raw.comments.map((c) => ({
    id: c.id,
    forumSlug: c.forumSlug,
    parentId: c.parentId,
    authorId: c.authorId,
    content: c.content,
    upvotes: c.upvotes,
    downvotes: c.downvotes,
    createdAt: new Date(now.getTime() - c.hoursAgo * 3_600_000).toISOString(),
    translations: c.translations,
  }));
  const messages: StoredMessage[] = raw.messages.map((m) => ({
    id: m.id,
    eventSlug: m.eventSlug,
    userId: m.userId,
    content: m.content,
    createdAt: new Date(now.getTime() - m.minutesAgo * 60_000).toISOString(),
    translations: m.translations,
  }));
  const users: DemoUser[] = raw.users.map((u) => ({
    ...u,
    avatarUrl: u.avatarUrl ?? `https://picsum.photos/seed/${encodeURIComponent(u.id)}/80/80`,
  }));
  return { users, events, forums, comments, messages };
}
