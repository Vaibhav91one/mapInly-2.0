import { prisma } from "@/lib/prisma";

type ForumRow = {
  id: string;
  title: string;
  tagline: string;
  shortDescription: string;
  sourceLocale?: string;
  [key: string]: unknown;
};

export type ForumWithTranslation = ForumRow & {
  title: string;
  tagline: string;
  shortDescription: string;
};

export function mergeForumWithTranslation(
  forum: ForumRow,
  translation: { title: string; tagline: string; shortDescription: string } | null
): ForumWithTranslation {
  if (!translation) {
    return { ...forum };
  }
  return {
    ...forum,
    title: translation.title,
    tagline: translation.tagline,
    shortDescription: translation.shortDescription,
  };
}

export async function getForumWithTranslation(
  forum: ForumRow,
  locale: string
): Promise<ForumWithTranslation> {
  const sourceLocale = forum.sourceLocale ?? "en";
  if (locale === sourceLocale) {
    return { ...forum };
  }
  try {
    const tx = await prisma.forumTranslation.findUnique({
      where: { forumId_locale: { forumId: forum.id, locale } },
    });
    return mergeForumWithTranslation(forum, tx);
  } catch {
    return { ...forum };
  }
}

export async function getForumsWithTranslations<T extends ForumRow>(
  forums: T[],
  locale: string
): Promise<(T & { title: string; tagline: string; shortDescription: string })[]> {
  if (forums.length === 0) {
    return forums as (T & { title: string; tagline: string; shortDescription: string })[];
  }
  const needTranslations = forums.filter((f) => (f.sourceLocale ?? "en") !== locale);
  if (needTranslations.length === 0) {
    return forums as (T & { title: string; tagline: string; shortDescription: string })[];
  }
  const ids = needTranslations.map((f) => f.id);
  let translations: { forumId: string; title: string; tagline: string; shortDescription: string }[] = [];
  try {
    translations = await prisma.forumTranslation.findMany({
      where: { forumId: { in: ids }, locale },
    });
  } catch {
    // Table may not exist yet (migration not applied) - fall back to originals
    return forums as (T & { title: string; tagline: string; shortDescription: string })[];
  }
  const byForum = Object.fromEntries(
    translations.map((t) => [t.forumId, t])
  );
  return forums.map((f) => {
    if ((f.sourceLocale ?? "en") === locale) {
      return f as T & {
        title: string;
        tagline: string;
        shortDescription: string;
      };
    }
    const tx = byForum[f.id];
    return mergeForumWithTranslation(f, tx) as T & {
      title: string;
      tagline: string;
      shortDescription: string;
    };
  });
}
