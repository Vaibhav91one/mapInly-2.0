"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateForumForm } from "@/components/forms/create-forum-form";
import type { ForumFormData } from "@/types/forum";

interface CreateForumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateForumDialog({ open, onOpenChange }: CreateForumDialogProps) {
  const handleSubmit = (data: ForumFormData) => {
    // eslint-disable-next-line no-console -- mock submit for now
    console.log("Create forum:", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] rounded-none overflow-y-auto bg-black text-white border-white/20">
        <DialogHeader>
          <DialogTitle>Create forum</DialogTitle>
        </DialogHeader>
        <CreateForumForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
