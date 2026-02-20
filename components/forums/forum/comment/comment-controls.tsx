"use client";

import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SortOption = "best" | "newest" | "oldest" | "top";

interface CommentControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

const SORT_LABELS: Record<SortOption, string> = {
  best: "Best",
  newest: "Newest",
  oldest: "Oldest",
  top: "Top",
};

export function CommentControls({
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
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
            className="gap-1 text-background/80 hover:bg-secondary/50 hover:text-background"
          >
            Sort by: <span className="font-medium text-background">{SORT_LABELS[sortBy]}</span>
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[140px]">
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

      <div className="relative max-w-sm flex-1 sm:max-w-xs">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-background/50"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search Comments"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-9 border-secondary bg-secondary/30 text-background placeholder:text-background/50"
          aria-label="Search comments"
        />
      </div>
    </div>
  );
}
