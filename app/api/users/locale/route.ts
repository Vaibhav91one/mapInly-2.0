import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SUPPORTED_LOCALES = ["en", "es", "de", "fr", "it", "pt", "zh"] as const;

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { preferredLocale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { preferredLocale } = body;
  if (typeof preferredLocale !== "string" || preferredLocale.trim() === "") {
    return NextResponse.json(
      { error: "preferredLocale must be a non-empty string" },
      { status: 400 }
    );
  }

  if (!SUPPORTED_LOCALES.includes(preferredLocale as (typeof SUPPORTED_LOCALES)[number])) {
    return NextResponse.json(
      { error: `Unsupported locale. Supported: ${SUPPORTED_LOCALES.join(", ")}` },
      { status: 400 }
    );
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    (user.email as string) ??
    "";
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  await prisma.profile.upsert({
    where: { id: user.id },
    create: { id: user.id, displayName, avatarUrl: avatarUrl ?? null, preferredLocale },
    update: { preferredLocale, updatedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
