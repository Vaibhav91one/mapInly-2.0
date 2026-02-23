import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { createForumBodySchema } from "@/lib/validations/api";
import { translateTexts } from "@/lib/translate/server";
import { getLocaleFromRequest } from "@/lib/i18n/get-locale-server";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-cookie";

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
  const requestLocale = await getLocaleFromRequest();
  const sourceLocale = SUPPORTED_LOCALES.includes(
    (data.sourceLocale ?? requestLocale) as (typeof SUPPORTED_LOCALES)[number]
  )
    ? (data.sourceLocale ?? requestLocale) as (typeof SUPPORTED_LOCALES)[number]
    : "en";

  const title = data.title.trim();
  const tagline = data.tagline.trim();
  const shortDescription = data.shortDescription.trim();

  const updated = await prisma.forum.update({
    where: { slug },
    data: {
      title,
      tagline,
      shortDescription,
      status: data.status,
      tags: data.tags,
      image: data.image?.trim() ?? null,
      sourceLocale,
    },
  });

  await prisma.forumTranslation.deleteMany({ where: { forumId: updated.id } });
  const targetLocales = SUPPORTED_LOCALES.filter((l) => l !== sourceLocale);
  await Promise.all(
    targetLocales.map(async (locale) => {
      const [tTitle, tTagline, tShortDesc] = await translateTexts(
        [title, tagline, shortDescription],
        locale,
        sourceLocale
      );
      await prisma.forumTranslation.create({
        data: {
          forumId: updated.id,
          locale,
          title: tTitle,
          tagline: tTagline,
          shortDescription: tShortDesc,
        },
      });
    })
  );

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
