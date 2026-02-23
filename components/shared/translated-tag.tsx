"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTranslate } from "@/hooks/use-translate";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-cookie";

interface TranslatedTagProps {
  tag: string;
  sourceLocale?: string;
  className?: string;
}

export function TranslatedTag({ tag, sourceLocale, className }: TranslatedTagProps) {
  const { i18n } = useTranslation();
  const { translateText } = useTranslate();
  const [displayTag, setDisplayTag] = useState(tag);

  const targetLocale = (
    SUPPORTED_LOCALES as readonly string[]
  ).includes((i18n.language?.split("-")[0] ?? "en") as string)
    ? (i18n.language?.split("-")[0] ?? "en")
    : "en";

  const resolvedSourceLocale = sourceLocale ?? "en";

  useEffect(() => {
    if (targetLocale === resolvedSourceLocale || !tag?.trim()) {
      setDisplayTag(tag);
      return;
    }
    translateText(tag, resolvedSourceLocale).then(setDisplayTag);
  }, [tag, targetLocale, resolvedSourceLocale, translateText]);

  return <span className={className}>#{displayTag}</span>;
}
