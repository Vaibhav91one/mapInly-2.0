import type { Metadata } from "next";
import { ForumView } from "@/components/forums/forum-view";
import { loadDemo } from "@/lib/demo/data";

interface ForumPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ForumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const forum = loadDemo().forums.find((f) => f.slug === slug);
  if (!forum) return {};
  const description = forum.tagline || forum.shortDescription || undefined;
  return {
    title: forum.title,
    description,
    openGraph: { title: forum.title, description },
  };
}

export default async function ForumPage({ params }: ForumPageProps) {
  const { slug } = await params;
  return <ForumView slug={slug} />;
}
