import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { createForumBodySchema } from "@/lib/validations/api";

function toApiForum(f: {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  status: string;
  tags: string[];
  image: string | null;
  createdBy: string;
  createdAt: Date;
}) {
  return {
    id: f.id,
    slug: f.slug,
    title: f.title,
    tagline: f.tagline,
    shortDescription: f.shortDescription,
    status: f.status,
    tags: f.tags,
    image: f.image ?? undefined,
    createdBy: f.createdBy,
    createdAt: f.createdAt.toISOString(),
  };
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
  return NextResponse.json(toApiForum(forum));
}

export async function PATCH(
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

  if (forum.createdBy !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createForumBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const updated = await prisma.forum.update({
    where: { slug },
    data: {
      title: data.title.trim(),
      tagline: data.tagline.trim(),
      shortDescription: data.shortDescription.trim(),
      status: data.status,
      tags: data.tags,
      image: data.image?.trim() ?? null,
    },
  });

  return NextResponse.json(toApiForum(updated));
}

export async function DELETE(
  _request: Request,
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

  if (forum.createdBy !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.forum.delete({ where: { slug } });
  return new NextResponse(null, { status: 204 });
}
