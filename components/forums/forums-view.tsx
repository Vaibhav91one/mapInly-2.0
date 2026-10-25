"use client";

import { useMemo } from "react";
import { ForumsHeroSection, ForumsContentSection } from "@/components/forums";
import { Footer } from "@/components/layout";
import { useLocalizedForums } from "@/lib/demo/localize";

export function ForumsView() {
  const forums = useLocalizedForums();
  const newestFirst = useMemo(
    () => [...forums].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [forums]
  );
  return (
    <main className="flex flex-1 flex-col pt-20">
      <ForumsHeroSection />
      <ForumsContentSection forums={newestFirst} />
      <Footer />
    </main>
  );
}
