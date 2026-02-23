import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ForumHeroSection,
  ForumDetailsSection,
  ForumCommentsSection,
} from "@/components/forums/forum";

export const dynamic = "force-dynamic";
import { EventImageSection } from "@/components/events/event";
import { Footer } from "@/components/layout";
import { prisma } from "@/lib/prisma";
import { getForumWithTranslation } from "@/lib/forums/get-forum-with-translation";
import { getLocaleFromRequest } from "@/lib/i18n/get-locale-server";

interface ForumPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ForumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocaleFromRequest();
  const forumRaw = await prisma.forum.findUnique({ where: { slug } });
  if (!forumRaw) return {};
  const forumWithTx = await getForumWithTranslation(forumRaw, locale);
  const title = forumWithTx.title;
  const description = forumWithTx.tagline || forumWithTx.shortDescription || undefined;
  const image = forumRaw.image?.startsWith("http") ? forumRaw.image : undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },
  };
}

export default async function ForumPage({ params }: ForumPageProps) {
  const { slug } = await params;
  const locale = await getLocaleFromRequest();
  const forumRaw = await prisma.forum.findUnique({ where: { slug } });

  if (!forumRaw) {
    notFound();
  }

  const forumWithTx = await getForumWithTranslation(forumRaw, locale);
  const forum = {
    ...forumRaw,
    title: forumWithTx.title,
    tagline: forumWithTx.tagline,
    shortDescription: forumWithTx.shortDescription,
  };

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
