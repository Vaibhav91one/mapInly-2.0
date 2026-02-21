import { z } from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(40, "Title must be 40 characters or less"),
  tagline: z.string().min(1, "Tagline is required").max(100, "Tagline must be 100 characters or less"),
  shortDescription: z.string().min(1, "Short description is required").max(200, "Short description must be 200 characters or less"),
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
  tags: z
    .array(z.string().max(10, "Each tag max 10 characters"))
    .max(3, "Maximum 3 tags allowed"),
  image: z
    .string()
    .min(1, "Image is required")
    .refine(
      (val) => {
        if (val.startsWith("gradient:")) {
          const colors = val.slice(9).split(",");
          return (
            colors.length === 4 &&
            colors.every((c) => /^#[0-9a-fA-F]{3,8}$/.test(c.trim()))
          );
        }
        if (val.startsWith("data:image/")) {
          const mime = val.slice(5, val.indexOf(";"));
          return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(mime);
        }
        if (/^https?:\/\/.+/.test(val)) return true;
        return false;
      },
      "Valid image (JPEG, PNG, WebP) or gradient required"
    ),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
