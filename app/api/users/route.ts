import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids");
  const ids = idsParam ? idsParam.split(",").map((id) => id.trim()).filter(Boolean) : [];
  if (ids.length === 0) {
    return NextResponse.json([]);
  }

  const profiles = await prisma.profile.findMany({
    where: { id: { in: [...new Set(ids)] } },
    select: { id: true, displayName: true, avatarUrl: true },
  });

  return NextResponse.json(
    profiles.map((p) => ({
      id: p.id,
      displayName: p.displayName,
      avatarUrl: p.avatarUrl,
    }))
  );
}
