export type ForumStatus = "active" | "closed";

export interface ForumFormData {
  title: string;
  /** Primary one-line headline */
  tagline: string;
  /** Short paragraph description */
  shortDescription: string;
  status: ForumStatus;
  tags: string[];
  /** Image URL or base64 data URL */
  image?: string;
  /** Creator's locale when submitting (for translation) */
  sourceLocale?: string;
}

/** Stored forum with DB metadata */
export interface Forum extends ForumFormData {
  id: string;
  slug: string;
  createdBy: string;
  createdAt: string;
}
