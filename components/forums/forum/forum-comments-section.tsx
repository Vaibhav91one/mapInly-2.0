"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useLocale } from "@/lib/demo/localize";
import { useDataStore } from "@/stores/data-store";

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

function formatTimestamp(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (mins < 60) return `${Math.max(mins, 0)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

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
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  // seeded times are relative to "now": render them after mount so server and client agree
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const locale = useLocale();
  const storedComments = useDataStore((s) => s.comments);
  const users = useDataStore((s) => s.users);
  const addComment = useDataStore((s) => s.addComment);
  const voteComment = useDataStore((s) => s.voteComment);

  const comments = useMemo<ApiComment[]>(() => {
    if (!ready || !forumId) return [];
    return storedComments
      .filter((c) => c.forumSlug === forumId)
      .map((c) => {
        const author = users.find((u) => u.id === c.authorId);
        return {
          id: c.id,
          forumId: c.forumSlug,
          parentId: c.parentId,
          authorId: c.authorId,
          content: c.translations[locale]?.content ?? c.content,
          upvotes: c.upvotes,
          downvotes: c.downvotes,
          createdAt: c.createdAt,
          author: { name: author?.displayName ?? "Anonymous", avatarUrl: author?.avatarUrl ?? "" },
          timestamp: formatTimestamp(c.createdAt),
        };
      });
  }, [ready, forumId, storedComments, users, locale]);
  const loading = !ready;

  const tree = useMemo(() => buildCommentTree(comments), [comments]);
  const sortedTree = useMemo(() => sortTopLevelComments(tree), [tree]);

  const handleVote = (commentId: string, direction: "up" | "down") => voteComment(commentId, direction);

  const handleSubmitComment = (content: string) => {
    if (forumId) addComment(forumId, content, null);
  };

  const handleSubmitReply = (parentId: string, content: string) => {
    if (!forumId) return;
    addComment(forumId, content, parentId);
    setReplyingToId(null);
  };

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
            />
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
