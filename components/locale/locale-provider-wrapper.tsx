"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import i18n from "i18next";
import {
  getLocaleFromCookie,
  hasSeenLocaleDialog,
  setLocaleCookie,
  setHasSeenLocaleDialog,
  type SupportedLocale,
} from "@/lib/i18n/locale-cookie";
import { INTRO } from "@/lib/intro";
import { LanguageSelectionDialog } from "./language-selection-dialog";

interface LocaleProviderWrapperProps {
  children: React.ReactNode;
}

export function LocaleProviderWrapper({ children }: LocaleProviderWrapperProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const cookieLocale = getLocaleFromCookie();
    if (cookieLocale) {
      i18n.changeLanguage(cookieLocale).then(() => setInitialized(true));
      return;
    }
    setInitialized(true);
    if (!hasSeenLocaleDialog()) {
      // wait for the hero intro to finish before asking
      const id = setTimeout(() => setShowDialog(true), (INTRO.nav + 1.2) * 1000);
      return () => clearTimeout(id);
    }
  }, []);

  function handleLocaleSelect(locale: SupportedLocale) {
    setLocaleCookie(locale);
    setHasSeenLocaleDialog();
    i18n.changeLanguage(locale);
    setShowDialog(false);
    router.refresh();
  }

  return (
    <>
      {children}
      {initialized && (
        <LanguageSelectionDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          onSelect={handleLocaleSelect}
        />
      )}
    </>
  );
}
