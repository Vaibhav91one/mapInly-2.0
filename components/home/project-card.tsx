"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import ScrollRotatingAsterisk from "@/components/custom/ScrollingRotatingAsterisk";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";

interface ProjectCardProps {
  index?: number;
  title: string;
  description?: string;
  image: string;
  href?: string;
  variant: "simple" | "detailed" | "organizer";
  timing?: string;
  location?: string;
  locationUrl?: string;
}

export function ProjectCard({
  index,
  title,
  description,
  image,
  href,
  variant,
  timing,
  location,
  locationUrl,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isOrganizer = variant === "organizer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="group/card h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="relative aspect-[4/5] h-full w-full overflow-hidden border-0 rounded-none p-0 gap-0 shadow-none">
        {/* Image with zoom on hover */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {!isOrganizer && index != null && (
          <span
            className="absolute left-4 top-4 z-10 text-6xl font-regular tracking-tight leading-tight text-white/90"
            aria-hidden
          >
            {index}
          </span>
        )}

        {isOrganizer ? (
          /* Organizer variant: white band (same shape as project card overlay) with name only */
          <div className="absolute bottom-0 right-0 z-10 flex min-h-[80px] w-[85%] max-w-sm items-center bg-white px-6 py-4">
            <h3 className="text-base font-medium leading-tight tracking-tight text-black md:text-lg">
              {title}
            </h3>
          </div>
        ) : (
          /* Overlay card: 1/3 asterisk + 2/3 title/description/timing/location, slides up when project card is hovered */
          <motion.div
            className="absolute bottom-0 right-0 z-10 flex min-h-[180px] w-[85%] max-w-sm bg-white"
            animate={{
              y: isHovered ? 0 : "52%",
            }}
            transition={{
              duration: 0.5,
              ease: [0.585, 0.039, 0.26, 0.681],
            }}
          >
            {/* 1/3: Asterisk */}
            <div className="flex w-1/4 shrink-0 items-start justify-start px-8 py-8">
              <ScrollRotatingAsterisk
                size="size-8"
                mode="default"
                fill="current"
                color="text-black"
              />
            </div>
            {/* 2/3: Title, description, timing, location, arrow */}
            <div className="relative flex w-3/4 flex-1 flex-col justify-between px-8 py-4 pb-14">
              <div className="flex min-h-[88px] flex-1 flex-col">
                <h3 className="min-h-[2.75rem] text-base font-regular leading-tight tracking-tight text-black md:text-2xl">
                  {title}
                </h3>
                {description ? (
                  <motion.p
                    className="mt-2 min-h-[4rem] flex-1 line-clamp-4 text-sm font-regular text-black/80 leading-tight tracking-tight"
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.585, 0.039, 0.26, 0.681],
                      delay: isHovered ? 0.1 : 0,
                    }}
                  >
                    {description}
                  </motion.p>
                ) : (
                  <div className="mt-2 min-h-[5rem] flex-1" />
                )}
              </div>
              {(timing || location) && (
                <motion.div
                  className="mt-2 flex flex-col gap-y-1.5 text-xs font-medium text-black/70"
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.585, 0.039, 0.26, 0.681],
                    delay: isHovered ? 0.15 : 0,
                  }}
                >
                  {timing && <span>{timing}</span>}
                  {location && (
                    locationUrl ? (
                      <a
                        href={locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-1.5 border-b border-black/40 pb-0.5 transition-colors hover:border-black hover:text-black"
                        aria-label={`View ${location} on Google Maps`}
                      >
                        <MapPin className="size-3.5 shrink-0" />
                        {location}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 border-b border-black/40 pb-0.5">
                        <MapPin className="size-3.5 shrink-0" />
                        {location}
                      </span>
                    )
                  )}
                </motion.div>
              )}
              {href && (
                <Link
                  href={href}
                  className="absolute bottom-4 right-0 inline-flex size-8 items-center justify-center rounded-none text-black mr-10"
                  aria-label={`View ${title}`}
                >
                  <ArrowUpRight className="size-8" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
