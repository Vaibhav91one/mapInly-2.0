"use client";

import Link from "next/link";
import { ArrowLinkButton } from "@/components/ui/arrow-link-button";
import { EventChatSheet } from "./chat";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";

interface EventDetailsSectionProps {
  headline: string;
  description: string;
  signUpHref?: string;
  hasSignedUp?: boolean;
  eventSlug?: string;
  eventTitle?: string;
  eventImage?: string;
}

export function EventDetailsSection({
  headline,
  description,
  signUpHref = "#",
  hasSignedUp = false,
  eventSlug = "",
  eventTitle = "",
  eventImage,
}: EventDetailsSectionProps) {
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
        {/* 1/4: / Events + Sign up or Chat */}
        <div className="flex flex-col justify-between gap-56">
          <p className="text-sm font-regular leading-tight tracking-tight text-background/70 md:text-base">
            <Link href="/events" className="hover:text-background transition-colors">
              / Events
            </Link>
          </p>
          {hasSignedUp ? (
            <EventChatSheet
              eventId={eventSlug}
              eventTitle={eventTitle}
              eventImage={eventImage}
              className="mt-auto w-fit"
            />
          ) : (
            <ArrowLinkButton
              href={signUpHref}
              text="Sign up"
              ariaLabel="Sign up for this event"
              className="mt-auto w-fit bg-primary text-primary-foreground hover:bg-primary/90"
            />
          )}
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
