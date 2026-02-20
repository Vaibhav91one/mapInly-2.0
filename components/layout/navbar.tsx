"use client";

import Link from "next/link";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ScrollRotatingAsterisk from "../custom/ScrollingRotatingAsterisk";

const navItems = [
  { label: "L*3", href: "/about", text: "About Us", active: true },
  { label: "Creating", href: "/projects", text: "Projects", active: false },
  { label: "Sharing", href: "/events", text: "Events", active: false },
  { label: "Innovation", href: "/research", text: "Research", active: true },
];

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full flex">
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
      <div className="flex flex-col justify-center min-h-[80px] pl-6 pr-4 bg-black/70 backdrop-blur-md text-white shrink-0">
        <span className="font-semibold text-lg leading-tight">Mapinly</span>
        {/* <span className="text-white/90 text-sm leading-tight">Living Lab</span> */}
      </div>

      {/* Center: Nav links */}
      <nav
        className={cn(
          "flex-1 flex items-center justify-center gap-10 px-8 min-h-[80px]",
          "bg-black/70 backdrop-blur-md text-white"
        )}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col gap-0.5 group"
          >
            <span
              className={cn(
                "text-xs",
                item.active ? "text-white/70" : "text-white/50"
              )}
            >
              {item.label}
            </span>
            <span
              className={cn(
                "font-medium transition-colors",
                item.active ? "text-white" : "text-white/60 group-hover:text-white"
              )}
            >
              {item.text}
            </span>
          </Link>
        ))}
      </nav>

      {/* Right: Language + Contact */}
      <div className="flex items-stretch shrink-0 bg-black/70 backdrop-blur-md text-white">
        <div className="flex items-center gap-4 px-6">
          <button
            type="button"
            className="flex items-center gap-1 text-sm hover:text-white/80 transition-colors"
            aria-label="Select language"
          >
            EN
            <ChevronDown className="size-4" />
          </button>
        </div>
        <Link
          href="/contact"
          className={cn(
            "flex items-center justify-center gap-2 px-6",
            "bg-secondary text-secondary-foreground",
            "font-medium text-sm",
            "hover:bg-secondary/90 transition-colors"
          )}
        >
          Contact
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </header>
  );
}
