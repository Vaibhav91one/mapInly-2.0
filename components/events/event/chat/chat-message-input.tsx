"use client";

import { useState, useCallback } from "react";
import { Smile, Mic, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessageInputProps {
  placeholder?: string;
  onSubmit?: (content: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ChatMessageInput({
  placeholder = "Message...",
  onSubmit,
  disabled = false,
  className,
}: ChatMessageInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && onSubmit) {
      onSubmit(trimmed);
      setValue("");
    }
  }, [value, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        "flex items-end gap-2 border-t border-secondary/50 bg-foreground p-3",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-background/70 hover:bg-secondary/50 hover:text-background"
        aria-label="Emoji"
        type="button"
      >
        <Smile className="size-5" />
      </Button>
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-secondary/50 bg-secondary/30 px-3 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent text-sm text-background placeholder:text-background/50 outline-none"
          aria-label="Message input"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-background/70 hover:bg-secondary/50 hover:text-background"
        aria-label="Voice message"
        type="button"
      >
        <Mic className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-background/70 hover:bg-secondary/50 hover:text-background"
        aria-label="Attach image"
        type="button"
      >
        <ImageIcon className="size-5" />
      </Button>
    </div>
  );
}
