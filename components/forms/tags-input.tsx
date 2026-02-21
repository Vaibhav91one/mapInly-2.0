"use client";

import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formInputClasses } from "@/lib/form-styles";
import { cn } from "@/lib/utils";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagsInput({
  value,
  onChange,
  placeholder = "e.g. AI, community, innovation",
  className,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = useCallback(() => {
    const trimmed = inputValue.trim().replace(/^#/, "");
    if (!trimmed || value.includes(trimmed)) {
      setInputValue("");
      return;
    }
    onChange([...value, trimmed]);
    setInputValue("");
  }, [inputValue, value, onChange]);

  const removeTag = useCallback(
    (tag: string) => {
      onChange(value.filter((t) => t !== tag));
    },
    [value, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const canAdd = inputValue.trim().length > 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(formInputClasses, "flex-1")}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={addTag}
          disabled={!canAdd}
          className="shrink-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          Add
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-none border border-white/20 bg-secondary/50 px-2 py-1 text-sm text-white"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
                className="hover:text-destructive focus:outline-none focus-visible:ring-0"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
