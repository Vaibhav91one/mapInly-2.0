"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ArrowLinkButton } from "@/components/ui/arrow-link-button";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";
import { keys } from "@/lib/i18n/keys";

interface ForumDetailsSectionProps {
  headline: string;
  description: string;
  chatHref?: string;
}

export function ForumDetailsSection({
  headline,
  description,
  chatHref = "#",
}: ForumDetailsSectionProps) {
  const { t } = useTranslation();
  return (
    <section
      className={cn(
        sectionClasses,
        "bg-foreground"
      )}
    >
      <div
        className={cn(
          sectionInnerClasses,
          "grid min-h-[50vh] grid-cols-1 gap-8 lg:grid-cols-[1fr_3fr] lg:items-start lg:gap-16"
        )}
      >
        {/* 1/4: / Forum + Chat */}
        <div className="flex flex-col justify-between gap-56">
          <p className="text-sm font-regular leading-tight tracking-tight text-background/70 md:text-base">
            <Link href="/forums" className="hover:text-background transition-colors">
              {t(keys.forumDetail.breadcrumb)}
            </Link>
          </p>
          {/* <ArrowLinkButton
            href={chatHref}
            text="Chat"
            ariaLabel="Open forum chat"
            className="mt-auto w-fit bg-primary text-primary-foreground hover:bg-primary/90"
          /> */}
        </div>

        {/* 3/4: headline + description */}
        <div className="flex flex-col gap-26 max-w-3xl">
          <h2 className="text-3xl font-regular leading-tight tracking-tight text-background md:text-4xl lg:text-4xl">
            {headline}
          </h2>
          <p className="text-sm font-regular leading-tight tracking-tight text-white md:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
