import { NextResponse } from "next/server";

const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon query params required" },
      { status: 400 }
    );
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
    return NextResponse.json(
      { error: "lat and lon must be valid numbers" },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams({
      lat: String(latNum),
      lon: String(lonNum),
      format: "jsonv2",
    });
    const res = await fetch(`${NOMINATIM_REVERSE_URL}?${params}`, {
      headers: {
        "User-Agent": "Mapinly/1.0 (contact@mapinly.app)",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { displayName: `${latNum.toFixed(6)}, ${lonNum.toFixed(6)}` },
        { status: 200 }
      );
    }

    const data = (await res.json()) as { display_name?: string };
    const displayName = data.display_name ?? `${latNum.toFixed(6)}, ${lonNum.toFixed(6)}`;
    return NextResponse.json({ displayName });
  } catch {
    return NextResponse.json(
      { displayName: `${latNum.toFixed(6)}, ${lonNum.toFixed(6)}` },
      { status: 200 }
    );
  }
}
