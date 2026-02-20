import { DashboardHeroSection, DashboardContentSection } from "@/components/dashboard";
import { Footer } from "@/components/layout";

export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col bg-black pt-20 text-white">
      <DashboardHeroSection />
      <DashboardContentSection />
      <Footer />
    </main>
  );
}
