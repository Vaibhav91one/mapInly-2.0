import type { MetadataRoute } from "next";
import demo from "@/data/demo.json";

const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/events",
    "/forums",
    "/dashboard",
    ...demo.events.map((e) => `/events/${e.slug}`),
    ...demo.forums.map((f) => `/forums/${f.slug}`),
  ];
  return paths.map((p) => ({ url: `${base}${p}` }));
}
