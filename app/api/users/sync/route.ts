import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    (user.email as string) ??
    "User";
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  await prisma.profile.upsert({
    where: { id: user.id },
    create: { id: user.id, displayName, avatarUrl: avatarUrl ?? null },
    update: { displayName, avatarUrl: avatarUrl ?? null, updatedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
