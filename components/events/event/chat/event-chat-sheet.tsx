"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "./chat-header";
import { ChatMessage } from "./chat-message";
import { ChatMessageInput } from "./chat-message-input";
import type { ChatMessageData } from "./chat-message";
import { DEMO_USER_ID, type DemoUser, type StoredMessage } from "@/lib/demo/data";
import { useLocale } from "@/lib/demo/localize";
import { useDataStore } from "@/stores/data-store";
import { cn } from "@/lib/utils";
import { keys } from "@/lib/i18n/keys";

interface EventChatSheetProps {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  eventImage?: string;
  className?: string;
}

function toChatMessageData(m: StoredMessage, locale: string, users: DemoUser[]): ChatMessageData {
  const author = users.find((u) => u.id === m.userId);
  return {
    id: m.id,
    content: m.translations[locale]?.content ?? m.content,
    sender: author?.displayName || "Anonymous",
    avatarUrl: author?.avatarUrl ?? undefined,
    timestamp: new Date(m.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    createdAt: m.createdAt,
    isCurrentUser: m.userId === DEMO_USER_ID,
  };
}

export function EventChatSheet({
  eventId,
  eventSlug,
  eventTitle,
  eventImage,
  className,
}: EventChatSheetProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const storedMessages = useDataStore((s) => s.messages);
  const users = useDataStore((s) => s.users);
  const addMessage = useDataStore((s) => s.addMessage);

  const messages = useMemo(
    () =>
      storedMessages
        .filter((m) => m.eventSlug === eventSlug)
        .map((m) => toChatMessageData(m, locale, users)),
    [storedMessages, eventSlug, locale, users]
  );

  // keep the newest message in view while the sheet is open
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    return () => clearTimeout(id);
  }, [open, messages.length]);

  const handleSendMessage = (content: string) => {
    const trimmed = content.trim();
    if (trimmed) addMessage(eventSlug, trimmed);
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
          aria-label={t(keys.eventDetail.chatAria)}
        >
          <span>{t(keys.eventDetail.chat)}</span>
          <ArrowUpRight className="size-5 md:size-6 shrink-0 text-white" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={true}
        noBorder
        data-slot="event-chat-sheet"
        className="flex h-full w-full flex-col gap-0 overflow-hidden bg-foreground p-0 [&>button]:text-white [&>button]:hover:text-white/90 sm:max-w-md"
      >
        <SheetTitle className="sr-only">{eventTitle}</SheetTitle>
        <SheetDescription className="sr-only">{t(keys.eventDetail.chat)}</SheetDescription>
        <ChatHeader eventTitle={eventTitle} eventImage={eventImage} className="shrink-0" />
        <ScrollArea className="min-h-0 flex-1 overflow-auto px-4 py-4">
          <div className="flex flex-col gap-4 pb-2">
            {messages.length === 0 ? (
              <p className="text-center text-sm text-background/50">
                {t(keys.eventChat.noMessagesYet)}
              </p>
            ) : (
              messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="shrink-0 border-t border-secondary/50">
          <ChatMessageInput
            placeholder={t(keys.eventChat.messagePlaceholder)}
            messageInputAria={t(keys.eventChat.messageInputAria)}
            emojiAria={t(keys.eventChat.emojiAria)}
            onSubmit={handleSendMessage}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
