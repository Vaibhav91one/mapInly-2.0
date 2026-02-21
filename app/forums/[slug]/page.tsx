import { notFound } from "next/navigation";
import {
  ForumHeroSection,
  ForumDetailsSection,
  ForumCommentsSection,
} from "@/components/forums/forum";
import { EventImageSection } from "@/components/events/event";
import { Footer } from "@/components/layout";
import { prisma } from "@/lib/prisma";

interface ForumPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ForumPage({ params }: ForumPageProps) {
  const { slug } = await params;
  const forum = await prisma.forum.findUnique({ where: { slug } });

  if (!forum) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col pt-20">
      <ForumHeroSection title={forum.title} />
      <EventImageSection
        src={forum.image ?? "https://picsum.photos/seed/forum/1920/1080"}
        alt={forum.title}
      />
      <ForumDetailsSection
        headline={forum.tagline}
        description={forum.shortDescription}
      />
      <ForumCommentsSection forumId={forum.slug} isActive={forum.status === "active"} />
      <Footer />
    </main>
  );
}
