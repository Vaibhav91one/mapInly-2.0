import type { Metadata } from "next";
import { EventView } from "@/components/events/event-view";
import { loadDemo } from "@/lib/demo/data";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = loadDemo().events.find((e) => e.slug === slug);
  if (!event) return {};
  const description = event.tagline || event.shortDescription || undefined;
  const image = event.image.startsWith("http") ? event.image : undefined;
  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  return <EventView slug={slug} />;
}
