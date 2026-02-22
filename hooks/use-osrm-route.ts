"use client";

import { useEffect, useState } from "react";

export interface RouteData {
  coordinates: [number, number][];
  duration: number; // seconds
  distance: number; // meters
}

export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function useOsrmRoute(
  start: { lng: number; lat: number } | null,
  end: { lng: number; lat: number } | null
) {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!start || !end) {
      setRoutes([]);
      setError(null);
      return;
    }

    const startCoords = start;
    const endCoords = end;
    let cancelled = false;

    async function fetchRoute() {
      setIsLoading(true);
      setError(null);
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?overview=full&geometries=geojson&alternatives=true`;
        const response = await fetch(url);
        const data = await response.json();

        if (cancelled) return;

        if (data.code !== "Ok" || !data.routes?.length) {
          setError("No route found");
          setRoutes([]);
          return;
        }

        const routeData: RouteData[] = data.routes.map(
          (route: {
            geometry: { coordinates: [number, number][] };
            duration: number;
            distance: number;
          }) => ({
            coordinates: route.geometry.coordinates,
            duration: route.duration,
            distance: route.distance,
          })
        );
        setRoutes(routeData);
      } catch (err) {
        if (!cancelled) {
          setError("Failed to fetch route");
          setRoutes([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchRoute();
    return () => {
      cancelled = true;
    };
  }, [start?.lng, start?.lat, end?.lng, end?.lat]);

  return { routes, isLoading, error };
}
