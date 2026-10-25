import { z } from "zod";

const locationSchema = z.object({
  displayName: z.string().min(1, "Select a location"),
  latitude: z.number(),
  longitude: z.number(),
  mapsUrl: z.string().optional(),
});

const imageSchema = z
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
  );

export const createEventBodySchema = z.object({
  title: z.string().min(1).max(40),
  tagline: z.string().min(1).max(100),
  shortDescription: z.string().min(1).max(200),
  date: z.string().min(1),
  timeRange: z.string().min(1),
  location: locationSchema,
  tags: z.array(z.string().max(10)).max(3),
  image: imageSchema,
  imageOverlay: z.string().optional(),
  sourceLocale: z.string().optional(),
});

export const createCommentBodySchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000),
  parentId: z.string().nullable().optional(),
  sourceLocale: z.string().optional(),
});

export const createEventMessageBodySchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(2000),
  sourceLocale: z.string().optional(),
});

export const voteCommentBodySchema = z.object({
  direction: z.enum(["up", "down"]),
});

export const createForumBodySchema = z.object({
  title: z.string().min(1).max(40),
  tagline: z.string().min(1).max(100),
  shortDescription: z.string().min(1).max(200),
  status: z.enum(["active", "closed"]),
  tags: z.array(z.string().max(10)).max(3),
  image: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
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
  sourceLocale: z.string().optional(),
});
