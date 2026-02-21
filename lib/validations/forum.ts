import { z } from "zod";

export const forumFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  tagline: z.string().min(1, "Tagline is required").max(120),
  shortDescription: z.string().min(1, "Short description is required").max(500),
  status: z.enum(["active", "closed"]),
  tags: z.array(z.string()),
  image: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
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

export type ForumFormSchema = z.infer<typeof forumFormSchema>;
