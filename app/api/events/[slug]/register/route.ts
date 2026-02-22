import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
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
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { registrations: true },
  });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (event.createdBy === user.id) {
    return NextResponse.json(
      { error: "Organizer cannot register for their own event" },
      { status: 400 }
    );
  }

  const alreadyRegistered = event.registrations.some((r) => r.userId === user.id);
  if (!alreadyRegistered) {
    await prisma.eventRegistration.create({
      data: { eventId: event.id, userId: user.id },
    });
  }

  return NextResponse.json({ ok: true });
}
