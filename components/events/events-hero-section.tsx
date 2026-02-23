"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";
import { keys } from "@/lib/i18n/keys";

export function EventsHeroSection() {
  const { t } = useTranslation();
  return (
    <section
      className={cn(
        sectionClasses,
        "h-[60dvh] bg-foreground"
      )}
    >
      <div
        className={cn(
          sectionInnerClasses,
          "relative z-10 flex min-h-[60dvh] flex-col items-start justify-between gap-8"
        )}
      >
        <p className="text-sm font-regular leading-tight tracking-tight text-white md:text-2xl">
          <Link href="/" className="hover:text-background transition-colors">
            /
          </Link>{" "}
          <span className="text-white">{t(keys.eventsHero.breadcrumb)}</span>
        </p>
        <h1 className="text-6xl font-regular tracking-tight leading-tight text-background md:text-8xl lg:text-9xl">
          {t(keys.eventsHero.title)}
        </h1>
      </div>
    </section>
  );
}
