"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { forumFormSchema, type ForumFormSchema } from "@/lib/validations/forum";
import type { ForumFormData } from "@/types/forum";
import { formInputClasses } from "@/lib/form-styles";
import { TagsInput } from "./tags-input";
import { ImageOrGradientPicker } from "./image-or-gradient-picker";

interface CreateForumFormProps {
  onSubmit: (data: ForumFormData) => void;
  onCancel?: () => void;
}

export function CreateForumForm({ onSubmit, onCancel }: CreateForumFormProps) {
  const form = useForm<ForumFormSchema>({
    resolver: zodResolver(forumFormSchema),
    defaultValues: {
      title: "",
      tagline: "",
      shortDescription: "",
      status: "active",
      tags: [],
      image: "",
    },
  });

  function handleSubmit(values: ForumFormSchema) {
    const data: ForumFormData = {
      title: values.title.trim(),
      tagline: values.tagline.trim(),
      shortDescription: values.shortDescription.trim(),
      status: values.status,
      tags: values.tags,
      image: values.image?.trim() || undefined,
    };
    onSubmit(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Forum title"
                  className={formInputClasses}
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Tagline</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Primary one-line headline"
                  className={formInputClasses}
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Short description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Short paragraph description"
                  rows={3}
                  className={formInputClasses}
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between rounded-none border border-white/20 px-4 py-3">
                <FormLabel className="text-white !mb-0">Active</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value === "active"}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? "active" : "closed")
                    }
                  />
                </FormControl>
              </div>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Image (optional)</FormLabel>
              <FormControl>
                <ImageOrGradientPicker
                  value={field.value ?? ""}
                  onChange={(v: string) => field.onChange(v || undefined)}
                  error={form.formState.errors.image?.message}
                  inputClassName={formInputClasses}
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Tags</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="e.g. AI, community, innovation"
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Create forum
          </Button>
        </div>
      </form>
    </Form>
  );
}
