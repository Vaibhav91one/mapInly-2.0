import {
  HeroSection,
  TextSection,
  ConnectingSection,
  ValuesSection,
  CarouselSection,
  VelocityScrollSection,
} from "@/components/home";
import { Footer } from "@/components/layout";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col pt-20">
      <HeroSection />
      <TextSection />
      <ConnectingSection />
      <ValuesSection />
      <CarouselSection />
      <VelocityScrollSection />
      <Footer />
    </main>
  );
}
