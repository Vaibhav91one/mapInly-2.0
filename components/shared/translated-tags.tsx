"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTranslate } from "@/hooks/use-translate";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-cookie";

interface TranslatedTagsProps {
  tags: string[];
  sourceLocale?: string;
  className?: string;
}

export function TranslatedTags({ tags, sourceLocale, className }: TranslatedTagsProps) {
  const { i18n } = useTranslation();
  const { translateTexts } = useTranslate();
  const [displayMap, setDisplayMap] = useState<Map<string, string>>(new Map());

  const targetLocale = (
    SUPPORTED_LOCALES as readonly string[]
  ).includes((i18n.language?.split("-")[0] ?? "en") as string)
    ? (i18n.language?.split("-")[0] ?? "en")
    : "en";

  const resolvedSourceLocale = sourceLocale ?? "en";

  useEffect(() => {
    if (targetLocale === resolvedSourceLocale || !tags?.length) {
      const m = new Map<string, string>();
      tags.forEach((t) => m.set(t, t));
      setDisplayMap(m);
      return;
    }
    translateTexts(tags, resolvedSourceLocale).then((translations) => {
      const m = new Map<string, string>();
      tags.forEach((tag, i) => {
        m.set(tag, translations[i] ?? tag);
      });
      setDisplayMap(m);
    });
  }, [tags, targetLocale, resolvedSourceLocale, translateTexts]);

  return (
    <>
      {tags.map((tag) => (
        <span key={tag} className={className ?? undefined}>
          #{displayMap.get(tag) ?? tag}
        </span>
      ))}
    </>
  );
}
