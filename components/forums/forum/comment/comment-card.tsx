"use client";

import Image from "next/image";
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Award,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
}

interface CommentCardProps {
  comment: CommentData;
  onReply?: (commentId: string) => void;
  onVote?: (commentId: string, direction: "up" | "down") => void;
  onAward?: (commentId: string) => void;
  onShare?: (commentId: string) => void;
  className?: string;
}

export function CommentCard({
  comment,
  onReply,
  onVote,
  onAward,
  onShare,
  className,
}: CommentCardProps) {
  const score = comment.upvotes - (comment.downvotes ?? 0);

  return (
    <article
      className={cn(
        "flex gap-4 rounded-lg border border-secondary/50 bg-secondary/30 p-4",
        className
      )}
    >
      {/* Avatar */}
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
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-background">{comment.author.name}</span>
          {comment.author.role && (
            <span className="rounded bg-primary/30 px-1.5 py-0.5 text-xs font-medium text-primary">
              {comment.author.role}
            </span>
          )}
          <span className="text-sm text-background/60">{comment.timestamp}</span>
        </div>

        {/* Content */}
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-background/90">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-background/70 hover:bg-secondary hover:text-background"
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
              className="size-8 text-background/70 hover:bg-secondary hover:text-background"
              onClick={() => onVote?.(comment.id, "down")}
              aria-label="Downvote"
            >
              <ArrowDown className="size-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-background/70 hover:bg-secondary hover:text-background"
            onClick={() => onReply?.(comment.id)}
          >
            <MessageCircle className="size-4" />
            Reply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-background/70 hover:bg-secondary hover:text-background"
            onClick={() => onAward?.(comment.id)}
          >
            <Award className="size-4" />
            Award
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-background/70 hover:bg-secondary hover:text-background"
            onClick={() => onShare?.(comment.id)}
          >
            <Share2 className="size-4" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-background/70 hover:bg-secondary hover:text-background"
                aria-label="More options"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Save</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
}
