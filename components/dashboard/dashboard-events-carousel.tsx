"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProjectCard } from "@/components/home/project-card";
import { Pencil, Search, Trash2 } from "lucide-react";
import { StaticMeshGradient } from "@paper-design/shaders-react";
import { useAuthStore } from "@/stores/auth-store";
import { keys } from "@/lib/i18n/keys";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/event";

function isGradient(src: string): boolean {
  return src?.startsWith("gradient:") ?? false;
}

function parseGradientColors(src: string): string[] {
  const colors = src.slice(9).split(",").map((c) => c.trim());
  return colors.length === 4 ? colors : ["#b8cd65", "#6200ff", "#e2a3ff", "#ff99fd"];
}

interface DashboardEventsCarouselProps {
  activeEvents: Event[];
  inactiveEvents: Event[];
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (event: Event) => void;
  onOpenSearch?: () => void;
}

export function DashboardEventsCarousel({
  activeEvents,
  inactiveEvents,
  onEditEvent,
  onDeleteEvent,
  onOpenSearch,
}: DashboardEventsCarouselProps) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const events = activeTab === "active" ? activeEvents : inactiveEvents;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-regular leading-tight tracking-tight text-white md:text-3xl">
          {t(keys.dashboard.eventsOrganized)}
        </h2>
        <div className="flex items-center gap-2">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "active" | "inactive")}
          >
            <TabsList className="w-fit border border-white/20 bg-white/10 text-white rounded-none p-0">
              <TabsTrigger
                value="active"
                className="text-white/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
              >
                {t(keys.dashboard.active)}
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="text-white/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
              >
                {t(keys.dashboard.inactive)}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex size-10 items-center justify-center rounded-none border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label={t(keys.dashboard.searchPlaceholder)}
            >
              <Search className="size-5" />
            </button>
          )}
        </div>
      </div>

      <div className="relative min-w-0 overflow-hidden">
        {events.length === 0 ? (
          <div
            className="flex aspect-[21/6] w-full items-center justify-center rounded-none border border-secondary bg-black"
            role="status"
          >
            <p className="text-lg text-white/60">
              {activeTab === "active" ? t(keys.dashboard.noActiveEvents) : t(keys.dashboard.noInactiveEvents)}
            </p>
          </div>
        ) : (
          <Carousel
            key={`events-${activeTab}-${events.length}`}
            opts={{
              loop: true,
              align: "start",
              slidesToScroll: 1,
            }}
            className="min-w-0 w-full overflow-hidden"
          >
            <CarouselContent className="-ml-4">
            {events.map((event, index) => (
              <CarouselItem
                key={event.id}
                className={cn(
                  "pl-4",
                  "basis-full sm:basis-[85%] md:basis-1/2 lg:basis-1/3"
                )}
              >
                <div className="relative aspect-[4/5]">
                  {user && event.createdBy === user.id && (onEditEvent || onDeleteEvent) && (
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      {onEditEvent && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEditEvent(event);
                          }}
                          className="flex size-10 items-center justify-center rounded-none bg-white text-black hover:bg-white/90"
                          aria-label={`Edit ${event.title}`}
                        >
                          <Pencil className="size-5" />
                        </button>
                      )}
                      {onDeleteEvent && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEventToDelete(event);
                          }}
                          className="flex size-10 items-center justify-center rounded-none bg-white text-black hover:bg-white/90"
                          aria-label={`Delete ${event.title}`}
                        >
                          <Trash2 className="size-5" />
                        </button>
                      )}
                    </div>
                  )}
                  <ProjectCard
                    index={index + 1}
                    title={event.title}
                    description={event.shortDescription}
                    image={isGradient(event.image) ? undefined : event.image}
                    media={
                      isGradient(event.image) ? (
                        <StaticMeshGradient
                          width="100%"
                          height="100%"
                          fit="cover"
                          colors={parseGradientColors(event.image)}
                          positions={2}
                          waveX={1}
                          waveXShift={0.6}
                          waveY={1}
                          waveYShift={0.21}
                          mixing={0.93}
                          grainMixer={0.31}
                          grainOverlay={0.48}
                          rotation={270}
                        />
                      ) : undefined
                    }
                    href={`/events/${event.slug}`}
                    variant="simple"
                    timing={`${event.date} · ${event.timeRange}`}
                    location={event.location.displayName}
                  />
                </div>
              </CarouselItem>
            ))}
            </CarouselContent>
            {events.length > 1 && (
              <>
                <CarouselPrevious
                  size="icon"
                  className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-none border-0 bg-white text-black hover:bg-white/90 disabled:opacity-50"
                />
                <CarouselNext
                  size="icon"
                  className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-none border-0 bg-white text-black hover:bg-white/90 disabled:opacity-50"
                />
              </>
            )}
          </Carousel>
        )}
      </div>
      <AlertDialog
        open={!!eventToDelete}
        onOpenChange={(open: boolean) => !open && setEventToDelete(null)}
      >
        <AlertDialogContent className="bg-black border-white/20 text-white rounded-none">
          <AlertDialogHeader className="gap-4">
            <AlertDialogTitle className="text-2xl font-regular leading-tight tracking-tight text-white md:text-3xl">{t(keys.dashboard.deleteEventTitle)}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-regular leading-tight tracking-tight text-white/70">
              {t(keys.dashboard.deleteEventDescription)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="secondary" className="bg-secondary rounded-none text-secondary-foreground border-0">
              {t(keys.common.cancel)}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="rounded-none"
              onClick={() => {
                if (eventToDelete && onDeleteEvent) {
                  onDeleteEvent(eventToDelete);
                  setEventToDelete(null);
                }
              }}
            >
              {t(keys.common.delete)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
