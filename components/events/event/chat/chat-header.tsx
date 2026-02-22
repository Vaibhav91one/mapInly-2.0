"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  eventTitle: string;
  eventImage?: string;
  className?: string;
}

export function ChatHeader({
  eventTitle,
  eventImage,
  className,
}: ChatHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-secondary/50 bg-foreground px-4 py-3",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar size="lg" className="size-10">
          {eventImage ? (
            <AvatarImage asChild>
              <Image
                src={eventImage}
                alt=""
                width={40}
                height={40}
                className="object-cover"
              />
            </AvatarImage>
          ) : null}
          <AvatarFallback className="bg-secondary text-background">
            {eventTitle.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-background">{eventTitle}</span>
      </div>
    </div>
  );
}
