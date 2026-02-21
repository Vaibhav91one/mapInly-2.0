import { format, parse } from "date-fns";
import type { Event } from "@/types/event";

/**
 * Parse event date string (e.g. "15.03.2025" or "01 – 05.12.2025") to Date.
 * Uses first day for ranges.
 */
export function parseEventDate(dateStr: string): Date | null {
  // "01 – 05.12.2025" -> take "01" and "12.2025"
  const rangeMatch = dateStr.match(/^(\d{1,2})\s*[–\-]\s*\d{1,2}\.(\d{1,2})\.(\d{4})$/);
  if (rangeMatch) {
    const [, day, month, year] = rangeMatch;
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  }
  // "15.03.2025"
  const singleMatch = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (singleMatch) {
    const [, day, month, year] = singleMatch;
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  }
  return null;
}

/**
 * Parses event date + timeRange into a single Date for form editing.
 * Uses start date and start time (or single time).
 */
export function eventToFormDateTime(event: Event): Date {
  const d = parseEventDate(event.date);
  const baseDate = d ?? new Date();
  const trimmed = event.timeRange.trim();
  const dashIdx = trimmed.indexOf(" - ");
  const timeStr = dashIdx >= 0 ? trimmed.slice(0, dashIdx).trim() : trimmed;
  try {
    const parsed = parse(timeStr, "h:mm a", baseDate);
    return parsed;
  } catch {
    try {
      return parse(timeStr, "h a", baseDate);
    } catch {
      return baseDate;
    }
  }
}

export interface UpcomingEventCardData {
  day: number;
  dayName: string;
  title: string;
  subtitle: string;
  timeRange: string;
  location?: string;
  locationUrl?: string;
  dateBlockColor: "primary" | "blue" | "purple";
  href: string;
}

const DATE_COLORS: ("primary" | "blue" | "purple")[] = ["primary", "blue", "purple"];

export function eventToUpcomingCard(event: Event, index: number): UpcomingEventCardData {
  const d = parseEventDate(event.date);
  const day = d ? d.getDate() : 1;
  const dayName = d ? format(d, "EEE") : "?";
  return {
    day,
    dayName,
    title: event.title,
    subtitle: event.shortDescription,
    timeRange: event.timeRange,
    location: event.location.displayName,
    locationUrl: event.location.mapsUrl,
    dateBlockColor: DATE_COLORS[index % DATE_COLORS.length],
    href: `/events/${event.slug}`,
  };
}
