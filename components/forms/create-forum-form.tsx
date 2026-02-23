"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import type { Forum, ForumFormData } from "@/types/forum";
import { formInputClasses } from "@/lib/form-styles";
import { keys } from "@/lib/i18n/keys";
import { TagsInput } from "./tags-input";
import { ImageOrGradientPicker } from "./image-or-gradient-picker";

interface CreateForumFormProps {
  onSubmit: (data: ForumFormData) => void | Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
  defaultForum?: Forum | null;
}

export function CreateForumForm({ onSubmit, onCancel, disabled, defaultForum }: CreateForumFormProps) {
  const { t } = useTranslation();
  const form = useForm<ForumFormSchema>({
    resolver: zodResolver(forumFormSchema),
    defaultValues: defaultForum
      ? {
          title: defaultForum.title,
          tagline: defaultForum.tagline,
          shortDescription: defaultForum.shortDescription,
          status: defaultForum.status,
          tags: defaultForum.tags ?? [],
          image: defaultForum.image ?? "",
        }
      : {
          title: "",
          tagline: "",
          shortDescription: "",
          status: "active",
          tags: [],
          image: "",
        },
  });

  useEffect(() => {
    if (defaultForum) {
      form.reset({
        title: defaultForum.title,
        tagline: defaultForum.tagline,
        shortDescription: defaultForum.shortDescription,
        status: defaultForum.status,
        tags: defaultForum.tags ?? [],
        image: defaultForum.image ?? "",
      });
    }
  }, [defaultForum, form]);

  async function handleSubmit(values: ForumFormSchema) {
    const data: ForumFormData = {
      title: values.title.trim(),
      tagline: values.tagline.trim(),
      shortDescription: values.shortDescription.trim(),
      status: values.status,
      tags: values.tags,
      image: values.image?.trim() || undefined,
    };
    await onSubmit(data);
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
              <FormLabel className="text-white">{t(keys.createForum.title)}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t(keys.createForum.title)}
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
              <FormLabel className="text-white">{t(keys.createForum.tagline)}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t(keys.createForum.taglinePlaceholder)}
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
              <FormLabel className="text-white">{t(keys.createForum.shortDescription)}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t(keys.createForum.shortDescPlaceholder)}
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
                <FormLabel className="text-white !mb-0">{t(keys.createForum.statusActive)}</FormLabel>
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
              <FormLabel className="text-white">{t(keys.createForum.image)}</FormLabel>
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
              <FormLabel className="text-white">{t(keys.createForum.tags)}</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t(keys.createForum.tagsPlaceholder)}
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
              {t(keys.createForum.cancel)}
            </Button>
          )}
          <Button
            type="submit"
            disabled={disabled}
            className="rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            {defaultForum ? t(keys.createForum.saveChanges) : t(keys.createForum.createForum)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
