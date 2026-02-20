"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface UpcomingEventCardProps {
  day: number;
  dayName: string;
  title: string;
  subtitle: string;
  timeRange: string;
  location?: string;
  locationUrl?: string;
  dateBlockColor?: "primary" | "blue" | "purple";
  href?: string;
}

const dateBlockColors = {
  primary: "bg-primary text-primary-foreground",
  blue: "bg-blue-500 text-white",
  purple: "bg-purple-500 text-white",
};

export function UpcomingEventCard({
  day,
  dayName,
  title,
  subtitle,
  timeRange,
  location,
  locationUrl,
  dateBlockColor = "primary",
  href,
}: UpcomingEventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <Card
      className={cn(
        "group/card overflow-hidden rounded-none border border-white/20 bg-white/10 p-0 gap-0 shadow-none text-white transition-colors hover:bg-white/15",
        href && "cursor-pointer"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="flex min-h-[18vh] p-0">
        {/* Left: date block - full height */}
        <div
          className={cn(
            "flex min-w-[10vh] flex-col items-center justify-center px-3 self-stretch",
            dateBlockColors[dateBlockColor]
          )}
        >
          <span className="text-2xl font-bold leading-none">{day}</span>
          <span className="text-xs font-medium opacity-90">{dayName}</span>
        </div>

        {/* Right: title at top, time and place at bottom in 2 rows, arrow on hover */}
        <div className="flex min-w-0 flex-1 flex-col p-6">
          <h3 className="text-lg font-regular leading-tight tracking-tight text-white">
            {title}
          </h3>
          <div className="min-h-4 flex-1" />
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2 text-xs text-white/60">
              <span>{timeRange}</span>
              {location && (
                locationUrl ? (
                  <a
                    href={locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-1 hover:text-white/90"
                    aria-label={`View ${location} on map`}
                  >
                    <MapPin className="size-3.5 shrink-0" />
                    {location}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 shrink-0" />
                    {location}
                  </span>
                )
              )}
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
                className="inline-flex text-white hover:text-white/90"
                aria-label={`View ${title}`}
              >
                <ArrowUpRight className="size-8" />
              </Link>
            </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return content;
  }

  return content;
}
