import {
  HeroSection,
  TextSection,
  ConnectingSection,
  ValuesSection,
  CarouselSection,
  VelocityScrollSection,
} from "@/components/home";
import { Footer } from "@/components/layout";
import { SEED_EVENTS } from "@/lib/seed-events";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover events and community forums. Join in your language with automatic translations.",
};

export default function Home() {
  return (
    <main className="flex-1 flex flex-col pt-20">
      <HeroSection />
      <TextSection />
      <ConnectingSection />
      <ValuesSection />
      <CarouselSection events={SEED_EVENTS} />
      <VelocityScrollSection />
      <Footer />
    </main>
  );
}
