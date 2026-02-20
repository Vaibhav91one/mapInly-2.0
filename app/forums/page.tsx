import { ForumsHeroSection, ForumsContentSection } from "@/components/forums";
import { Footer } from "@/components/layout";

export default function ForumsPage() {
  return (
    <main className="flex flex-1 flex-col pt-20">
      <ForumsHeroSection />
      <ForumsContentSection />
      <Footer />
    </main>
  );
}
