"use client";

import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { keys } from "@/lib/i18n/keys";

export type SortOption = "newest";

interface CommentControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  className?: string;
}

export function CommentControls({
  sortBy,
  onSortChange,
  className,
}: CommentControlsProps) {
  const { t } = useTranslation();
  const sortLabels: Record<SortOption, string> = {
    newest: t(keys.forumComments.newestToOldest),
  };
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 rounded-none text-background/80 hover:bg-secondary/50 hover:text-background"
          >
            {t(keys.forumComments.sortBy)}: <span className="font-medium text-background">{sortLabels[sortBy]}</span>
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[140px] rounded-none">
          {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
            <DropdownMenuItem
              key={opt}
              onClick={() => onSortChange(opt)}
              className={sortBy === opt ? "bg-accent/20" : ""}
            >
              {sortLabels[opt]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
