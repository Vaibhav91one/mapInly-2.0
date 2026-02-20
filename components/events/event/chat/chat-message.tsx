"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ChatMessageData {
  id: string;
  content: string;
  sender: string;
  avatarUrl?: string;
  timestamp: string;
  isCurrentUser: boolean;
  readReceipt?: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
  className?: string;
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-2",
        message.isCurrentUser ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {!message.isCurrentUser && message.avatarUrl && (
        <Avatar size="sm" className="size-8 shrink-0">
          <AvatarImage asChild>
            <Image
              src={message.avatarUrl}
              alt=""
              width={32}
              height={32}
              className="object-cover"
            />
          </AvatarImage>
          <AvatarFallback className="bg-secondary text-background text-xs">
            {message.sender.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-0.5",
          message.isCurrentUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5",
            message.isCurrentUser
              ? "rounded-br-md bg-primary/30 text-background"
              : "rounded-bl-md bg-secondary/80 text-background"
          )}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <span className="text-xs text-background/50">{message.timestamp}</span>
      </div>
    </div>
  );
}
