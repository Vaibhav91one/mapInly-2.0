"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ScrollRotatingAsterisk from "../custom/ScrollingRotatingAsterisk";

interface CommunityCardProps {
  name: string;
  image?: string;
  href?: string;
  className?: string;
}

export function CommunityCard({
  name,
  image,
  href = "#",
  className,
}: CommunityCardProps) {
  return (
    <div
      className={cn(
        "flex w-[280px] shrink-0 flex-col items-center rounded-none px-6 py-8",
        className
      )}
      // style={{ backgroundColor: "#292929" }}
    >
      {/* <div className="relative size-28 shrink-0 overflow-hidden rounded-none md:size-32">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="128px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/20 text-2xl font-medium text-white">
            {name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div> */}
      {/* <p className="mt-4 text-center text-2xl text-wrap py-12 font-medium text-white">
        {name}
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-none bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
        aria-label={`Join ${name}`}
      >
        Join
        <ArrowUpRight className="size-4 shrink-0" />
      </Link> */}

      <ScrollRotatingAsterisk
        mode="scroll"
        fill="current"
        color="text-white"
        size="size-42"
      />
    </div>
  );
}
