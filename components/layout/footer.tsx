"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ScrollRotatingAsterisk from "@/components/custom/ScrollingRotatingAsterisk";
import { sectionClasses } from "@/lib/layout-classes";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className={cn(sectionClasses, "bg-black")}>
      {/* Primary content: left (tagline + CTA) | right (links) */}
      <div className="flex flex-col gap-12 px-6 py-26 md:flex-row md:items-start md:justify-between md:gap-16 md:px-8 lg:px-12">
        {/* Left: Tagline + Get Started */}
        <div className="flex flex-col gap-6">
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            Discover events on the map, join communities, and connect with
            people near you. Multilingual events and community platform.
          </p>
          <Link
            href="/get-started"
            className="inline-flex w-fit items-center gap-2 bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
            aria-label="Get started"
          >
            Get Started
            <ArrowUpRight className="size-4 shrink-0" />
          </Link>
        </div>

        {/* Right: All links */}
        <div className="flex flex-wrap gap-12 md:gap-16">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <nav className="flex flex-col gap-3">
              <Link href="/privacy" className="text-sm text-white/70 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-white/70 hover:text-white">
                Terms & Conditions
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Pages
            </h3>
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-sm text-white/70 hover:text-white">
                Home
              </Link>
              <Link href="/events" className="text-sm text-white/70 hover:text-white">
                Events
              </Link>
              <Link href="/forums" className="text-sm text-white/70 hover:text-white">
                Forums
              </Link>
              <Link href="/dashboard" className="text-sm text-white/70 hover:text-white">
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Socials
            </h3>
            <nav className="flex flex-col gap-3">
              <Link href="#" className="text-sm text-white/70 hover:text-white" target="_blank" rel="noopener noreferrer">
                Twitter
              </Link>
              <Link href="#" className="text-sm text-white/70 hover:text-white" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </Link>
              <Link href="#" className="text-sm text-white/70 hover:text-white" target="_blank" rel="noopener noreferrer">
                GitHub
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
            MapInly
          </h2>
        </div>
      </div>
    </footer>
  );
}
