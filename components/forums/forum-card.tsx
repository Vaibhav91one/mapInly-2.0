"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type ForumStatus = "active" | "closed";

interface ForumCardProps {
  title: string;
  /** @deprecated Use tagline + shortDescription. Fallback for backward compatibility. */
  description?: string;
  tagline?: string;
  shortDescription?: string;
  status: ForumStatus;
  tags: string[];
  href?: string;
  className?: string;
}

export function ForumCard({
  title,
  description,
  tagline,
  shortDescription,
  status,
  tags,
  href = "#",
  className,
}: ForumCardProps) {
  const displayDescription = shortDescription ?? description ?? "";
  const [isHovered, setIsHovered] = useState(false);
  const isClosed = status === "closed";
  const statusLabel = isClosed ? "Closed" : "Active";

  return (
    <article
      className={cn(
        "group/card flex w-full gap-0 overflow-hidden rounded-none bg-secondary/50 pr-6 pl-6 py-4 transition-colors",
        isClosed ? "opacity-60 hover:bg-secondary/50" : "hover:bg-secondary/70",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top: status, hashtags */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span
            className={cn(
              "rounded border px-2 py-1 text-sm font-medium",
              status === "active"
                ? "border-primary/60 text-primary"
                : "border-white/40 text-white"
            )}
          >
            {statusLabel}
          </span>
          <div className="flex flex-wrap gap-1.5 text-sm text-primary">
            {tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="min-h-4 flex-1" />

        {/* Bottom: title, description; arrow at right end (visible on hover) */}
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-regular leading-tight tracking-tight text-white md:text-4xl">
              {title}
            </h3>
            <p className="mt-1 text-base font-regular leading-tight tracking-tight text-secondary">
              {displayDescription}
            </p>
          </div>
          {href && (
            <motion.div
              className={cn("shrink-0", isClosed && "opacity-70")}
              animate={
                isClosed
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
                <ArrowUpRight className="size-20" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </article>
  );
}
