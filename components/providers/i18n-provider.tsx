"use client";

import { useLayoutEffect } from "react";
import { I18nextProvider } from "react-i18next";
import "@/lib/i18n/config";
import i18n from "i18next";
import { getLocaleFromCookie } from "@/lib/i18n/locale-cookie";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const cookieLocale = getLocaleFromCookie();
    if (cookieLocale) {
      i18n.changeLanguage(cookieLocale);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
