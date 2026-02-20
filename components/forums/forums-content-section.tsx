"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ForumCard } from "./forum-card";
import { cn } from "@/lib/utils";
import { sectionClasses } from "@/lib/layout-classes";

const MOCK_FORUMS = [
  {
    id: "1",
    title: "Lugano AI Community",
    description: "Discuss AI trends, share projects, and connect with local experts",
    status: "active" as const,
    tags: ["AI", "community", "innovation"],
    href: "/forums/lugano-ai-community",
  },
  {
    id: "2",
    title: "Blockchain & Art",
    description: "Exploring the intersection of blockchain technology and digital art",
    status: "active" as const,
    tags: ["blockchain", "art", "NFT"],
    href: "/forums/blockchain-art",
  },
  {
    id: "3",
    title: "Ticino Tech Hub",
    description: "Monthly discussions for developers and tech enthusiasts",
    status: "closed" as const,
    tags: ["tech", "meetup", "development"],
    href: "/forums/ticino-tech-hub",
  },
];

export function ForumsContentSection() {
  const [mainForumsOnly, setMainForumsOnly] = useState(false);

  return (
    <section
      className={cn(
        sectionClasses,
        "min-h-screen bg-foreground px-14"
      )}
    >
      {/* Full-width search bar */}
      <div className="mb-8 w-full">
        <div className="relative">
          <Search
            className="absolute left-6 top-1/2 size-14 -translate-y-1/2 text-white/60 md:size-10"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search"
            className="h-[80px] w-full rounded-none border-secondary pl-16 text-4xl md:pl-20 md:text-4xl font-regular leading-tight tracking-tight text-background placeholder:text-background/60 focus-visible:border-white/40 focus-visible:ring-white/20"
            aria-label="Search forums"
          />
        </div>
      </div>

      {/* Two columns: 1/3 sticky sidebar | 2/3 forum cards */}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Left: Sticky sidebar (1/3) */}
        <aside className="w-full shrink-0 lg:sticky lg:top-28 lg:w-1/4">
          <div className="flex items-center justify-between gap-4 rounded-none bg-secondary/50 px-5 py-4 hover:bg-secondary/80 transition-colors">
            <span className="text-base font-medium text-background">
              Main Forums
            </span>
            <Switch
              checked={mainForumsOnly}
              onCheckedChange={setMainForumsOnly}
              aria-label="Filter main forums only"
            />
          </div>
        </aside>

        {/* Right: Forum cards (2/3) */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:w-3/4">
          {MOCK_FORUMS.map((forum) => (
            <ForumCard
              key={forum.id}
              title={forum.title}
              description={forum.description}
              status={forum.status}
              tags={forum.tags}
              href={forum.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
