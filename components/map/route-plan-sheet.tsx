"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RoutePlanMap } from "./route-plan-map";
import { Loader2, Navigation } from "lucide-react";
import { keys } from "@/lib/i18n/keys";

interface RoutePlanSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: { lng: number; lat: number; name: string };
  mapsUrl?: string;
  origin?: { lng: number; lat: number } | null;
}

export function RoutePlanSheet({
  open,
  onOpenChange,
  destination,
  mapsUrl,
  origin = null,
}: RoutePlanSheetProps) {
  const { t } = useTranslation();
  const [userCoords, setUserCoords] = useState<{
    lng: number;
    lat: number;
  } | null>(origin ?? null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      if (!origin) setUserCoords(null);
      return;
    }
    if (origin) {
      setUserCoords({ lng: origin.lng, lat: origin.lat });
      return;
    }
    if (!("geolocation" in navigator)) {
      toast.error(t(keys.common.geolocationNotSupported));
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lng: pos.coords.longitude,
          lat: pos.coords.latitude,
        });
        setLocationLoading(false);
      },
      () => {
        toast.error(t(keys.common.couldNotGetLocation));
        setLocationLoading(false);
      }
    );
  }, [open, origin]);

  const canShowMap = userCoords !== null && !locationLoading;
  const openInMapsUrl =
    mapsUrl ??
    `https://maps.google.com/?q=${destination.lat},${destination.lng}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] flex flex-col gap-0 p-5 rounded-none bg-zinc-950 border-zinc-800 [&>button]:text-zinc-100 [&>button]:hover:text-white"
        showCloseButton={true}
      >
        <div className="relative flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 px-6 pb-6 pt-6">
            {locationLoading ? (
              <div className="flex h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-zinc-400">
                  <Loader2 className="size-10 animate-spin" />
                  <p>{t(keys.common.gettingLocation)}</p>
                </div>
              </div>
            ) : canShowMap ? (
              <RoutePlanMap
                start={{
                  lng: userCoords!.lng,
                  lat: userCoords!.lat,
                  name: "You",
                }}
                end={{
                  lng: destination.lng,
                  lat: destination.lat,
                  name: destination.name,
                }}
                className="h-full min-h-[400px]"
              />
            ) : (
              <div className="flex h-[400px] items-center justify-center">
                <p className="text-zinc-400 text-center px-4">
                  {t(keys.common.enableLocationAccess)}
                </p>
              </div>
            )}
          </div>
          <div className="absolute bottom-10 left-8 z-10">
            <Button
              size="sm"
              className="h-8 rounded-none bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700"
              asChild
            >
              <a
                href={openInMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Navigation className="size-3.5 mr-1.5" />
                {t(keys.common.openInMaps)}
              </a>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
