"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { keys } from "@/lib/i18n/keys";
import {
  SUPPORTED_LOCALES,
  type SupportedLocale,
  setLocaleCookie,
  setHasSeenLocaleDialog,
} from "@/lib/i18n/locale-cookie";

const LOCALE_LABEL_KEYS: Record<SupportedLocale, string> = {
  en: keys.locale.en,
  es: keys.locale.es,
  de: keys.locale.de,
  fr: keys.locale.fr,
  it: keys.locale.it,
  pt: keys.locale.pt,
  zh: keys.locale.zh,
};

export function LanguageSwitcher() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  async function handleSelect(locale: SupportedLocale) {
    setLocaleCookie(locale);
    setHasSeenLocaleDialog();
    await i18n.changeLanguage(locale);
    setOpen(false);
    router.refresh();

    try {
      await fetch("/api/users/locale", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferredLocale: locale }),
      });
    } catch {
      // Ignore - user may be anonymous
    }
  }

  const currentLocale = (i18n.language?.split("-")[0] ?? "en") as SupportedLocale;
  const displayLocale = SUPPORTED_LOCALES.includes(currentLocale)
    ? currentLocale.toUpperCase()
    : "EN";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 text-sm hover:text-white/80 transition-colors"
          aria-label={t(keys.nav.selectLanguage)}
        >
          {displayLocale}
          <ChevronDown className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-40 border border-white/20 rounded-none bg-black/90 text-white backdrop-blur-md"
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleSelect(locale)}
            className="flex cursor-pointer items-center gap-2 focus:bg-white/10 focus:text-white data-highlighted:bg-white/10"
          >
            {t(LOCALE_LABEL_KEYS[locale])}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
