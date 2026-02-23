"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";
import { keys } from "@/lib/i18n/keys";

interface CreatorItem {
  image: string;
  name?: string;
}

interface ForumHeroSectionProps {
  title: string;
  /** Single creator for "Created by" (1 avatar). Popover shows name on click. */
  creator?: CreatorItem;
}

export function ForumHeroSection({ title, creator }: ForumHeroSectionProps) {
  const { t } = useTranslation();
  return (
    <section
      className={cn(
        sectionClasses,
        "h-[60dvh] bg-foreground"
      )}
    >
      <div
        className={cn(
          sectionInnerClasses,
          "relative z-10 flex min-h-[60dvh] flex-col items-start justify-between gap-8"
        )}
      >
        {/* Top row: 1/4 = / Forum, 3/4 = Created by (1 avatar) */}
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_3fr] lg:items-center lg:gap-16">
          <p className="text-sm font-regular leading-tight tracking-tight text-white md:text-2xl">
            <Link href="/forums" className="hover:text-background transition-colors">
              {t(keys.forumDetail.breadcrumb)}
            </Link>
          </p>
          {creator && (
            <div className="flex items-center gap-3 shrink-0">
              <p className="text-sm font-medium tracking-tight text-background/70">{t(keys.forumDetail.createdBy)}</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-full"
                    aria-label={creator.name ?? t(keys.forumDetail.creatorAria)}
                  >
                    <Image
                      src={creator.image}
                      alt={creator.name ?? ""}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                </PopoverTrigger>
                {creator.name && (
                  <PopoverContent
                    align="start"
                    side="bottom"
                    className="w-auto rounded-md px-3 py-2 text-sm font-medium text-popover-foreground"
                  >
                    {creator.name}
                  </PopoverContent>
                )}
              </Popover>
            </div>
          )}
        </div>

        {/* Bottom row: title only */}
        <div className="w-full">
          <h1 className="text-4xl font-regular leading-tight tracking-tight text-background md:text-6xl lg:text-7xl xl:text-8xl text-right">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
