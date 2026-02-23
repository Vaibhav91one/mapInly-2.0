"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StaticMeshGradient } from "@paper-design/shaders-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TranslatedTags } from "@/components/shared/translated-tags";

function isGradient(src: string): boolean {
  return src?.startsWith("gradient:") ?? false;
}

function parseGradientColors(src: string): string[] {
  const colors = src.slice(9).split(",").map((c) => c.trim());
  return colors.length === 4 ? colors : ["#b8cd65", "#6200ff", "#e2a3ff", "#ff99fd"];
}

interface EventCardProps {
  title: string;
  /** @deprecated Use tagline + shortDescription. Fallback for backward compatibility. */
  description?: string;
  tagline?: string;
  shortDescription?: string;
  date: string;
  location: string;
  tags: string[];
  image: string;
  imageOverlay?: string;
  href?: string;
  /** When true, applies disabled/muted styling */
  isPast?: boolean;
  sourceLocale?: string;
  className?: string;
}

export function EventCard({
  title,
  description,
  tagline,
  shortDescription,
  date,
  location,
  tags,
  image,
  imageOverlay,
  href = "#",
  isPast = false,
  sourceLocale,
  className,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayDescription = shortDescription ?? description ?? "";

  return (
    <article
      className={cn(
        "group/card flex w-full flex-col gap-0 overflow-hidden rounded-none bg-secondary/50 pr-0 sm:flex-row sm:pr-6 transition-colors",
        isPast ? "opacity-60 hover:bg-secondary/50" : "hover:bg-secondary/70",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image or gradient - full width when stacked, left side when row */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-64 sm:w-48 md:h-80 md:w-56 lg:h-56 lg:w-64">
        {isGradient(image) ? (
          <div className="absolute inset-0 w-full h-full">
            <StaticMeshGradient
              width="100%"
              height="100%"
              fit="cover"
              colors={parseGradientColors(image)}
              positions={2}
              waveX={1}
              waveXShift={0.6}
              waveY={1}
              waveYShift={0.21}
              mixing={0.93}
              grainMixer={0.31}
              grainOverlay={0.48}
              rotation={270}
            />
          </div>
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
          />
        )}
        {imageOverlay && (
          <span
            className="absolute bottom-3 left-3 font-bold text-white/90 text-xl leading-tight md:text-2xl"
            aria-hidden
          >
            {imageOverlay}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col py-4 px-4 sm:px-0 sm:pl-6 sm:pr-0">
        {/* Top: date, location, hashtags */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded border border-white/40 px-2 py-1 text-sm font-medium text-white">
              {date}
            </span>
            <span className="text-sm text-white/80 line-clamp-1 max-w-xs">@{location}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-sm text-primary">
            <TranslatedTags tags={tags} sourceLocale={sourceLocale} />
          </div>
        </div>

        {/* Spacer - pushes title/description/arrow to bottom */}
        <div className="min-h-4 flex-1" />

        {/* Bottom: title, description; arrow at right end (visible on hover) */}
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-regular leading-tight tracking-tight mb-2 text-white md:text-4xl">
              {title}
            </h3>
            <p className="mt-1 text-base line-clamp-2 font-regular leading-tight tracking-tight text-secondary">{displayDescription}</p>
          </div>
          {href && (
            <motion.div
              className={cn("shrink-0", isPast && "opacity-70")}
              animate={
                isPast
                  ? { opacity: 0.7, scale: 1 }
                  : {
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1 : 0.8,
                    }
              }
              transition={{
                duration: 0.5,
                ease: [0.585, 0.039, 0.26, 0.681],
              }}
            >
              <Link
                href={href}
                className="inline-flex rounded-none text-white hover:text-white/90"
                aria-label={`View ${title}`}
              >
                <ArrowUpRight className="size-12 md:size-20" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </article>
  );
}
