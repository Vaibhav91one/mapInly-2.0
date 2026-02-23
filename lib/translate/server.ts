import { LingoDotDevEngine } from "lingo.dev/sdk";
import { pseudoTranslate } from "@/lib/i18n/pseudo-translate";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-cookie";

export async function translateTexts(
  texts: string[],
  targetLocale: string,
  sourceLocale = "en"
): Promise<string[]> {
  if (targetLocale === sourceLocale) return texts;
  if (
    !SUPPORTED_LOCALES.includes(targetLocale as (typeof SUPPORTED_LOCALES)[number])
  ) {
    return texts;
  }

  const indicesToTranslate: number[] = [];
  const validTexts: string[] = [];
  texts.forEach((t, i) => {
    if (typeof t === "string" && t.trim().length > 0) {
      indicesToTranslate.push(i);
      validTexts.push(t);
    }
  });
  if (validTexts.length === 0) return texts;

  const apiKey = process.env.LINGODOTDEV_API_KEY;
  let translated: string[];
  if (!apiKey) {
    translated = validTexts.map((t) => pseudoTranslate(t, targetLocale));
  } else {
    try {
      const lingo = new LingoDotDevEngine({ apiKey });
      translated = await Promise.all(
        validTexts.map((text) =>
          lingo.localizeText(text, { sourceLocale, targetLocale })
        )
      );
    } catch (err) {
      console.error("Translate server error:", err);
      translated = validTexts.map((t) => pseudoTranslate(t, targetLocale));
    }
  }

  const result = [...texts];
  indicesToTranslate.forEach((idx, i) => {
    result[idx] = translated[i];
  });
  return result;
}
