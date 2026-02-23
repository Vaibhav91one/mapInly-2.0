"use client";

import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { pseudoTranslate } from "@/lib/i18n/pseudo-translate";

const CACHE_MAX = 200;
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  translated: string;
  ts: number;
}

function cacheKey(text: string, targetLocale: string, sourceLocale: string): string {
  return `${targetLocale}:${sourceLocale}:${text}`;
}

const memoryCache = new Map<string, CacheEntry>();

function pruneCache() {
  if (memoryCache.size <= CACHE_MAX) return;
  const entries = Array.from(memoryCache.entries()).sort(
    (a, b) => a[1].ts - b[1].ts
  );
  const toDelete = entries.slice(0, entries.length - CACHE_MAX);
  toDelete.forEach(([k]) => memoryCache.delete(k));
}

export function useTranslate() {
  const { i18n } = useTranslation();
  const inFlight = useRef<Map<string, Promise<string>>>(new Map());

  const translateText = useCallback(
    async (text: string, sourceLocale?: string): Promise<string> => {
      const targetLocale =
        (i18n.language?.split("-")[0] ?? "en") as string;
      const resolvedSourceLocale = sourceLocale ?? "en";
      if (targetLocale === resolvedSourceLocale || !text?.trim()) return text;

      const key = cacheKey(text, targetLocale, resolvedSourceLocale);
      const cached = memoryCache.get(key);
      if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
        return cached.translated;
      }

      const existing = inFlight.current.get(key);
      if (existing) return existing;

      const promise = (async () => {
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              texts: [text],
              targetLocale,
              sourceLocale: resolvedSourceLocale,
            }),
          });
          const data = await res.json();
          let translated: string;
          if (res.ok && Array.isArray(data.translations)) {
            translated = data.translations[0] ?? text;
          } else {
            translated = pseudoTranslate(text, targetLocale);
          }
          memoryCache.set(key, { translated, ts: Date.now() });
          pruneCache();
          return translated;
        } catch {
          const translated = pseudoTranslate(text, targetLocale);
          memoryCache.set(key, { translated, ts: Date.now() });
          pruneCache();
          return translated;
        } finally {
          inFlight.current.delete(key);
        }
      })();

      inFlight.current.set(key, promise);
      return promise;
    },
    [i18n.language]
  );

  const translateTexts = useCallback(
    async (texts: string[], sourceLocale?: string) => {
      const targetLocale =
        (i18n.language?.split("-")[0] ?? "en") as string;
      const resolvedSourceLocale = sourceLocale ?? "en";
      if (targetLocale === resolvedSourceLocale) return texts;

      const results: string[] = [];
      const toFetch: { index: number; text: string }[] = [];

      for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        if (!text?.trim()) {
          results[i] = text ?? "";
          continue;
        }
        const key = cacheKey(text, targetLocale, resolvedSourceLocale);
        const cached = memoryCache.get(key);
        if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
          results[i] = cached.translated;
        } else {
          results[i] = "";
          toFetch.push({ index: i, text });
        }
      }

      if (toFetch.length === 0) return results;

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            texts: toFetch.map((x) => x.text),
            targetLocale,
            sourceLocale: resolvedSourceLocale,
          }),
        });
        const data = await res.json();
        const translations: string[] = res.ok && Array.isArray(data.translations)
          ? data.translations
          : toFetch.map((x) => pseudoTranslate(x.text, targetLocale));

        for (let j = 0; j < toFetch.length; j++) {
          const { index, text } = toFetch[j];
          const translated = translations[j] ?? text;
          results[index] = translated;
          const key = cacheKey(text, targetLocale, resolvedSourceLocale);
          memoryCache.set(key, { translated, ts: Date.now() });
        }
        pruneCache();
      } catch {
        for (const { index, text } of toFetch) {
          results[index] = pseudoTranslate(text, targetLocale);
        }
      }

      return results;
    },
    [i18n.language]
  );

  return { translateText, translateTexts };
}
