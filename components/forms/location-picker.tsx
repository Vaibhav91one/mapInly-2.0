"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import {
  Map,
  MapMarker,
  MapControls,
  MapClickHandler,
  MarkerContent,
  useMap,
} from "@/components/ui/map";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { EventLocation } from "@/types/event";

function FlyToOnChange({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const { map, isLoaded } = useMap();
  const prevCenterRef = useRef<string>("");

  useEffect(() => {
    if (!isLoaded || !map) return;
    const key = `${center[0]}-${center[1]}`;
    if (prevCenterRef.current === key) return;
    prevCenterRef.current = key;
    map.flyTo({ center, zoom, duration: 800 });
  }, [map, isLoaded, center, zoom]);

  return null;
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const DEFAULT_CENTER: [number, number] = [8.9517, 46.0037]; // Lugano
const DEFAULT_ZOOM = 12;

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  place_id: number;
}

function buildMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
}

interface LocationPickerProps {
  value: EventLocation | null;
  onChange: (location: EventLocation | null) => void;
  className?: string;
  inputClassName?: string;
}

export function LocationPicker({
  value,
  onChange,
  className,
  inputClassName,
}: LocationPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);
  const userTypingRef = useRef(false);

  const reverseGeocode = useCallback(
    async (lat: number, lon: number): Promise<string> => {
      try {
        const params = new URLSearchParams({
          lat: String(lat),
          lon: String(lon),
          format: "json",
        });
        const res = await fetch(`${NOMINATIM_REVERSE_URL}?${params}`, {
          headers: {
            "User-Agent": "Mapinly/1.0 (contact@mapinly.app)",
          },
        });
        const data = (await res.json()) as { display_name?: string };
        return data.display_name ?? `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
      } catch {
        return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
      }
    },
    []
  );

  const center: [number, number] = value
    ? [value.longitude, value.latitude]
    : DEFAULT_CENTER;

  useEffect(() => {
    if (value?.displayName) {
      setQuery(value.displayName);
    } else {
      setQuery("");
    }
    userTypingRef.current = false;
    setShowResults(false);
  }, [value?.displayName, value?.latitude, value?.longitude]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    searchAbortRef.current?.abort();
    searchAbortRef.current = new AbortController();
    setIsSearching(true);
    try {
      const params = new URLSearchParams({
        q: q.trim(),
        format: "json",
        limit: "5",
        addressdetails: "0",
      });
      const res = await fetch(`${NOMINATIM_URL}?${params}`, {
        headers: {
          "User-Agent": "Mapinly/1.0 (contact@mapinly.app)",
        },
        signal: searchAbortRef.current.signal,
      });
      const data: NominatimResult[] = await res.json();
      setResults(data);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setResults([]);
      }
    } finally {
      setIsSearching(false);
      searchAbortRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      search(query);
      if (userTypingRef.current) {
        setShowResults(true);
      }
      userTypingRef.current = false;
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  const selectResult = (r: NominatimResult) => {
    const lat = parseFloat(r.lat);
    const lon = parseFloat(r.lon);
    const location: EventLocation = {
      displayName: r.display_name,
      latitude: lat,
      longitude: lon,
      mapsUrl: buildMapsUrl(lat, lon),
    };
    onChange(location);
    setQuery(r.display_name);
    setShowResults(false);
  };

  const handleDragEnd = (lngLat: { lng: number; lat: number }) => {
    const location: EventLocation = {
      displayName: value?.displayName ?? `${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}`,
      latitude: lngLat.lat,
      longitude: lngLat.lng,
      mapsUrl: buildMapsUrl(lngLat.lat, lngLat.lng),
    };
    onChange(location);
  };

  const handleLocate = (coords: { longitude: number; latitude: number }) => {
    const location: EventLocation = {
      displayName: value?.displayName ?? "Current location",
      latitude: coords.latitude,
      longitude: coords.longitude,
      mapsUrl: buildMapsUrl(coords.latitude, coords.longitude),
    };
    onChange(location);
  };

  const handleMapClick = useCallback(
    async (lngLat: { lng: number; lat: number }) => {
      userTypingRef.current = false;
      setShowResults(false);
      // Set immediately with coordinates as placeholder
      const tempLocation: EventLocation = {
        displayName: `${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}`,
        latitude: lngLat.lat,
        longitude: lngLat.lng,
        mapsUrl: buildMapsUrl(lngLat.lat, lngLat.lng),
      };
      onChange(tempLocation);
      setQuery(tempLocation.displayName);

      // Reverse geocode to get a proper address
      const displayName = await reverseGeocode(lngLat.lat, lngLat.lng);
      onChange({
        ...tempLocation,
        displayName,
      });
      setQuery(displayName);
    },
    [onChange, reverseGeocode]
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-2">
        <Label htmlFor="location-search">Search location</Label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="location-search"
            type="search"
            placeholder="Search for a place..."
            value={query}
            onChange={(e) => {
              userTypingRef.current = true;
              setQuery(e.target.value);
            }}
            onFocus={() => results.length > 0 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className={cn("pl-9 rounded-none", inputClassName)}
          />
          {showResults && results.length > 0 && (
            <ul
              className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-auto rounded-md border bg-popover py-1 text-popover-foreground shadow-md"
              role="listbox"
            >
              {results.map((r) => (
                <li
                  key={r.place_id}
                  role="option"
                  tabIndex={0}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectResult(r);
                  }}
                >
                  {r.display_name}
                </li>
              ))}
            </ul>
          )}
          {isSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              Searching...
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Or click on the map to set a location
      </p>
      <div className="h-[240px] w-full overflow-hidden rounded-md border">
        <Map
          center={center}
          zoom={value ? 14 : DEFAULT_ZOOM}
          className="h-full w-full cursor-crosshair"
          theme="dark"
        >
          <FlyToOnChange center={center} zoom={value ? 14 : DEFAULT_ZOOM} />
          <MapClickHandler onClick={handleMapClick} />
          <MapControls showLocate onLocate={handleLocate} />
          {value && (
            <MapMarker
              longitude={value.longitude}
              latitude={value.latitude}
              draggable
              onDragEnd={handleDragEnd}
            >
              <MarkerContent />
            </MapMarker>
          )}
        </Map>
      </div>
      {value && (
        <p className="text-xs text-muted-foreground">
          Selected: {value.displayName}
        </p>
      )}
    </div>
  );
}
