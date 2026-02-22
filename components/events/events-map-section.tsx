"use client";

import { useMemo, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapControls,
} from "@/components/ui/map";
import { EventMarkerPopup } from "./event-marker-popup";
import type { Event } from "@/types/event";

const DEFAULT_CENTER: [number, number] = [0, 20];
const DEFAULT_ZOOM = 2;

function computeCenterAndZoomFromEvents(
  events: Array<{ location: { latitude: number; longitude: number } }>,
  userCoords: { longitude: number; latitude: number } | null
): { center: [number, number]; zoom: number } {
  const points = [...events.map((e) => ({ lng: e.location.longitude, lat: e.location.latitude }))];
  if (userCoords) {
    points.push({ lng: userCoords.longitude, lat: userCoords.latitude });
  }

  if (points.length === 0) {
    return { center: userCoords ? [userCoords.longitude, userCoords.latitude] : DEFAULT_CENTER, zoom: userCoords ? 12 : DEFAULT_ZOOM };
  }

  if (points.length === 1) {
    return {
      center: [points[0].lng, points[0].lat],
      zoom: 13,
    };
  }

  const lngs = points.map((p) => p.lng);
  const lats = points.map((p) => p.lat);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;

  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;
  const span = Math.max(latSpan, lngSpan, 0.01);
  const zoom = Math.min(14, Math.max(2, Math.floor(12 - Math.log2(span * 50))));

  return {
    center: [centerLng, centerLat],
    zoom,
  };
}

interface EventsMapSectionProps {
  events: Event[];
}

export function EventsMapSection({ events }: EventsMapSectionProps) {
  const [userCoords, setUserCoords] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const eventsWithCoords = useMemo(
    () =>
      events.filter(
        (e) =>
          typeof e.location?.latitude === "number" &&
          typeof e.location?.longitude === "number"
      ),
    [events]
  );

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
        });
        setLocationLoading(false);
      },
      () => setLocationLoading(false)
    );
  }, []);

  const { center, zoom } = useMemo(
    () => computeCenterAndZoomFromEvents(eventsWithCoords, userCoords),
    [eventsWithCoords, userCoords]
  );

  if (locationLoading) {
    return (
      <div className="relative flex h-[700px] w-full min-h-[500px] items-center justify-center overflow-hidden rounded-none border border-secondary/50 bg-zinc-950">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <Loader2 className="size-10 animate-spin" aria-hidden />
          <p>Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[700px] w-full min-h-[500px] overflow-hidden rounded-none border border-secondary/50">
      <Map theme="dark" center={center} zoom={zoom} className="h-full w-full">
        <MapControls showZoom showLocate position="bottom-right" />
        {eventsWithCoords.length === 0 ? null : (
          eventsWithCoords.map((event) => (
            <MapMarker
              key={event.id}
              longitude={event.location.longitude}
              latitude={event.location.latitude}
            >
              <MarkerContent>
                <div className="size-5 rounded-full bg-primary border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform" />
                {/* <MarkerLabel position="bottom" className="text-white text-sm font-medium">{event.title}</MarkerLabel> */}
              </MarkerContent>
              <MarkerPopup className="p-0 w-62 rounded-none border-none">
                <EventMarkerPopup event={event} />
              </MarkerPopup>
            </MapMarker>
          ))
        )}
      </Map>
      {eventsWithCoords.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <p className="text-center text-muted-foreground px-4">
            No events with location data to display on the map.
          </p>
        </div>
      )}
    </div>
  );
}
