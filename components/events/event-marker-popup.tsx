"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navigation, Clock, ExternalLink, ArrowUpRight } from "lucide-react";
import { keys } from "@/lib/i18n/keys";
import type { Event } from "@/types/event";

function isGradient(src: string): boolean {
  return src?.startsWith("gradient:") ?? false;
}

function parseGradientColors(src: string): string[] {
  const colors = src
    .slice(9)
    .split(",")
    .map((c) => c.trim());
  return colors.length === 4 ? colors : ["#b8cd65", "#6200ff", "#e2a3ff", "#ff99fd"];
}

function getDirectionsUrl(event: Event): string {
  return (
    event.location.mapsUrl ??
    `https://maps.google.com/?q=${event.location.latitude},${event.location.longitude}`
  );
}

interface EventMarkerPopupProps {
  event: Event;
}

export function EventMarkerPopup({ event }: EventMarkerPopupProps) {
  const { t } = useTranslation();
  return (
    <>
      <div className="relative h-32 overflow-hidden rounded-none bg-zinc-900/80">
        {isGradient(event.image) ? (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${parseGradientColors(
                event.image
              ).join(", ")})`,
            }}
          />
        ) : (
          <Image
            fill
            src={event.image}
            alt={event.title}
            className="object-cover"
          />
        )}
      </div>
      <div className="space-y-2 p-3 bg-zinc-950/95 text-zinc-100">
        <div>
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            {t(keys.event.label)}
          </span>
          <h3 className="font-semibold text-white leading-tight">
            {event.title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <Clock className="size-3.5 shrink-0" />
          <span>
            {event.date}
            {event.timeRange ? ` · ${event.timeRange}` : ""}
          </span>
        </div>
        <p className="text-sm text-zinc-400 line-clamp-1">
          {event.location.displayName}
        </p>
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 h-8 rounded-none bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700"
            asChild
          >
            <a
              href={getDirectionsUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Navigation className="size-3.5 mr-1.5" />
              {t(keys.common.openInMaps)}
            </a>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-none bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
            asChild
          >
            <Link href={`/events/${event.slug}`}>
            <ArrowUpRight className="size-3.5" />
              {/* <ExternalLink className="size-3.5" /> */}
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
