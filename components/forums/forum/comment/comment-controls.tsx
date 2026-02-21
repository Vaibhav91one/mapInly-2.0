"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SortOption = "newest";

interface CommentControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  className?: string;
}

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest to oldest",
};

export function CommentControls({
  sortBy,
  onSortChange,
  className,
}: CommentControlsProps) {
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
            Sort by: <span className="font-medium text-background">{SORT_LABELS[sortBy]}</span>
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[140px] rounded-none">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
            <DropdownMenuItem
              key={opt}
              onClick={() => onSortChange(opt)}
              className={sortBy === opt ? "bg-accent/20" : ""}
            >
              {SORT_LABELS[opt]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
