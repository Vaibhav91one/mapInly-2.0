import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { createEventMessageBodySchema } from "@/lib/validations/api";
import { translateTexts } from "@/lib/translate/server";
import { getMessagesWithTranslations } from "@/lib/events/get-messages-with-translations";
import { getLocaleFromRequest } from "@/lib/i18n/get-locale-server";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-cookie";

export const dynamic = "force-dynamic";

export type EventMessageWithAuthor = {
  id: string;
  eventId: string;
  userId: string;
  content: string;
  createdAt: string;
  author: { displayName: string; avatarUrl: string | null };
  timestamp: string;
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale =
    localeParam && SUPPORTED_LOCALES.includes(localeParam as (typeof SUPPORTED_LOCALES)[number])
      ? localeParam
      : await getLocaleFromRequest();

  const messages = await prisma.eventMessage.findMany({
    where: { eventId: event.id },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  const enriched: EventMessageWithAuthor[] = messages.map((m) => ({
    id: m.id,
    eventId: m.eventId,
    userId: m.userId,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    author: {
      displayName: m.user.displayName,
      avatarUrl: m.user.avatarUrl,
    },
    timestamp: formatTimestamp(m.createdAt.toISOString()),
  }));

  const withTranslations = await getMessagesWithTranslations(enriched, locale);

  return NextResponse.json(withTranslations);
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
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isRegistered = await prisma.eventRegistration.findUnique({
    where: {
      eventId_userId: { eventId: event.id, userId: user.id },
    },
  });
  const isCreator = event.createdBy === user.id;
  if (!isRegistered && !isCreator) {
    return NextResponse.json(
      { error: "You must be registered for this event to send messages" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = createEventMessageBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const trimmedContent = parsed.data.content.trim();
  const sourceLocale =
    parsed.data.sourceLocale &&
    SUPPORTED_LOCALES.includes(parsed.data.sourceLocale as (typeof SUPPORTED_LOCALES)[number])
      ? parsed.data.sourceLocale
      : "en";

  const targetLocales = SUPPORTED_LOCALES.filter((l) => l !== sourceLocale);
  const translatedContents = await Promise.all(
    targetLocales.map(async (targetLocale) => {
      const [tContent] = await translateTexts(
        [trimmedContent],
        targetLocale,
        sourceLocale
      );
      return { targetLocale, content: tContent };
    })
  );

  const message = await prisma.$transaction(async (tx) => {
    const msg = await tx.eventMessage.create({
      data: {
        eventId: event.id,
        userId: user.id,
        content: trimmedContent,
        sourceLocale,
      },
      include: { user: true },
    });
    await Promise.all(
      translatedContents.map(({ targetLocale, content }) =>
        tx.eventMessageTranslation.create({
          data: {
            messageId: msg.id,
            locale: targetLocale,
            content,
          },
        })
      )
    );
    return msg;
  });

  const enriched: EventMessageWithAuthor = {
    id: message.id,
    eventId: message.eventId,
    userId: message.userId,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    author: {
      displayName: message.user.displayName,
      avatarUrl: message.user.avatarUrl,
    },
    timestamp: formatTimestamp(message.createdAt.toISOString()),
  };

  return NextResponse.json(enriched);
}
