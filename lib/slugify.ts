/**
 * Convert a title to a URL-safe slug.
 * Handles collisions by appending -1, -2, etc.
 */
export function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generate a unique slug from a title given existing slugs.
 */
export function uniqueSlug(title: string, existingSlugs: string[]): string {
  const base = slugify(title);
  if (!base) return `event-${Date.now()}`;

  const set = new Set(existingSlugs);
  if (!set.has(base)) return base;

  let i = 1;
  while (set.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
