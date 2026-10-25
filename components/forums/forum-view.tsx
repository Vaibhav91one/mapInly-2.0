"use client";

import { notFound } from "next/navigation";
import {
  ForumHeroSection,
  ForumDetailsSection,
  ForumCommentsSection,
} from "@/components/forums/forum";
import { EventImageSection } from "@/components/events/event";
import { Footer } from "@/components/layout";
import { useLocale, localize } from "@/lib/demo/localize";
import { useDataStore } from "@/stores/data-store";

export function ForumView({ slug }: { slug: string }) {
  const locale = useLocale();
  const stored = useDataStore((s) => s.forums.find((f) => f.slug === slug));
  if (!stored) notFound();

  const forum = localize(stored, locale);
  return (
    <main className="flex min-h-screen flex-col pt-20">
      <ForumHeroSection title={forum.title} />
      <EventImageSection
        src={forum.image ?? "https://picsum.photos/seed/forum/1920/1080"}
        alt={forum.title}
      />
      <ForumDetailsSection headline={forum.tagline} description={forum.shortDescription} />
      <ForumCommentsSection forumId={forum.slug} isActive={forum.status === "active"} />
      <Footer />
    </main>
  );
}
