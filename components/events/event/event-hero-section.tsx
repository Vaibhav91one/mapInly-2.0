"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { EventLocationLink } from "./event-location-link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";
import { keys } from "@/lib/i18n/keys";

interface OrganizerItem {
  image: string;
  name?: string;
}

interface JoinerItem {
  image: string;
}

interface EventHeroSectionProps {
  title: string;
  date: string;
  location: { displayName: string; latitude?: number; longitude?: number; mapsUrl?: string };
  /** Single organizer for "Organized by" (1 avatar). Popover shows name on click. */
  organizer?: OrganizerItem;
  /** Joiners for "joining" section (max 3 avatars + overflow count circle). */
  joiners?: JoinerItem[];
}

const MAX_VISIBLE_JOINERS = 3;

export function EventHeroSection({ title, date, location, organizer, joiners = [] }: EventHeroSectionProps) {
  const { t } = useTranslation();
  const visibleJoiners = joiners.slice(0, MAX_VISIBLE_JOINERS);
  const joinersRestCount = Math.max(0, joiners.length - MAX_VISIBLE_JOINERS);

  return (
    <section
      className={cn(
        sectionClasses,
        "h-[60dvh] bg-foreground"
      )}
    >
      <div
        className={cn(
          sectionInnerClasses,
          "relative z-10 flex min-h-[60dvh] flex-col items-start justify-between gap-8"
        )}
      >
        {/* Top row: 1/4 = / Events, 3/4 = Organized by (1 avatar) start | joiners (3 avatars + rest) + "joining" end */}
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_3fr] lg:items-center lg:gap-16">
          <p className="text-sm font-regular leading-tight tracking-tight text-white md:text-2xl">
            <Link href="/events" className="hover:text-background transition-colors">
              {t(keys.eventDetail.breadcrumb)}
            </Link>
          </p>
          <div className="flex w-full items-center justify-between gap-4">
            {organizer && (
              <div className="flex items-center gap-3 shrink-0">
                <p className="text-sm font-medium tracking-tight text-background/70">{t(keys.eventDetail.organizedBy)}</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-full"
                      aria-label={organizer.name ?? t(keys.eventDetail.organizerAria)}
                    >
                      <Image
                        src={organizer.image}
                        alt={organizer.name ?? ""}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </button>
                  </PopoverTrigger>
                  {organizer.name && (
                    <PopoverContent
                      align="start"
                      side="bottom"
                      className="w-auto rounded-md px-3 py-2 text-sm font-medium text-popover-foreground"
                    >
                      {organizer.name}
                    </PopoverContent>
                  )}
                </Popover>
              </div>
            )}
            {joiners.length > 0 && (
              <div className="flex items-center gap-3 ml-auto">
                <div className="flex items-center">
                  {visibleJoiners.map((j, i) => (
                    <div
                      key={i}
                      className={cn(
                        "relative shrink-0 overflow-hidden rounded-full ring-2 ring-foreground",
                        i > 0 ? "-ml-3" : ""
                      )}
                      style={{ width: 48, height: 48 }}
                    >
                      <Image
                        src={j.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ))}
                  {joinersRestCount > 0 && (
                    <div
                      className={cn(
                        "flex shrink-0 items-center justify-center rounded-full bg-background/20 text-sm font-medium text-background ring-2 ring-foreground",
                        visibleJoiners.length > 0 ? "-ml-3" : ""
                      )}
                      style={{ width: 48, height: 48 }}
                    >
                      +{joinersRestCount}
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium tracking-tight text-background/70 shrink-0">{t(keys.eventDetail.joining)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom row: date/location | title */}
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_3fr] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-regular leading-tight tracking-tight text-background/60">{t(keys.eventDetail.date)}</p>
              <p className="mt-1 text-lg font-regular leading-tight tracking-tight text-background">{date}</p>
            </div>
            <div>
              <p className="text-sm font-regular leading-tight tracking-tight text-background/60">{t(keys.eventDetail.location)}</p>
              <EventLocationLink location={location} />
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <h1 className="text-4xl font-regular leading-tight tracking-tight text-background md:text-6xl lg:text-7xl xl:text-8xl text-right">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
