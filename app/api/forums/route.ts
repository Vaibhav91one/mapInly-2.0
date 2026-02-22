import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slugify";
import { createForumBodySchema } from "@/lib/validations/api";

export const dynamic = "force-dynamic";

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

export async function GET() {
  const forums = await prisma.forum.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(forums.map(toApiForum));
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  const existingSlugs = (await prisma.forum.findMany({ select: { slug: true } })).map(
    (f) => f.slug
  );
  const slug = uniqueSlug(data.title, existingSlugs);

  const forum = await prisma.forum.create({
    data: {
      slug,
      title: data.title.trim(),
      tagline: data.tagline.trim(),
      shortDescription: data.shortDescription.trim(),
      status: data.status,
      tags: data.tags,
      image: data.image?.trim() ?? null,
      createdBy: user.id,
    },
  });

  return NextResponse.json(toApiForum(forum));
}
