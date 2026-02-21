import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slugify";
import { createEventBodySchema } from "@/lib/validations/api";

function toApiEvent(e: {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  date: string;
  timeRange: string;
  location: unknown;
  tags: string[];
  image: string;
  imageOverlay: string | null;
  createdBy: string;
  createdAt: Date;
  registrations: { userId: string }[];
}) {
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    tagline: e.tagline,
    shortDescription: e.shortDescription,
    date: e.date,
    timeRange: e.timeRange,
    location: e.location as object,
    tags: e.tags,
    image: e.image,
    imageOverlay: e.imageOverlay ?? undefined,
    createdBy: e.createdBy,
    createdAt: e.createdAt.toISOString(),
    registrations: e.registrations.map((r) => r.userId),
  };
}

export async function GET() {
  const events = await prisma.event.findMany({
    include: { registrations: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(events.map(toApiEvent));
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
  const parsed = createEventBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const existingSlugs = (await prisma.event.findMany({ select: { slug: true } })).map(
    (e) => e.slug
  );
  const slug = uniqueSlug(data.title, existingSlugs);

  const event = await prisma.event.create({
    data: {
      slug,
      title: data.title.trim(),
      tagline: data.tagline.trim(),
      shortDescription: data.shortDescription.trim(),
      date: data.date,
      timeRange: data.timeRange,
      location: data.location as object,
      tags: data.tags,
      image: data.image.trim(),
      imageOverlay: data.imageOverlay ?? null,
      createdBy: user.id,
    },
    include: { registrations: true },
  });

  return NextResponse.json(toApiEvent(event));
}
