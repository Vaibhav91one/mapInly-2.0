"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "./chat-header";
import { ChatMessage } from "./chat-message";
import { ChatMessageInput } from "./chat-message-input";
import type { ChatMessageData } from "./chat-message";
import { cn } from "@/lib/utils";

const MOCK_MESSAGES: ChatMessageData[] = [
  {
    id: "1",
    content: "Welcome to Lugano AI Week! Feel free to ask questions and connect with other participants.",
    sender: "Event Bot",
    avatarUrl: "https://picsum.photos/seed/event-bot/80/80",
    timestamp: "2:45 PM",
    isCurrentUser: false,
  },
  {
    id: "2",
    content: "Excited to be here! Can't wait for the keynote.",
    sender: "You",
    timestamp: "3:20 PM",
    isCurrentUser: true,
    readReceipt: "Seen by 2",
  },
];

interface EventChatSheetProps {
  eventId: string;
  eventTitle: string;
  eventImage?: string;
  className?: string;
}

export function EventChatSheet({
  eventId,
  eventTitle,
  eventImage,
  className,
}: EventChatSheetProps) {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [open, setOpen] = useState(false);

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessageData = {
      id: `msg-${Date.now()}`,
      content,
      sender: "You",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isCurrentUser: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 px-4 py-3 md:px-5 md:py-4",
            "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
            "font-medium text-base md:text-lg",
            className
          )}
          aria-label="Open event chat"
        >
          <span>Chat</span>
          <ArrowUpRight className="size-5 md:size-6 shrink-0 text-white" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={true}
        className="flex h-full w-full flex-col gap-0 border-l border-secondary/50 bg-foreground p-0 [&>button]:text-white [&>button]:hover:text-white/90 sm:max-w-md"
      >
        <ChatHeader eventTitle={eventTitle} eventImage={eventImage} />
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-background/50">3:20 PM</p>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
        </ScrollArea>
        {messages.some((m) => m.readReceipt) && (
          <p className="px-4 pb-1 text-right text-xs text-background/50">
            {messages.find((m) => m.readReceipt)?.readReceipt}
          </p>
        )}
        <ChatMessageInput onSubmit={handleSendMessage} />
      </SheetContent>
    </Sheet>
  );
}
