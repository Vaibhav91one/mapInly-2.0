/**
 * Returns original text when the translate API key is missing.
 * Falls back to English content instead of [locale] prefix for better UX.
 */
export function pseudoTranslate(text: string, _targetLocale: string): string {
  if (!text?.trim()) return text;
  return text;
}
