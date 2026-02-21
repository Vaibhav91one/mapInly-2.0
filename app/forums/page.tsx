import { ForumsHeroSection, ForumsContentSection } from "@/components/forums";
import { Footer } from "@/components/layout";
import { prisma } from "@/lib/prisma";
import type { Forum } from "@/types/forum";

export const dynamic = "force-dynamic";

export default async function ForumsPage() {
  const forumsRaw = await prisma.forum.findMany({
    orderBy: { createdAt: "desc" },
  });
  const forums: Forum[] = forumsRaw.map((f) => ({
    id: f.id,
    slug: f.slug,
    title: f.title,
    tagline: f.tagline,
    shortDescription: f.shortDescription,
    status: f.status as "active" | "closed",
    tags: f.tags,
    image: f.image ?? undefined,
    createdBy: f.createdBy,
    createdAt: f.createdAt.toISOString(),
  }));

  return (
    <main className="flex flex-1 flex-col pt-20">
      <ForumsHeroSection />
      <ForumsContentSection forums={forums} />
      <Footer />
    </main>
  );
}
