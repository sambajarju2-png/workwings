import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes — no auth needed
  if (pathname === "/" || pathname === "/zakelijk" || pathname.startsWith("/login") || pathname.startsWith("/signup") ||
      pathname.startsWith("/api/") || pathname.startsWith("/callback") || pathname.startsWith("/_next") ||
      pathname === "/sitemap.xml" || pathname === "/robots.txt" || pathname === "/llms.txt" ||
      pathname === "/manifest.json" || pathname.startsWith("/icons")) {
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  const res = NextResponse.next();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return req.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          req.cookies.set(name, value);
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in → redirect to login
  if (!user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Master admin — only platform admins
  if (pathname.startsWith("/master")) {
    const { data: admin } = await supabase.from("platform_admins").select("id").eq("email", user.email).single();
    if (!admin) return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons).*)"],
};
