import { prisma } from "@/lib/prisma";

type CommentRow = {
  id: string;
  content: string;
  [key: string]: unknown;
};

export type CommentWithTranslation = CommentRow & {
  content: string;
};

export function mergeCommentWithTranslation(
  comment: CommentRow,
  translation: { content: string } | null
): CommentWithTranslation {
  if (!translation) {
    return { ...comment };
  }
  return {
    ...comment,
    content: translation.content,
  };
}

export async function getCommentsWithTranslations<T extends CommentRow>(
  comments: T[],
  locale: string
): Promise<(T & { content: string })[]> {
  if (comments.length === 0) {
    return comments as (T & { content: string })[];
  }
  const ids = comments.map((c) => c.id);
  let translations: { commentId: string; content: string }[] = [];
  try {
    translations = await prisma.commentTranslation.findMany({
      where: { commentId: { in: ids }, locale },
    });
  } catch {
    return comments as (T & { content: string })[];
  }
  const byComment = Object.fromEntries(
    translations.map((t) => [t.commentId, t])
  );
  return comments.map((c) => {
    const tx = byComment[c.id];
    return mergeCommentWithTranslation(c, tx) as T & { content: string };
  });
}
