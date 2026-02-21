import { parse, isBefore } from "date-fns";

export interface EventDateInput {
  date: string;
  timeRange: string;
}

/**
 * Parses event date string. Supports:
 * - "DD.MM.YYYY" (e.g. "15.03.2025")
 * - "DD – DD.MM.YYYY" (e.g. "01 – 05.12.2025") – uses end date
 */
function parseEventDate(dateStr: string): { day: number; month: number; year: number } | null {
  const trimmed = dateStr.trim();
  const rangeMatch = trimmed.match(/[-\u2013]\s*(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  const singleMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  const match = rangeMatch ?? singleMatch;
  if (!match) return null;
  const [, day, month, year] = match;
  return {
    day: parseInt(day!, 10),
    month: parseInt(month!, 10) - 1,
    year: parseInt(year!, 10),
  };
}

/**
 * Parses time range string. Uses end time if range (e.g. "6:00 PM - 8:00 PM"),
 * or single time (e.g. "9:00 AM").
 */
function parseEventTime(timeRange: string): { hours: number; minutes: number } | null {
  const trimmed = timeRange.trim();
  const dashIdx = trimmed.indexOf(" - ");
  const timeStr = dashIdx >= 0 ? trimmed.slice(dashIdx + 3).trim() : trimmed;
  try {
    const parsed = parse(timeStr, "h:mm a", new Date());
    return { hours: parsed.getHours(), minutes: parsed.getMinutes() };
  } catch {
    try {
      const parsed = parse(timeStr, "h a", new Date());
      return { hours: parsed.getHours(), minutes: 0 };
    } catch {
      return null;
    }
  }
}

/**
 * Returns true if the event has ended (end date + time is in the past).
 */
export function isEventPast(event: EventDateInput): boolean {
  const dateParts = parseEventDate(event.date);
  const timeParts = parseEventTime(event.timeRange);
  if (!dateParts || !timeParts) return false;
  const endDate = new Date(
    dateParts.year,
    dateParts.month,
    dateParts.day,
    timeParts.hours,
    timeParts.minutes
  );
  return isBefore(endDate, new Date());
}
