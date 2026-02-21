"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateForumForm } from "@/components/forms/create-forum-form";
import type { Forum, ForumFormData } from "@/types/forum";
import { useAuthStore } from "@/stores/auth-store";
import { useDataStore } from "@/stores/data-store";

interface CreateForumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forum?: Forum | null;
}

export function CreateForumDialog({ open, onOpenChange, forum }: CreateForumDialogProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const createForum = useDataStore((s) => s.createForum);
  const updateForum = useDataStore((s) => s.updateForum);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ForumFormData) => {
    if (!user) {
      router.push("/auth");
      onOpenChange(false);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      if (forum) {
        await updateForum(forum.slug, data);
      } else {
        await createForum(data);
      }
      router.refresh();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save forum");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] rounded-none overflow-y-auto bg-black text-white border-white/20">
        <DialogHeader>
          <DialogTitle>{forum ? "Edit forum" : "Create forum"}</DialogTitle>
        </DialogHeader>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <CreateForumForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          disabled={isSubmitting}
          defaultForum={forum}
        />
      </DialogContent>
    </Dialog>
  );
}
