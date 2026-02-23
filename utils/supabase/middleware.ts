import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * API routes that require authentication (middleware returns 401 if no session).
 * - POST /api/events, /api/forums, /api/events/[slug]/register, /api/events/[slug]/messages
 * - PATCH /api/events/[slug], /api/forums/[slug], /api/users/locale
 * - DELETE /api/events/[slug], /api/forums/[slug]
 * - POST /api/forums/[slug]/comments, /api/users/sync, /api/translate
 * - PATCH /api/forums/[slug]/comments/[commentId]/vote
 *
 * IMPORTANT: When adding new API routes that require user context (POST/PATCH/DELETE
 * with user-specific operations), add them to isProtectedApiRoute below.
 */
function isProtectedApiRoute(pathname: string, method: string): boolean {
  if (pathname === "/api/events" && method === "POST") return true;
  if (pathname === "/api/forums" && method === "POST") return true;
  if (pathname === "/api/translate" && method === "POST") return true;
  if (pathname === "/api/users/sync" && method === "POST") return true;
  if (pathname === "/api/users/locale" && method === "PATCH") return true;
  if (/^\/api\/events\/[^/]+\/register\/?$/.test(pathname) && method === "POST") return true;
  if (/^\/api\/events\/[^/]+\/messages\/?$/.test(pathname) && method === "POST") return true;
  if (/^\/api\/events\/[^/]+\/?$/.test(pathname) && (method === "PATCH" || method === "DELETE")) return true;
  if (/^\/api\/forums\/[^/]+\/?$/.test(pathname) && (method === "PATCH" || method === "DELETE")) return true;
  if (/^\/api\/forums\/[^/]+\/comments\/?$/.test(pathname) && method === "POST") return true;
  if (/^\/api\/forums\/[^/]+\/comments\/[^/]+\/vote\/?$/.test(pathname) && method === "PATCH") return true;
  return false;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Auth callback must remain accessible for OAuth
  if (pathname.startsWith("/auth/callback")) {
    return supabaseResponse;
  }

  // Protected API routes - require auth
  if (isProtectedApiRoute(pathname, request.method)) {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return supabaseResponse;
  }

  // Protected page: dashboard
  if (pathname === "/dashboard" && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("next", "/dashboard");
    return NextResponse.redirect(url);
  }

  // Auth page - redirect authenticated users away
  if (pathname === "/auth" && user) {
    const next = request.nextUrl.searchParams.get("next") ?? "/events";
    const url = request.nextUrl.clone();
    url.pathname = next.startsWith("/") ? next : "/events";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
