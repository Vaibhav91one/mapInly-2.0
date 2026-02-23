"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import {
  CommentInput,
  CommentControls,
  CommentCard,
  type CommentData,
  type SortOption,
} from "./comment";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";
import { keys } from "@/lib/i18n/keys";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-cookie";

type ApiComment = {
  id: string;
  forumId: string;
  parentId: string | null;
  authorId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  author: { name: string; avatarUrl: string };
  timestamp: string;
};

function buildCommentTree(flat: ApiComment[]): CommentData[] {
  const byParent = new Map<string | null, ApiComment[]>();
  flat.forEach((c) => {
    const key = c.parentId;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(c);
  });
  function children(parentId: string | null): CommentData[] {
    return (byParent.get(parentId) ?? [])
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .map((c) => ({
        id: c.id,
        author: c.author,
        timestamp: c.timestamp,
        content: c.content,
        upvotes: c.upvotes,
        downvotes: c.downvotes,
        createdAt: c.createdAt,
        replies: children(c.id),
      }));
  }
  return children(null);
}

function sortTopLevelComments(tree: CommentData[]): CommentData[] {
  return [...tree].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
  );
}

interface ForumCommentsSectionProps {
  forumId?: string;
  isActive?: boolean;
  className?: string;
}

export function ForumCommentsSection({
  forumId,
  isActive = true,
  className,
}: ForumCommentsSectionProps) {
  const { t, i18n } = useTranslation();
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const locale =
    (SUPPORTED_LOCALES as readonly string[]).includes(
      (i18n.language?.split("-")[0] ?? "en") as string
    )
      ? (i18n.language?.split("-")[0] ?? "en")
      : "en";

  const fetchComments = useCallback(async () => {
    if (!forumId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/forums/${forumId}/comments?locale=${encodeURIComponent(locale)}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = (await res.json()) as ApiComment[];
        setComments(data);
      }
    } finally {
      setLoading(false);
    }
  }, [forumId, locale]);

  useEffect(() => {
    fetchComments();
  }, [locale, fetchComments]);

  const tree = useMemo(() => buildCommentTree(comments), [comments]);
  const sortedTree = useMemo(
    () => sortTopLevelComments(tree),
    [tree]
  );

  const addEnrichedComment = useCallback((enriched: ApiComment) => {
    setComments((prev) => [...prev, enriched]);
  }, []);

  const applyVoteDelta = useCallback(
    (commentId: string, direction: "up" | "down", delta: number) => {
      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;
          if (direction === "up") return { ...c, upvotes: c.upvotes + delta };
          return { ...c, downvotes: (c.downvotes ?? 0) + delta };
        })
      );
    },
    []
  );

  const handleVote = useCallback(
    async (commentId: string, direction: "up" | "down") => {
      if (!forumId) return;
      applyVoteDelta(commentId, direction, 1);
      const res = await fetch(
        `/api/forums/${forumId}/comments/${commentId}/vote`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ direction }),
        }
      );
      if (!res.ok) {
        applyVoteDelta(commentId, direction, -1);
      }
    },
    [forumId, applyVoteDelta]
  );

  const handleSubmitComment = useCallback(
    async (content: string) => {
      if (!forumId || submitting) return;
      setSubmitting(true);
      try {
        const res = await fetch(`/api/forums/${forumId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content, sourceLocale: locale }),
        });
        if (res.ok) {
          const enriched = (await res.json()) as ApiComment;
          addEnrichedComment(enriched);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [forumId, locale, addEnrichedComment, submitting]
  );

  const handleSubmitReply = useCallback(
    async (parentId: string, content: string) => {
      if (!forumId || submitting) return;
      setReplyingToId(null);
      setSubmitting(true);
      try {
        const res = await fetch(`/api/forums/${forumId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content, parentId, sourceLocale: locale }),
        });
        if (res.ok) {
          const enriched = (await res.json()) as ApiComment;
          addEnrichedComment(enriched);
        } else {
          setReplyingToId(parentId);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [forumId, locale, addEnrichedComment, submitting]
  );

  return (
    <section
      className={cn(sectionClasses, "bg-foreground rounded-none", className)}
    >
      <div
        className={cn(
          sectionInnerClasses,
          "flex flex-col gap-8"
        )}
      >
        <h2 className="text-2xl font-regular tracking-tight text-background md:text-3xl">
          {t(keys.forumComments.title)}
        </h2>

        {isActive && (
          <div className="flex flex-col gap-1 w-full">
            <CommentInput
              placeholder={t(keys.forumComments.joinConversation)}
              onSubmit={handleSubmitComment}
              disabled={submitting}
            />
            {submitting && (
              <p className="text-xs text-background/60">
                {t(keys.forumComments.posting)}
                <span className="inline-block animate-pulse">...</span>
              </p>
            )}
          </div>
        )}

        <CommentControls
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {loading ? (
          <p className="text-background/60">{t(keys.forumComments.loadingComments)}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedTree.length === 0 ? (
              <p className="text-background/60">{t(keys.forumComments.noCommentsFound)}</p>
            ) : (
              <>
                {sortedTree.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <CommentCard
                      comment={comment}
                      replyingToId={replyingToId}
                      onReply={(id) => setReplyingToId((prev) => (prev === id ? null : id))}
                      onVote={handleVote}
                      onSubmitReply={handleSubmitReply}
                      onCancelReply={() => setReplyingToId(null)}
                    />
                  </motion.div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
