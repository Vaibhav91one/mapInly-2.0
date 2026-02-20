"use client";

import { cn } from "@/lib/utils";

interface CommentInputProps {
  placeholder?: string;
  onSubmit?: (content: string) => void;
  disabled?: boolean;
  className?: string;
}

export function CommentInput({
  placeholder = "Join the conversation",
  onSubmit,
  disabled = false,
  className,
}: CommentInputProps) {
  return (
    <textarea
      placeholder={placeholder}
      disabled={disabled}
      rows={4}
      className={cn(
        "w-full resize-none rounded-lg border border-secondary bg-secondary/30 px-4 py-3",
        "text-base text-background placeholder:text-background/50",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
        "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      aria-label="Write a comment"
    />
  );
}
