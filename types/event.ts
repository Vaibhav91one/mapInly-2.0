export type EventStatus = "draft" | "published";

export interface EventLocation {
  displayName: string;
  latitude: number;
  longitude: number;
  /** Google Maps URL for directions */
  mapsUrl?: string;
}

export interface EventFormData {
  title: string;
  /** Primary one-line headline */
  tagline: string;
  /** Short paragraph description */
  shortDescription: string;
  /** Display date string (e.g. "01 – 05.12.2025" or "15.03.2025") */
  date: string;
  /** Time range (e.g. "6:00 PM - 8:00 PM") */
  timeRange: string;
  location: EventLocation;
  tags: string[];
  image: string;
  imageOverlay?: string;
}

/** Stored event with DB metadata */
export interface Event extends EventFormData {
  id: string;
  slug: string;
  createdBy: string;
  createdAt: string;
  registrations?: string[];
}
