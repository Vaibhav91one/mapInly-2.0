import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { createEventBodySchema } from "@/lib/validations/api";
import { translateTexts } from "@/lib/translate/server";
import { getLocaleFromRequest } from "@/lib/i18n/get-locale-server";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-cookie";

export const dynamic = "force-dynamic";

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { registrations: true },
  });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(toApiEvent(event));
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
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (event.createdBy !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
  const requestLocale = await getLocaleFromRequest();
  const sourceLocale = SUPPORTED_LOCALES.includes(
    (data.sourceLocale ?? requestLocale) as (typeof SUPPORTED_LOCALES)[number]
  )
    ? (data.sourceLocale ?? requestLocale) as (typeof SUPPORTED_LOCALES)[number]
    : "en";

  const title = data.title.trim();
  const tagline = data.tagline.trim();
  const shortDescription = data.shortDescription.trim();

  const updated = await prisma.event.update({
    where: { slug },
    data: {
      title,
      tagline,
      shortDescription,
      date: data.date,
      timeRange: data.timeRange,
      location: data.location as object,
      tags: data.tags,
      image: data.image.trim(),
      imageOverlay: data.imageOverlay ?? null,
      sourceLocale,
    },
    include: { registrations: true },
  });

  await prisma.eventTranslation.deleteMany({ where: { eventId: updated.id } });
  const targetLocales = SUPPORTED_LOCALES.filter((l) => l !== sourceLocale);
  await Promise.all(
    targetLocales.map(async (locale) => {
      const [tTitle, tTagline, tShortDesc] = await translateTexts(
        [title, tagline, shortDescription],
        locale,
        sourceLocale
      );
      await prisma.eventTranslation.create({
        data: {
          eventId: updated.id,
          locale,
          title: tTitle,
          tagline: tTagline,
          shortDescription: tShortDesc,
        },
      });
    })
  );

  return NextResponse.json(toApiEvent(updated));
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
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (event.createdBy !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.event.delete({ where: { slug } });
  return new NextResponse(null, { status: 204 });
}
