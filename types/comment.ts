export interface Comment {
  id: string;
  forumId: string;
  parentId: string | null;
  authorId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}
