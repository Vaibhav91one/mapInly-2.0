const LOCALE_MAP: Record<string, string> = {
  zh: "zh-CN",
  pt: "pt-BR",
};

function resolveLocale(locale: string): string {
  return LOCALE_MAP[locale] ?? locale;
}

export function formatDate(
  date: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    dateStyle: options?.dateStyle ?? "medium",
    ...options,
  }).format(date);
}

export function formatNumber(
  num: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(resolveLocale(locale), options).format(num);
}

const RELATIVE_UNITS: Intl.RelativeTimeFormatUnit[] = [
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
  "year",
];

export function formatRelativeTime(date: Date, locale: string): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  const rtf = new Intl.RelativeTimeFormat(resolveLocale(locale), {
    numeric: "auto",
  });

  const abs = Math.abs;
  if (abs(diffYear) >= 1) return rtf.format(-diffYear, "year");
  if (abs(diffMonth) >= 1) return rtf.format(-diffMonth, "month");
  if (abs(diffWeek) >= 1) return rtf.format(-diffWeek, "week");
  if (abs(diffDay) >= 1) return rtf.format(-diffDay, "day");
  if (abs(diffHour) >= 1) return rtf.format(-diffHour, "hour");
  if (abs(diffMin) >= 1) return rtf.format(-diffMin, "minute");
  return rtf.format(-diffSec, "second");
}
