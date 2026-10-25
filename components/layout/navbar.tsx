"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { motion } from "motion/react";
import { keys } from "@/lib/i18n/keys";
import { INTRO, GITHUB_URL, useIntroReady } from "@/lib/intro";
import { ArrowUpRight, Menu, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import ScrollRotatingAsterisk from "../custom/ScrollingRotatingAsterisk";
import { LanguageSwitcher } from "@/components/locale/language-switcher";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const githubClasses = cn(
  "items-center justify-center gap-2",
  "bg-secondary text-secondary-foreground",
  "font-medium text-sm",
  "hover:bg-secondary/90 transition-colors"
);

export function Navbar() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ready = useIntroReady();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 w-full flex"
      initial={{ opacity: 0, y: -24 }}
      animate={ready ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1.2, delay: INTRO.nav, ease: INTRO.ease }}
    >
      {/* Left: Green box - white asterisk only */}
      <div className="flex items-center justify-center min-h-[80px] p-4 bg-primary shrink-0">
      <ScrollRotatingAsterisk
        size="size-8"
        mode="scroll"
        fill="current"
        color="text-white"
      />
      </div>

      {/* Mapinly text - outside green box */}
      <div className="flex flex-col justify-center min-h-[80px] pl-4 pr-2 md:pl-6 md:pr-4 bg-black/70 backdrop-blur-md text-white shrink-0">
        <Link href="/">
          <span className="font-semibold text-base md:text-lg leading-tight">{t(keys.nav.brand)}</span>
        </Link>
      </div>

      {/* Center: spacer (no in-app routes on the landing page) */}
      <div className="flex-1 hidden md:block min-h-[80px] bg-black/70 backdrop-blur-md" />

      {/* Right: Language + GitHub (desktop) or hamburger (mobile); on mobile grows to fill width so navbar is full width */}
      <div className="flex flex-1 min-w-0 items-stretch justify-end bg-black/70 backdrop-blur-md text-white md:flex-initial md:shrink-0 md:justify-start md:items-center">
        <div className="hidden md:flex items-center gap-4 px-4 md:px-6">
          <LanguageSwitcher />
        </div>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("hidden md:flex px-4 md:px-6 self-stretch", githubClasses)}
        >
          <Star className="size-4" />
          {t(keys.nav.starOnGithub)}
          <ArrowUpRight className="size-4" />
        </a>

        {/* Mobile menu: hamburger + sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="md:hidden flex items-center justify-center p-4 text-white focus:outline-none"
              aria-label={t(keys.nav.openUserMenu)}
            >
              <Menu className="size-6" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-sm border-white/20 bg-black/95 text-white rounded-none p-0"
          >
            <div className="flex flex-col gap-6 px-6 pt-14 pb-8">
              <LanguageSwitcher />
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className={cn("flex py-3 mt-2 rounded-none", githubClasses)}
              >
                <Star className="size-4" />
                {t(keys.nav.starOnGithub)}
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}
