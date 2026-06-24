import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // ponytail: no Supabase config → treat all users as unauthenticated
  if (!url || !key) {
    const response = NextResponse.next({ request });
    const pathname = request.nextUrl.pathname;
    if (isProtectedApiRoute(pathname, request.method)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (pathname === "/dashboard") {
      const dest = request.nextUrl.clone();
      dest.pathname = "/auth";
      dest.searchParams.set("next", "/dashboard");
      return NextResponse.redirect(dest);
    }
    if (pathname === "/auth") {
      const next = request.nextUrl.searchParams.get("next") ?? "/events";
      const dest = request.nextUrl.clone();
      dest.pathname = next.startsWith("/") ? next : "/events";
      dest.search = "";
      return NextResponse.redirect(dest);
    }
    return response;
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(url, key, {
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
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/auth/callback")) {
    return supabaseResponse;
  }

  if (isProtectedApiRoute(pathname, request.method)) {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return supabaseResponse;
  }

  if (pathname === "/dashboard" && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("next", "/dashboard");
    return NextResponse.redirect(url);
  }

  if (pathname === "/auth" && user) {
    const next = request.nextUrl.searchParams.get("next") ?? "/events";
    const url = request.nextUrl.clone();
    url.pathname = next.startsWith("/") ? next : "/events";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
