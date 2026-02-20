import { EventsHeroSection, EventsContentSection } from "@/components/events";
import { Footer } from "@/components/layout";

export default function EventsPage() {
  return (
    <main className="flex flex-1 flex-col pt-20">
      <EventsHeroSection />
      <EventsContentSection />
      <Footer />
    </main>
  );
}
