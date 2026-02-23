import { ForumsHeroSection, ForumsContentSection } from "@/components/forums";
import { Footer } from "@/components/layout";
import { prisma } from "@/lib/prisma";
import { getForumsWithTranslations } from "@/lib/forums/get-forum-with-translation";
import { getLocaleFromRequest } from "@/lib/i18n/get-locale-server";
import type { Forum } from "@/types/forum";

export const dynamic = "force-dynamic";

export default async function ForumsPage() {
  const locale = await getLocaleFromRequest();
  const forumsRaw = await prisma.forum.findMany({
    orderBy: { createdAt: "desc" },
  });
  const withTranslations = await getForumsWithTranslations(forumsRaw, locale);
  const forums: Forum[] = withTranslations.map((f) => ({
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
    sourceLocale: f.sourceLocale ?? "en",
  }));

  return (
    <main className="flex flex-1 flex-col pt-20">
      <ForumsHeroSection />
      <ForumsContentSection forums={forums} />
      <Footer />
    </main>
  );
}
