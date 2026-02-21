"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CommentInput } from "./comment-input";

export interface CommentAuthor {
  name: string;
  avatarUrl: string;
  role?: "MOD" | "ADMIN" | "USER";
}

export interface CommentData {
  id: string;
  author: CommentAuthor;
  timestamp: string;
  content: string;
  upvotes: number;
  downvotes?: number;
  replies?: CommentData[];
  createdAt?: string;
}

interface CommentCardProps {
  comment: CommentData;
  depth?: number;
  replyingToId?: string | null;
  onReply?: (commentId: string) => void;
  onVote?: (commentId: string, direction: "up" | "down") => void;
  onSubmitReply?: (parentId: string, content: string) => void;
  onCancelReply?: () => void;
  className?: string;
}

const REPLY_INDENT = 32;

export function CommentCard({
  comment,
  depth = 0,
  replyingToId,
  onReply,
  onVote,
  onSubmitReply,
  onCancelReply,
  className,
}: CommentCardProps) {
  const [expandedReplies, setExpandedReplies] = useState(false);
  const [replyDraft, setReplyDraft] = useState("");
  const score = comment.upvotes - (comment.downvotes ?? 0);
  const replies = comment.replies ?? [];
  const showTruncate = replies.length > 3;
  const displayedReplies = showTruncate && !expandedReplies
    ? replies.slice(0, 3)
    : replies;
  const hiddenCount = replies.length - 3;
  const isReplying = replyingToId === comment.id;
  const paddingLeft = depth > 0 ? depth * REPLY_INDENT : 0;

  const handleSubmitReply = () => {
    const trimmed = replyDraft.trim();
    if (trimmed && onSubmitReply) {
      onSubmitReply(comment.id, trimmed);
      setReplyDraft("");
      onCancelReply?.();
    }
  };

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-3", className)} style={{ paddingLeft: paddingLeft || undefined }}>
      <article
        className={cn(
          "flex gap-4 rounded-none border border-secondary/50 bg-secondary/30 p-4"
        )}
      >
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-primary/80">
          <Image
            src={comment.author.avatarUrl}
            alt=""
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-background">{comment.author.name}</span>
            {comment.author.role && (
              <span className="rounded-none bg-primary/30 px-1.5 py-0.5 text-xs font-medium text-primary">
                {comment.author.role}
              </span>
            )}
            <span className="text-sm text-background/60">{comment.timestamp}</span>
          </div>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-background/90">
            {comment.content}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-none text-background/70 hover:bg-green-500/20 hover:text-background"
                onClick={() => onVote?.(comment.id, "up")}
                aria-label="Upvote"
              >
                <ArrowUp className="size-4" />
              </Button>
              <span className="min-w-[1.5rem] text-center text-sm text-background/80">
                {score}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-none text-background/70 hover:bg-red-500/20 hover:text-background"
                onClick={() => onVote?.(comment.id, "down")}
                aria-label="Downvote"
              >
                <ArrowDown className="size-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-none text-background/70 hover:bg-secondary hover:text-background"
              onClick={() => onReply?.(comment.id)}
            >
              <MessageCircle className="size-4" />
              Reply
            </Button>
          </div>
        </div>
      </article>

      <AnimatePresence mode="wait">
        {isReplying && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex w-full min-w-0 flex-col gap-2"
            style={{ paddingLeft: (depth + 1) * REPLY_INDENT }}
          >
            <CommentInput
              placeholder="Write a reply..."
              value={replyDraft}
              onChange={setReplyDraft}
              onSubmit={handleSubmitReply}
              onCancel={onCancelReply}
              showCancel
            />
          </motion.div>
        )}
      </AnimatePresence>

      {displayedReplies.map((reply) => (
        <motion.div
          key={reply.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <CommentCard
            comment={reply}
            depth={depth + 1}
            replyingToId={replyingToId}
            onReply={onReply}
            onVote={onVote}
            onSubmitReply={onSubmitReply}
            onCancelReply={onCancelReply}
          />
        </motion.div>
      ))}

      {showTruncate && (
        <Button
          variant="ghost"
          size="sm"
          className="w-fit gap-1 rounded-none text-background/70 hover:bg-secondary hover:text-background"
          onClick={() => setExpandedReplies((prev) => !prev)}
          style={{ paddingLeft: (depth + 1) * REPLY_INDENT }}
        >
          {expandedReplies ? (
            <>
              <ChevronUp className="size-4" />
              Hide {hiddenCount} replies
            </>
          ) : (
            <>
              <ChevronDown className="size-4" />
              Show {hiddenCount} more replies
            </>
          )}
        </Button>
      )}
    </div>
  );
}
