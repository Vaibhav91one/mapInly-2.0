import type { Event } from "@/types/event";

// Landing page has no backend: static seed so "Upcoming events" is never empty.
const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
};

const seed = (
  i: number,
  offset: number,
  title: string,
  shortDescription: string,
  place: string,
  colors: string,
  timeRange: string,
): Event => ({
  id: `seed-${i}`,
  slug: `seed-${i}`,
  title,
  tagline: title,
  shortDescription,
  date: day(offset),
  timeRange,
  location: { displayName: place, latitude: 0, longitude: 0 },
  tags: [],
  image: `gradient:${colors}`,
  createdBy: "mapinly",
  createdAt: new Date(0).toISOString(),
});

export const SEED_EVENTS: Event[] = [
  seed(1, 7, "Language Exchange Night", "Practice a new language over coffee with locals and travellers.", "Lugano, Switzerland", "#b8cd65,#6200ff,#e2a3ff,#ff99fd", "6:00 PM - 8:00 PM"),
  seed(2, 14, "Lakeside Community Picnic", "Bring a dish from home, meet your neighbours, share stories.", "Lake Geneva, Switzerland", "#e0eaff,#241d9a,#f75092,#9f50d3", "12:00 PM - 4:00 PM"),
  seed(3, 21, "Local Makers Market", "Handmade goods, street food and live music from your community.", "Zurich, Switzerland", "#ffd29c,#ff4d6d,#7b2cbf,#3a0ca3", "10:00 AM - 5:00 PM"),
  seed(4, 30, "Alpine Sunrise Hike", "An easy guided hike to catch the sunrise with a friendly group.", "Ticino, Switzerland", "#9ef0d4,#0077b6,#90e0ef,#caf0f8", "5:30 AM - 10:00 AM"),
  seed(5, 45, "Culture Hub Open Mic", "Poetry, music and stories in every language. Everyone welcome.", "Bern, Switzerland", "#fcd34d,#f97316,#dc2626,#7c3aed", "7:00 PM - 10:00 PM"),
];
