import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const publicPaths = ["/", "/zakelijk", "/sitemap.xml", "/robots.txt", "/llms.txt", "/manifest.json", "/privacy", "/voorwaarden", "/cookies"];
const authPaths = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public paths, API routes, static assets
  if (publicPaths.includes(pathname) || pathname.startsWith("/api/") || pathname.startsWith("/_next") || pathname.startsWith("/icons")) {
    return NextResponse.next({ request });
  }

  // Allow auth pages without redirect loops
  const isAuthPage = authPaths.some(p => pathname.startsWith(p)) || pathname.startsWith("/callback");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return NextResponse.next({ request });

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // Redirect authenticated users away from login/signup
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/shifts";
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users to login (except public + auth pages)
  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Master admin — check platform_admins (use service role for this check)
  if (user && pathname.startsWith("/master")) {
    const { createClient } = await import("@supabase/supabase-js");
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey) {
      const admin = createClient(supabaseUrl, serviceKey);
      const { data } = await admin.from("platform_admins").select("id").eq("email", user.email).single();
      if (!data) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
