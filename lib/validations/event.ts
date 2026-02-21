import { z } from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  tagline: z.string().min(1, "Tagline is required").max(120),
  shortDescription: z.string().min(1, "Short description is required").max(500),
  dateTime: z.date({
    error: (issue) =>
      issue.input === undefined ? "Date and time are required" : "Invalid date",
  }),
  location: z.object({
    displayName: z.string().min(1, "Select a location"),
    latitude: z.number(),
    longitude: z.number(),
    mapsUrl: z.string().optional(),
  }),
  tags: z.array(z.string()),
  image: z
    .string()
    .min(1, "Image is required")
    .refine(
      (val) => {
        if (val.startsWith("data:image/") || /^https?:\/\/.+/.test(val))
          return true;
        if (val.startsWith("gradient:")) {
          const colors = val.slice(9).split(",");
          return (
            colors.length === 4 &&
            colors.every((c) => /^#[0-9a-fA-F]{3,8}$/.test(c.trim()))
          );
        }
        return false;
      },
      "Valid image URL, file, or gradient required"
    ),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
