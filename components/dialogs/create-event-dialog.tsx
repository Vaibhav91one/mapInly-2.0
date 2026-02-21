"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateEventForm } from "@/components/forms/create-event-form";
import type { EventFormData } from "@/types/event";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  const handleSubmit = (data: EventFormData) => {
    // eslint-disable-next-line no-console -- mock submit for now
    console.log("Create event:", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] rounded-none max-w-2xl overflow-y-auto bg-black text-white border-white/20 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create event</DialogTitle>
        </DialogHeader>
        <CreateEventForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
