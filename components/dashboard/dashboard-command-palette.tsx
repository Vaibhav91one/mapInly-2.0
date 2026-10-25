"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Calendar, MessageSquare } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { keys } from "@/lib/i18n/keys";
import type { Event } from "@/types/event";
import type { Forum } from "@/types/forum";

export type DashboardCommandPaletteMode = "events" | "forums";

interface DashboardCommandPaletteProps {
  events: Event[];
  forums: Forum[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: DashboardCommandPaletteMode;
}

export function DashboardCommandPalette({
  events,
  forums,
  open,
  onOpenChange,
  mode,
}: DashboardCommandPaletteProps) {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelectEvent = (event: Event) => {
    router.push(`/events/${event.slug}`);
    onOpenChange(false);
  };

  const handleSelectForum = (forum: Forum) => {
    router.push(`/forums/${forum.slug}`);
    onOpenChange(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t(keys.dashboard.searchPlaceholder)}
      description={t(keys.dashboard.searchPlaceholder)}
      className="border-white/20 bg-black text-white rounded-none [&_[data-slot=command]]:bg-black [&_[data-slot=command]]:text-white [&_[cmdk-group-heading]]:text-white/70 [&_[cmdk-input-wrapper]]:border-white/20 [&_[cmdk-item][data-selected=true]]:bg-secondary [&_[cmdk-item][data-selected=true]]:text-white [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:hover:opacity-100"
    >
      <CommandInput
        placeholder={t(keys.dashboard.searchPlaceholder)}
        className="border-white/20 placeholder:text-white/50 text-white"
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty className="text-white/70">{t(keys.dashboard.searchNoResults)}</CommandEmpty>
        {mode === "events" && events.length > 0 && (
          <CommandGroup heading={t(keys.dashboard.eventsOrganized)} className="[&_[cmdk-group-heading]]:text-white/70">
            {events.map((event) => (
              <CommandItem
                key={event.id}
                value={`${event.id} ${event.title} ${event.tagline ?? ""} ${event.shortDescription ?? ""} ${(event.tags ?? []).join(" ")}`}
                onSelect={() => handleSelectEvent(event)}
                className="cursor-pointer text-white hover:bg-secondary/80 data-[selected=true]:bg-secondary"
              >
                <Calendar className="mr-2 size-4 shrink-0" />
                <span className="truncate">{event.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {mode === "forums" && forums.length > 0 && (
          <CommandGroup heading={t(keys.dashboard.forumsCreated)} className="[&_[cmdk-group-heading]]:text-white/70">
            {forums.map((forum) => (
              <CommandItem
                key={forum.id}
                value={`${forum.id} ${forum.title} ${forum.tagline ?? ""} ${forum.shortDescription ?? ""} ${(forum.tags ?? []).join(" ")}`}
                onSelect={() => handleSelectForum(forum)}
                className="cursor-pointer text-white hover:bg-secondary/80 data-[selected=true]:bg-secondary"
              >
                <MessageSquare className="mr-2 size-4 shrink-0" />
                <span className="truncate">{forum.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
