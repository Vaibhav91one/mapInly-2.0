const LOCALE_COOKIE = "locale";
const HAS_SEEN_DIALOG = "hasSeenLocaleDialog";

export const SUPPORTED_LOCALES = ["en", "es", "de", "fr", "it", "pt", "zh"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function getLocaleFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setLocaleCookie(locale: string, days = 365): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; path=/; expires=${expires}; SameSite=Lax`;
}

export function hasSeenLocaleDialog(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(HAS_SEEN_DIALOG) === "true";
}

export function setHasSeenLocaleDialog(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(HAS_SEEN_DIALOG, "true");
}
