import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { voteCommentBodySchema } from "@/lib/validations/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  const { slug, commentId } = await params;
  const forum = await prisma.forum.findUnique({ where: { slug } });
  if (!forum) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comment = await prisma.comment.findFirst({
    where: { id: commentId, forumId: forum.id },
  });
  if (!comment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = voteCommentBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const update =
    parsed.data.direction === "up"
      ? { upvotes: { increment: 1 } }
      : { downvotes: { increment: 1 } };

  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: update,
  });

  return NextResponse.json({
    id: updated.id,
    forumId: updated.forumId,
    parentId: updated.parentId,
    authorId: updated.authorId,
    content: updated.content,
    upvotes: updated.upvotes,
    downvotes: updated.downvotes,
    createdAt: updated.createdAt.toISOString(),
  });
}
