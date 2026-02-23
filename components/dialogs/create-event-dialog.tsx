"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateEventForm } from "@/components/forms/create-event-form";
import type { Event, EventFormData } from "@/types/event";
import { useAuthStore } from "@/stores/auth-store";
import { useDataStore } from "@/stores/data-store";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
}

export function CreateEventDialog({ open, onOpenChange, event }: CreateEventDialogProps) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const createEvent = useDataStore((s) => s.createEvent);
  const updateEvent = useDataStore((s) => s.updateEvent);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: EventFormData) => {
    if (!user) {
      router.push("/auth");
      onOpenChange(false);
      return;
    }

    const sourceLocale = (i18n.language?.split("-")[0] ?? "en") as string;
    const dataWithLocale = { ...data, sourceLocale };

    setError(null);
    setIsSubmitting(true);
    try {
      if (event) {
        await updateEvent(event.slug, dataWithLocale);
      } else {
        await createEvent(dataWithLocale);
      }
      router.refresh();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] rounded-none max-w-2xl overflow-y-auto bg-black text-white border-white/20 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event ? "Edit event" : "Create event"}</DialogTitle>
        </DialogHeader>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <CreateEventForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          disabled={isSubmitting}
          defaultEvent={event}
        />
      </DialogContent>
    </Dialog>
  );
}
