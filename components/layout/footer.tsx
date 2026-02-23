"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ScrollRotatingAsterisk from "@/components/custom/ScrollingRotatingAsterisk";
import { sectionClasses } from "@/lib/layout-classes";
import { cn } from "@/lib/utils";
import { keys } from "@/lib/i18n/keys";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={cn(sectionClasses, "bg-black")}>
      {/* Primary content: left (tagline + CTA) | right (links) */}
      <div className="flex flex-col gap-12 px-6 py-26 md:flex-row md:items-start md:justify-between md:gap-16 md:px-8 lg:px-12">
        {/* Left: Tagline + Get Started */}
        <div className="flex flex-col gap-6">
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            {t(keys.footer.tagline)}
          </p>
          <Link
            href="/get-started"
            className="inline-flex w-fit items-center gap-2 bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
            aria-label={t(keys.footer.getStartedAria)}
          >
            {t(keys.footer.getStarted)}
            <ArrowUpRight className="size-4 shrink-0" />
          </Link>
        </div>

        {/* Right: All links */}
        <div className="flex flex-wrap gap-12 md:gap-16">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t(keys.footer.legal)}
            </h3>
            <nav className="flex flex-col gap-3">
              <Link href="/privacy" className="text-sm text-white/70 hover:text-white">
                {t(keys.footer.privacyPolicy)}
              </Link>
              <Link href="/terms" className="text-sm text-white/70 hover:text-white">
                {t(keys.footer.termsConditions)}
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t(keys.footer.pages)}
            </h3>
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-sm text-white/70 hover:text-white">
                {t(keys.footer.home)}
              </Link>
              <Link href="/events" className="text-sm text-white/70 hover:text-white">
                {t(keys.nav.events)}
              </Link>
              <Link href="/forums" className="text-sm text-white/70 hover:text-white">
                {t(keys.nav.forums)}
              </Link>
              <Link href="/dashboard" className="text-sm text-white/70 hover:text-white">
                {t(keys.nav.dashboard)}
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t(keys.footer.socials)}
            </h3>
            <nav className="flex flex-col gap-3">
              <Link href="https://github.com/Vaibhav91one" className="text-sm text-white/70 hover:text-white" target="_blank" rel="noopener noreferrer">
                {t(keys.footer.github)}
              </Link>
              <Link href="https://twitter.com/VrsatileVaibhav" className="text-sm text-white/70 hover:text-white" target="_blank" rel="noopener noreferrer">
                {t(keys.footer.twitter)}
              </Link>
              <Link href="https://www.linkedin.com/in/vaibhav-tomar-a6b2b6255/" className="text-sm text-white/70 hover:text-white" target="_blank" rel="noopener noreferrer">
                {t(keys.footer.linkedin)}
              </Link>
              <Link href="https://portfolio-v2-rouge-ten-80.vercel.app/" className="text-sm text-white/70 hover:text-white" target="_blank" rel="noopener noreferrer">
                Portfolio
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* MapInly section - asterisk + big text together at bottom */}
      <div className="flex min-h-[30vh] flex-col items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
          <ScrollRotatingAsterisk
            size="size-20 md:size-24"
            mode="default"
            fill="current"
            color="text-white"
          />
          <h2 className="text-5xl font-light tracking-tight text-white md:text-7xl lg:text-8xl">
            {t(keys.nav.brand)}
          </h2>
        </div>
      </div>
    </footer>
  );
}
