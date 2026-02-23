"use client";

import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { keys } from "@/lib/i18n/keys";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n/locale-cookie";

const LOCALE_LABEL_KEYS: Record<SupportedLocale, string> = {
  en: keys.locale.en,
  es: keys.locale.es,
  de: keys.locale.de,
  fr: keys.locale.fr,
  it: keys.locale.it,
  pt: keys.locale.pt,
  zh: keys.locale.zh,
};

interface LanguageSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (locale: SupportedLocale) => void;
}

export function LanguageSelectionDialog({
  open,
  onOpenChange,
  onSelect,
}: LanguageSelectionDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border-zinc-800 bg-zinc-950 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {t(keys.locale.chooseLanguage)}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {SUPPORTED_LOCALES.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => onSelect(locale)}
              className="w-full rounded-none border border-zinc-800 bg-zinc-900 px-4 py-3 text-left font-medium transition-colors hover:bg-zinc-800 hover:border-zinc-700"
            >
              {t(LOCALE_LABEL_KEYS[locale])}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
