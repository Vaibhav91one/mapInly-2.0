"use client";

import { useMemo, useState } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MapRoute,
  MapControls,
} from "@/components/ui/map";
import { Loader2, Clock, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOsrmRoute, formatDuration, formatDistance } from "@/hooks/use-osrm-route";
import { cn } from "@/lib/utils";

interface RoutePlanMapProps {
  start: { lng: number; lat: number; name?: string };
  end: { lng: number; lat: number; name?: string };
  className?: string;
}

function computeCenterAndZoom(
  start: { lng: number; lat: number },
  end: { lng: number; lat: number },
  routeCoords?: [number, number][]
): { center: [number, number]; zoom: number } {
  const points = routeCoords && routeCoords.length > 0
    ? routeCoords
    : [
        [start.lng, start.lat] as [number, number],
        [end.lng, end.lat] as [number, number],
      ];

  const lngs = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;

  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;
  const span = Math.max(latSpan, lngSpan, 0.01);
  const zoom = Math.min(14, Math.max(4, Math.floor(12 - Math.log2(span * 50))));

  return {
    center: [centerLng, centerLat],
    zoom,
  };
}

export function RoutePlanMap({ start, end, className }: RoutePlanMapProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { routes, isLoading, error } = useOsrmRoute(
    { lng: start.lng, lat: start.lat },
    { lng: end.lng, lat: end.lat }
  );

  const primaryRoute = routes[selectedIndex] ?? routes[0];
  const { center, zoom } = useMemo(
    () =>
      computeCenterAndZoom(
        start,
        end,
        primaryRoute?.coordinates
      ),
    [start, end, primaryRoute?.coordinates]
  );

  const sortedRoutes = useMemo(
    () =>
      routes
        .map((route, index) => ({ route, index }))
        .sort((a, b) => {
          if (a.index === selectedIndex) return 1;
          if (b.index === selectedIndex) return -1;
          return 0;
        }),
    [routes, selectedIndex]
  );

  if (error && routes.length === 0) {
    return (
      <div
        className={cn(
          "flex h-[400px] min-h-[300px] w-full items-center justify-center rounded-none border border-border bg-muted/30",
          className
        )}
      >
        <p className="text-center text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className={cn("relative h-[500px] w-full min-h-[400px]", className)}>
      <Map
        theme="dark"
        center={center}
        zoom={zoom}
        className="h-full w-full"
      >
        <MapControls showZoom showLocate position="bottom-right" />

        {sortedRoutes.map(({ route, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <MapRoute
              key={index}
              coordinates={route.coordinates}
              color={isSelected ? "#6366f1" : "#94a3b8"}
              width={isSelected ? 6 : 5}
              opacity={isSelected ? 1 : 0.6}
              onClick={() => setSelectedIndex(index)}
            />
          );
        })}

        <MapMarker longitude={start.lng} latitude={start.lat}>
          <MarkerContent>
            <div className="size-5 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
            {/* {start.name && (
              <MarkerLabel position="top">{start.name}</MarkerLabel>
            )} */}
          </MarkerContent>
        </MapMarker>

        <MapMarker longitude={end.lng} latitude={end.lat}>
          <MarkerContent>
            <div className="size-5 rounded-full bg-green-500 border-2 border-white shadow-lg" />
            {/* {end.name && (
              <MarkerLabel position="bottom">{end.name}</MarkerLabel>
            )} */}
          </MarkerContent>
        </MapMarker>
      </Map>

      {routes.length > 0 && (
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {routes.map((route, index) => {
            const isActive = index === selectedIndex;
            const isFastest = index === 0;
            return (
              <Button
                key={index}
                variant={isActive ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedIndex(index)}
                className="justify-start gap-3 rounded-none"
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span className="font-medium">
                    {formatDuration(route.duration)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs opacity-80">
                  <Route className="size-3" />
                  {formatDistance(route.distance)}
                </div>
                {isFastest && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-none font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Fastest
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
