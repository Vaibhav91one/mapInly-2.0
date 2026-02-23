"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquareX, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ForumCard } from "./forum-card";
import { cn } from "@/lib/utils";
import { sectionClasses } from "@/lib/layout-classes";
import { keys } from "@/lib/i18n/keys";
import type { Forum } from "@/types/forum";

interface ForumsContentSectionProps {
  forums: Forum[];
}

export function ForumsContentSection({ forums }: ForumsContentSectionProps) {
  const { t } = useTranslation();
  const [showInactiveForums, setShowInactiveForums] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const baseForums = useMemo(() => {
    if (showInactiveForums) return forums;
    return forums.filter((f) => f.status !== "closed");
  }, [forums, showInactiveForums]);

  const filteredForums = useMemo(() => {
    if (!searchQuery.trim()) return baseForums;
    const q = searchQuery.toLowerCase().trim();
    return baseForums.filter((f) => {
      const title = f.title?.toLowerCase() ?? "";
      const tagline = f.tagline?.toLowerCase() ?? "";
      const desc = (f.shortDescription ?? "").toLowerCase();
      const tags = (f.tags ?? []).join(" ").toLowerCase();
      return (
        title.includes(q) || tagline.includes(q) || desc.includes(q) || tags.includes(q)
      );
    });
  }, [baseForums, searchQuery]);

  return (
    <section
      className={cn(
        sectionClasses,
        "min-h-screen bg-foreground px-4 sm:px-6 md:px-10 lg:px-14 overflow-visible"
      )}
    >
      {/* Full-width search bar - filters cards as you type */}
      <div className="mb-8 w-full">
        <div className="relative">
          <Search
            className="absolute left-6 top-1/2 size-14 -translate-y-1/2 text-white/60 md:size-10"
            aria-hidden
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(keys.forums.search)}
            aria-label={t(keys.forums.searchAria)}
            className="h-[80px] w-full rounded-none border-secondary pl-20 text-4xl md:pl-20 md:text-4xl font-regular leading-tight tracking-tight text-background placeholder:text-background/60 focus-visible:border-white/40 focus-visible:ring-white/20"
          />
        </div>
      </div>

      {/* Two columns: 1/3 sticky sidebar | 2/3 forum cards */}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Left: Sticky sidebar (1/3) */}
        <aside className="flex w-full shrink-0 flex-col gap-4 lg:sticky lg:top-28 lg:self-start lg:w-1/4">
          <div className="flex items-center justify-between gap-4 rounded-none bg-secondary/50 px-5 py-4 hover:bg-secondary/80 transition-colors">
            <span className="text-base font-medium text-background">
              {t(keys.forums.inactiveForums)}
            </span>
            <Switch
              checked={showInactiveForums}
              onCheckedChange={setShowInactiveForums}
              aria-label={t(keys.forums.showInactiveForumsAria)}
            />
          </div>
        </aside>

        {/* Right: Forum cards (2/3) */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:w-3/4">
          {filteredForums.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-none border border-secondary/50 bg-secondary/20 px-8 py-16 text-center">
              <MessageSquareX className="mb-4 size-16 text-background/50" aria-hidden />
              <h3 className="mb-2 text-xl font-medium text-background">
                {t(keys.forums.noForumsToShow)}
              </h3>
              <p className="max-w-md text-background/70">
                {showInactiveForums
                  ? t(keys.forums.noForumsInSystem)
                  : t(keys.forums.noActiveForumsTryInactive)}
              </p>
            </div>
          ) : (
            filteredForums.map((forum) => (
              <ForumCard
                key={forum.id}
                title={forum.title}
                shortDescription={forum.shortDescription}
                tagline={forum.tagline}
                status={forum.status}
                tags={forum.tags}
                href={`/forums/${forum.slug}`}
                sourceLocale={forum.sourceLocale}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
