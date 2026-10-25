import type { Metadata } from "next";
import { EventsView } from "@/components/events/events-view";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover and join events in your community.",
};

export default function EventsPage() {
  return <EventsView />;
}
