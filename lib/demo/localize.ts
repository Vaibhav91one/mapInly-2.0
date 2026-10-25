"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-cookie";
import { useDataStore } from "@/stores/data-store";
import type { Event } from "@/types/event";
import type { Forum } from "@/types/forum";
import type { StoredEvent, StoredForum } from "./data";

/** Current UI language, limited to the locales the seed has translations for (else "en"). */
export function useLocale(): string {
  const { i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] ?? "en";
  return (SUPPORTED_LOCALES as readonly string[]).includes(lang) ? lang : "en";
}

/** Overlay the seeded translation for `locale` (if any) on the source-language entity. */
export function localize<T extends StoredEvent | StoredForum>(item: T, locale: string): Omit<T, "translations"> {
  const { translations, ...rest } = item;
  return { ...rest, ...translations[locale] };
}

export function useLocalizedEvents(): Event[] {
  const events = useDataStore((s) => s.events);
  const locale = useLocale();
  return useMemo(() => events.map((e) => localize(e, locale)), [events, locale]);
}

export function useLocalizedForums(): Forum[] {
  const forums = useDataStore((s) => s.forums);
  const locale = useLocale();
  return useMemo(() => forums.map((f) => localize(f, locale)), [forums, locale]);
}
