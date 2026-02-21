"use client";

import { format } from "date-fns";
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
import { LocationPicker } from "./location-picker";
import { DateTimePicker } from "./date-time-picker";
import { TagsInput } from "./tags-input";
import { ImageOrGradientPicker } from "./image-or-gradient-picker";
import { eventFormSchema, type EventFormSchema } from "@/lib/validations/event";
import type { EventFormData, EventLocation } from "@/types/event";
import { formInputClasses } from "@/lib/form-styles";

const defaultLocation: EventLocation = {
  displayName: "",
  latitude: 0,
  longitude: 0,
};

function getDefaultDateTime(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d;
}

interface CreateEventFormProps {
  onSubmit: (data: EventFormData) => void;
  onCancel?: () => void;
}

export function CreateEventForm({ onSubmit, onCancel }: CreateEventFormProps) {
  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      tagline: "",
      shortDescription: "",
      dateTime: getDefaultDateTime(),
      location: defaultLocation,
      tags: [],
      image: "",
    },
  });

  function handleSubmit(values: EventFormSchema) {
    const data: EventFormData = {
      title: values.title.trim(),
      tagline: values.tagline.trim(),
      shortDescription: values.shortDescription.trim(),
      date: format(values.dateTime, "dd.MM.yyyy"),
      timeRange: format(values.dateTime, "h:mm a"),
      location: values.location,
      tags: values.tags,
      image: values.image.trim(),
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
                  placeholder="Event title"
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
          name="dateTime"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  label="Date & time"
                  error={form.formState.errors.dateTime?.message}
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Location</FormLabel>
              <FormControl>
                <LocationPicker
                  value={
                    field.value.displayName.trim()
                      ? field.value
                      : null
                  }
                  onChange={(loc) =>
                    field.onChange(loc ?? defaultLocation)
                  }
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

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Image</FormLabel>
              <FormControl>
                <ImageOrGradientPicker
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.image?.message}
                  inputClassName={formInputClasses}
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
            Create event
          </Button>
        </div>
      </form>
    </Form>
  );
}
