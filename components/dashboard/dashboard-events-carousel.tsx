"use client";

import { useState } from "react";
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
import { Pencil, Trash2 } from "lucide-react";
import { StaticMeshGradient } from "@paper-design/shaders-react";
import { useAuthStore } from "@/stores/auth-store";
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
}

export function DashboardEventsCarousel({
  activeEvents,
  inactiveEvents,
  onEditEvent,
  onDeleteEvent,
}: DashboardEventsCarouselProps) {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const events = activeTab === "active" ? activeEvents : inactiveEvents;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-regular leading-tight tracking-tight text-white md:text-3xl">
          Events you organized
        </h2>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "active" | "inactive")}
        >
          <TabsList className="w-fit border border-white/20 bg-white/10 text-white rounded-none p-0">
            <TabsTrigger
              value="active"
              className="text-white/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className="text-white/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
            >
              Inactive
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative">
        {events.length === 0 ? (
          <div
            className="flex aspect-[21/6] w-full items-center justify-center rounded-none border border-secondary bg-black"
            role="status"
          >
            <p className="text-lg text-white/60">
              {activeTab === "active" ? "No active events" : "No inactive events"}
            </p>
          </div>
        ) : (
          <Carousel
            key={`events-${activeTab}-${events.length}`}
            opts={{
              loop: false,
              align: "start",
              slidesToScroll: 1,
            }}
            className="w-full"
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
            <AlertDialogTitle className="text-2xl font-regular leading-tight tracking-tight text-white md:text-3xl">Delete event?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-regular leading-tight tracking-tight text-white/70">
              This will permanently delete the event and all its registrations.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="secondary" className="bg-secondary rounded-none text-secondary-foreground border-0">
              Cancel
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
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
