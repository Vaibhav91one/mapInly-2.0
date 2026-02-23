import { cookies } from "next/headers";
import { SUPPORTED_LOCALES } from "./locale-cookie";

const LOCALE_COOKIE = "locale";

export async function getLocaleFromRequest(): Promise<string> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (
    localeCookie &&
    SUPPORTED_LOCALES.includes(localeCookie as (typeof SUPPORTED_LOCALES)[number])
  ) {
    return localeCookie;
  }
  return "en";
}
