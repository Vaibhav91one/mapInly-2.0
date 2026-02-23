"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { keys } from "@/lib/i18n/keys";
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
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [forumToDelete, setForumToDelete] = useState<Forum | null>(null);

  const forums = activeTab === "active" ? activeForums : inactiveForums;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-regular leading-tight tracking-tight text-white md:text-3xl">
          {t(keys.dashboard.forumsCreated)}
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
      </div>

      <div className="relative min-w-0 overflow-hidden">
        {forums.length === 0 ? (
          <div
            className="flex aspect-[21/6] w-full items-center justify-center rounded-none border border-secondary bg-black"
            role="status"
          >
            <p className="text-lg text-white/60">
              {activeTab === "active" ? t(keys.dashboard.noActiveForums) : t(keys.dashboard.noInactiveForums)}
            </p>
          </div>
        ) : (
          <Carousel
            key={`forums-${activeTab}-${forums.length}`}
            opts={{
              loop: true,
              align: "start",
              slidesToScroll: 1,
            }}
            className="min-w-0 w-full overflow-hidden"
          >
            <CarouselContent className="-ml-4">
              {forums.map((forum) => (
                <CarouselItem key={forum.id} className="pl-4 basis-full shrink-0">
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
                      sourceLocale={forum.sourceLocale}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {forums.length > 1 && (
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
        open={!!forumToDelete}
        onOpenChange={(open) => !open && setForumToDelete(null)}
      >
        <AlertDialogContent className="bg-black border-white/20 text-white rounded-none">
          <AlertDialogHeader className="gap-4">
            <AlertDialogTitle className="text-2xl font-regular leading-tight tracking-tight text-white md:text-3xl">{t(keys.dashboard.deleteForumTitle)}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-regular leading-tight tracking-tight text-white/70">
              {t(keys.dashboard.deleteForumDescription)}
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
                if (forumToDelete && onDeleteForum) {
                  onDeleteForum(forumToDelete);
                  setForumToDelete(null);
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
