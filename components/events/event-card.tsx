"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  tags: string[];
  image: string;
  imageOverlay?: string;
  href?: string;
  className?: string;
}

export function EventCard({
  title,
  description,
  date,
  location,
  tags,
  image,
  imageOverlay,
  href = "#",
  className,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className={cn(
        "group/card flex w-full gap-0 overflow-hidden rounded-none bg-secondary/50 pr-6 transition-colors hover:bg-secondary/70",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image - full left side, no padding */}
      <div className="relative h-64 w-48 shrink-0 overflow-hidden md:h-80 md:w-56 lg:h-56 lg:w-64">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
        />
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
      <div className="flex min-w-0 flex-1 flex-col py-4 pl-6">
        {/* Top: date, location, hashtags */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded border border-white/40 px-2 py-1 text-sm font-medium text-white">
              {date}
            </span>
            <span className="text-sm text-white/80">@{location}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-sm text-primary">
            {tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>

        {/* Spacer - pushes title/description/arrow to bottom */}
        <div className="min-h-4 flex-1" />

        {/* Bottom: title, description; arrow at right end (visible on hover) */}
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-regular leading-tight tracking-tight text-white md:text-4xl">
              {title}
            </h3>
            <p className="mt-1 text-base font-regular leading-tight tracking-tight text-secondary">{description}</p>
          </div>
          {href && (
            <motion.div
              className="shrink-0"
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
              }}
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
                <ArrowUpRight className="size-20" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </article>
  );
}
