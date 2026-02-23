import { NextResponse } from "next/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";
import { pseudoTranslate } from "@/lib/i18n/pseudo-translate";

export const dynamic = "force-dynamic";

const SUPPORTED_LOCALES = ["en", "es", "de", "fr", "it", "pt", "zh"] as const;

export async function POST(request: Request) {
  const apiKey = process.env.LINGODOTDEV_API_KEY;

  let body: { texts: string[]; targetLocale: string; sourceLocale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { texts, targetLocale, sourceLocale = "en" } = body;

  if (!Array.isArray(texts)) {
    return NextResponse.json(
      { error: "texts must be an array of strings" },
      { status: 400 }
    );
  }

  if (
    typeof targetLocale !== "string" ||
    !SUPPORTED_LOCALES.includes(targetLocale as (typeof SUPPORTED_LOCALES)[number])
  ) {
    return NextResponse.json(
      { error: `targetLocale must be one of: ${SUPPORTED_LOCALES.join(", ")}` },
      { status: 400 }
    );
  }

  if (targetLocale === sourceLocale) {
    return NextResponse.json({ translations: texts });
  }

  const validTexts = texts.filter(
    (t): t is string => typeof t === "string" && t.trim().length > 0
  );

  if (validTexts.length === 0) {
    return NextResponse.json({ translations: [] });
  }

  if (!apiKey) {
    const translations = validTexts.map((t) => pseudoTranslate(t, targetLocale));
    return NextResponse.json({ translations });
  }

  try {
    const lingo = new LingoDotDevEngine({ apiKey });
    const translations: string[] = [];
    for (const text of validTexts) {
      const t = await lingo.localizeText(text, {
        sourceLocale,
        targetLocale,
      });
      translations.push(t);
    }
    return NextResponse.json({ translations });
  } catch (err) {
    console.error("Translate API error:", err);
    const translations = validTexts.map((t) => pseudoTranslate(t, targetLocale));
    return NextResponse.json({ translations });
  }
}
