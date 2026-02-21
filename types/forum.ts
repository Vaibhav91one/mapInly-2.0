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
}
