"use client";

import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { RoutePlanSheet } from "@/components/map/route-plan-sheet";
import { cn } from "@/lib/utils";

interface EventLocationLinkProps {
  location: {
    displayName: string;
    latitude?: number;
    longitude?: number;
    mapsUrl?: string;
  };
  className?: string;
}

export function EventLocationLink({ location, className }: EventLocationLinkProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const hasValidCoords =
    typeof location?.latitude === "number" && typeof location?.longitude === "number";

  if (!hasValidCoords) {
    return (
      <p
        className={cn(
          "mt-1 text-lg font-regular leading-tight tracking-tight text-background line-clamp-2",
          className
        )}
      >
        @{location.displayName}
      </p>
    );
  }

  return (
    <>
      <HoverCard>
        <HoverCardTrigger asChild>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={cn(
              "mt-1 text-left text-lg font-regular leading-tight tracking-tight text-background line-clamp-2",
              "cursor-pointer hover:underline decoration-secondary transition-colors",
              "focus:outline-none focus:underline focus:ring-0",
              className
            )}
          >
            @{location.displayName}
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          className="w-auto rounded-md border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
          side="top"
        >
          See route plan
        </HoverCardContent>
      </HoverCard>
      <RoutePlanSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        destination={{
          lng: location.longitude!,
          lat: location.latitude!,
          name: location.displayName,
        }}
        mapsUrl={location.mapsUrl}
        origin={null}
      />
    </>
  );
}
