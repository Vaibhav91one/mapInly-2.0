"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { keys } from "@/lib/i18n/keys";

interface CommentInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (content: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
  showCancel?: boolean;
  className?: string;
}

export function CommentInput({
  placeholder,
  value: controlledValue,
  onChange,
  onSubmit,
  onCancel,
  disabled = false,
  showCancel = false,
  className,
}: CommentInputProps) {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t(keys.forumComments.joinConversation);
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value;
      if (isControlled) {
        onChange?.(v);
      } else {
        setInternalValue(v);
        onChange?.(v);
      }
    },
    [isControlled, onChange]
  );

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && onSubmit) {
      onSubmit(trimmed);
      if (!isControlled) setInternalValue("");
    }
  }, [value, onSubmit, isControlled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-2", className)}>
      <textarea
        placeholder={resolvedPlaceholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={3}
        className={cn(
          "w-full resize-none rounded-none border border-secondary bg-secondary/30 px-4 py-3",
          "text-base text-background placeholder:text-background/50",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
          "transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        aria-label={t(keys.forumComments.writeComment)}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          className="rounded-none"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
        >
          {t(keys.forumComments.submit)}
        </Button>
        {showCancel && onCancel && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-none bg-secondary hover:bg-secondary/80"
            onClick={onCancel}
          >
            {t(keys.common.cancel)}
          </Button>
        )}
      </div>
    </div>
  );
}
