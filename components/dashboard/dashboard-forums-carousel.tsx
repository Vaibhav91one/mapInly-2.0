"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
import { ForumCard } from "@/components/forums/forum-card";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import type { Forum } from "@/types/forum";

interface DashboardForumsCarouselProps {
  activeForums: Forum[];
  inactiveForums: Forum[];
  onEditForum?: (forum: Forum) => void;
  onDeleteForum?: (forum: Forum) => void;
}

export function DashboardForumsCarousel({
  activeForums,
  inactiveForums,
  onEditForum,
  onDeleteForum,
}: DashboardForumsCarouselProps) {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [forumToDelete, setForumToDelete] = useState<Forum | null>(null);

  const forums = activeTab === "active" ? activeForums : inactiveForums;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-regular leading-tight tracking-tight text-white md:text-3xl">
          Forums you created
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

      <div className="relative h-[420px]">
        {forums.length === 0 ? (
          <div
            className="flex aspect-[21/6] w-full items-center justify-center rounded-none border border-secondary bg-black"
            role="status"
          >
            <p className="text-lg text-white/60">
              {activeTab === "active" ? "No active forums" : "No inactive forums"}
            </p>
          </div>
        ) : (
          <Carousel
            key={`forums-${activeTab}-${forums.length}`}
            opts={{
              loop: false,
              align: "start",
              slidesToScroll: 1,
            }}
            orientation="vertical"
            className="h-full w-full"
          >
            <CarouselContent className="-mt-4 flex-col">
              {forums.map((forum) => (
                <CarouselItem
                  key={forum.id}
                  className={cn(
                    "pt-10",
                    "basis-auto shrink-0"
                  )}
                >
                  <div className="relative">
                    {user && forum.createdBy === user.id && (onEditForum || onDeleteForum) && (
                      <div className="absolute top-4 right-4 z-10 flex gap-2">
                        {onEditForum && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onEditForum(forum);
                            }}
                            className="flex size-10 items-center justify-center rounded-none bg-white text-black hover:bg-white/90"
                            aria-label={`Edit ${forum.title}`}
                          >
                            <Pencil className="size-5" />
                          </button>
                        )}
                        {onDeleteForum && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setForumToDelete(forum);
                            }}
                            className="flex size-10 items-center justify-center rounded-none bg-white text-black hover:bg-white/90"
                            aria-label={`Delete ${forum.title}`}
                          >
                            <Trash2 className="size-5" />
                          </button>
                        )}
                      </div>
                    )}
                    <ForumCard
                      title={forum.title}
                      shortDescription={forum.shortDescription}
                      tagline={forum.tagline}
                      status={forum.status}
                      tags={forum.tags}
                      href={`/forums/${forum.slug}`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {forums.length > 1 && (
              <>
                <CarouselPrevious
                  size="icon"
                  className="absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-none border-0 bg-white text-black hover:bg-white/90 disabled:opacity-50"
                />
                <CarouselNext
                  size="icon"
                  className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-none border-0 bg-white text-black hover:bg-white/90 disabled:opacity-50"
                />
              </>
            )}
          </Carousel>
        )}
      </div>
      <AlertDialog
        open={!!forumToDelete}
        onOpenChange={(open) => !open && setForumToDelete(null)}
      >
        <AlertDialogContent className="bg-black border-white/20 text-white rounded-none">
          <AlertDialogHeader className="gap-4">
            <AlertDialogTitle className="text-2xl font-regular leading-tight tracking-tight text-white md:text-3xl">Delete forum?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-regular leading-tight tracking-tight text-white/70">
              This will permanently delete the forum and all its comments. This
              action cannot be undone.
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
                if (forumToDelete && onDeleteForum) {
                  onDeleteForum(forumToDelete);
                  setForumToDelete(null);
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
