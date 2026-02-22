"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import type { EventMessageWithAuthor } from "@/app/api/events/[slug]/messages/route";

interface EventChatSheetProps {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  eventImage?: string;
  className?: string;
}

function toChatMessageData(
  m: EventMessageWithAuthor,
  currentUserId: string | null
): ChatMessageData {
  return {
    id: m.id,
    content: m.content,
    sender: m.author.displayName || "Anonymous",
    avatarUrl: m.author.avatarUrl ?? undefined,
    timestamp: m.timestamp,
    isCurrentUser: currentUserId ? m.userId === currentUserId : false,
  };
}

export function EventChatSheet({
  eventId,
  eventSlug,
  eventTitle,
  eventImage,
  className,
}: EventChatSheetProps) {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchMessages = useCallback(
    async (showLoading = false) => {
      if (!eventSlug) return;
      if (showLoading) setLoading(true);
      try {
        const res = await fetch(`/api/events/${eventSlug}/messages`);
        if (!res.ok) {
          setMessages([]);
          return;
        }
        const data: EventMessageWithAuthor[] = await res.json();
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id ?? null);
        const mapped = data.map((m) => toChatMessageData(m, user?.id ?? null));
        setMessages(mapped);
        if (mapped.length > 0) {
          setTimeout(scrollToBottom, 50);
        }
      } catch {
        setMessages([]);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [eventSlug, scrollToBottom]
  );

  useEffect(() => {
    if (open && eventSlug) {
      fetchMessages(true);
    }
  }, [open, eventSlug, fetchMessages]);

  useEffect(() => {
    if (!open || !eventId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`event-messages-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "event_messages",
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          fetchMessages(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, eventId, fetchMessages]);

  const handleSendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/events/${eventSlug}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      if (res.status === 401) {
        window.location.href = `/auth?next=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error(data.error ?? "Failed to send message");
        return;
      }
      const newMsg: EventMessageWithAuthor = await res.json();
      setMessages((prev) => [
        ...prev,
        toChatMessageData(newMsg, currentUserId),
      ]);
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
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
        noBorder
        data-slot="event-chat-sheet"
        className="flex h-full w-full flex-col gap-0 overflow-hidden bg-foreground p-0 [&>button]:text-white [&>button]:hover:text-white/90 sm:max-w-md"
      >
        <ChatHeader eventTitle={eventTitle} eventImage={eventImage} className="shrink-0" />
        <ScrollArea className="min-h-0 flex-1 overflow-auto px-4 py-4">
          <div className="flex flex-col gap-4 pb-2">
            {loading ? (
              <p className="text-center text-sm text-background/50">
                Loading messages...
              </p>
            ) : messages.length === 0 ? (
              <p className="text-center text-sm text-background/50">
                No messages yet. Say hello!
              </p>
            ) : (
              messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="shrink-0 border-t border-secondary/50">
          <ChatMessageInput
            onSubmit={handleSendMessage}
            disabled={sending}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
