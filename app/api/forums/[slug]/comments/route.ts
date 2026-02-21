import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { createCommentBodySchema } from "@/lib/validations/api";

export type CommentWithAuthor = {
  id: string;
  forumId: string;
  parentId: string | null;
  authorId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  author: { name: string; avatarUrl: string };
  timestamp: string;
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const forum = await prisma.forum.findUnique({ where: { slug } });
  if (!forum) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comments = await prisma.comment.findMany({
    where: { forumId: forum.id },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  });

  const enriched: CommentWithAuthor[] = comments.map((c) => ({
    id: c.id,
    forumId: c.forumId,
    parentId: c.parentId,
    authorId: c.authorId,
    content: c.content,
    upvotes: c.upvotes,
    downvotes: c.downvotes,
    createdAt: c.createdAt.toISOString(),
    author: {
      name: c.author.displayName,
      avatarUrl: c.author.avatarUrl ?? "",
    },
    timestamp: formatTimestamp(c.createdAt.toISOString()),
  }));

  return NextResponse.json(enriched);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const forum = await prisma.forum.findUnique({ where: { slug } });
  if (!forum) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (forum.status === "closed") {
    return NextResponse.json(
      { error: "Cannot comment on closed forum" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const parsed = createCommentBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { content, parentId } = parsed.data;

  if (parentId) {
    const parent = await prisma.comment.findFirst({
      where: { id: parentId, forumId: forum.id },
    });
    if (!parent) {
      return NextResponse.json(
        { error: "Invalid parent comment" },
        { status: 400 }
      );
    }
  }

  const comment = await prisma.comment.create({
    data: {
      forumId: forum.id,
      parentId: parentId ?? null,
      authorId: user.id,
      content: content.trim(),
    },
    include: { author: true },
  });

  const enriched = {
    id: comment.id,
    forumId: comment.forumId,
    parentId: comment.parentId,
    authorId: comment.authorId,
    content: comment.content,
    upvotes: comment.upvotes,
    downvotes: comment.downvotes,
    createdAt: comment.createdAt.toISOString(),
    author: {
      name: comment.author.displayName,
      avatarUrl: comment.author.avatarUrl ?? "",
    },
    timestamp: formatTimestamp(comment.createdAt.toISOString()),
  };

  return NextResponse.json(enriched);
}
