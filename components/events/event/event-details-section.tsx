"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";
import { EventChatSheet } from "./chat";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";

interface EventDetailsSectionProps {
  headline: string;
  description: string;
  hasSignedUp?: boolean;
  isPast?: boolean;
  eventSlug?: string;
  eventTitle?: string;
  eventImage?: string;
}

export function EventDetailsSection({
  headline,
  description,
  hasSignedUp = false,
  isPast = false,
  eventSlug = "",
  eventTitle = "",
  eventImage,
}: EventDetailsSectionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!eventSlug || isLoading) return;
    setIsLoading(true);
    try {
      const registerRes = await fetch(`/api/events/${eventSlug}/register`, {
        method: "POST",
      });
      if (registerRes.status === 401) {
        const next = `/events/${eventSlug}`;
        window.location.href = `/auth?next=${encodeURIComponent(next)}`;
        return;
      }
      if (!registerRes.ok) {
        const data = await registerRes.json().catch(() => ({}));
        toast.error(data.error ?? "Failed to register");
        return;
      }
      await fetch("/api/users/sync", { method: "POST" });
      toast.success("You've registered for this event!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

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
          {isPast ? (
            <p className="mt-auto text-sm font-medium text-background/70">
              This event has ended
            </p>
          ) : hasSignedUp ? (
            <EventChatSheet
              eventId={eventSlug}
              eventTitle={eventTitle}
              eventImage={eventImage}
              className="mt-auto w-fit"
            />
          ) : (
            <button
              type="button"
              onClick={handleSignUp}
              disabled={isLoading}
              className={cn(
                "mt-auto w-fit inline-flex items-center gap-2 px-4 py-3 md:px-5 md:py-4",
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
                "font-medium text-base md:text-lg",
                "disabled:opacity-70 disabled:pointer-events-none"
              )}
              aria-label="Sign up for this event"
            >
              <span>{isLoading ? "Signing up…" : "Sign up"}</span>
              <ArrowUpRight className="size-5 md:size-6 shrink-0 text-white" />
            </button>
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
