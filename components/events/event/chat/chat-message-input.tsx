"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { keys } from "@/lib/i18n/keys";

interface ChatMessageInputProps {
  placeholder?: string;
  messageInputAria?: string;
  emojiAria?: string;
  onSubmit?: (content: string) => void;
  disabled?: boolean;
  className?: string;
  onEmojiSelect?: (emoji: string) => void;
}

const EMOJI_LIST = "😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😗 ☺ 😚 😙 🥲 😋 😛 😜 🤪 😝 🤑 🤗 🤭 🤫 🤔 🤐 🤨 😐 😑 😶 😏 😒 🙄 😬 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🤢 🤮 🤧 🥵 🥶".split(
  " "
);

export function ChatMessageInput({
  placeholder,
  messageInputAria,
  emojiAria,
  onSubmit,
  disabled = false,
  className,
  onEmojiSelect,
}: ChatMessageInputProps) {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t(keys.eventChat.messagePlaceholder);
  const resolvedMessageAria = messageInputAria ?? t(keys.eventChat.messageInputAria);
  const resolvedEmojiAria = emojiAria ?? t(keys.eventChat.emojiAria);
  const [value, setValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEmojiPicker]);

  const handleEmojiClick = (emoji: string) => {
    if (onEmojiSelect) {
      onEmojiSelect(emoji);
    } else {
      setValue((prev) => prev + emoji);
    }
  };

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
        "relative flex items-end gap-2 border-t border-secondary/50 bg-foreground p-3",
        className
      )}
    >
      <div ref={pickerRef} className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-background/70 hover:bg-secondary/50 hover:text-background focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          aria-label={resolvedEmojiAria}
          type="button"
          onClick={() => setShowEmojiPicker((p) => !p)}
        >
          <Smile className="size-5" />
        </Button>
        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 z-50 mb-1 flex max-h-40 w-64 flex-wrap gap-1 overflow-y-auto rounded-lg border border-secondary/50 bg-foreground p-2 shadow-lg">
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="rounded p-1 text-lg hover:bg-secondary/50 focus:outline-none focus:ring-0"
                onClick={() => handleEmojiClick(emoji)}
                aria-label={`Add emoji ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-secondary/50 bg-secondary/30 px-3 py-2 focus-within:border-secondary/70">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent text-sm text-background placeholder:text-background/50 outline-none focus:ring-0 focus:outline-none"
          aria-label={resolvedMessageAria}
        />
      </div>
    </div>
  );
}
