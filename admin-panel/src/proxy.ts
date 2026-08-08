import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/session";

// Next.js 16 renamed `middleware.ts` to `proxy.ts` — same NextRequest/NextResponse
// APIs, same purpose. This performs the *optimistic* auth check (cookie present
// and JWT valid) that gates every page. It does NOT check whether the specific
// [role] segment in the URL matches the caller's role — that's a secure check
// done in app/[role]/layout.tsx against live session data on every request.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === "/auth" || pathname.startsWith("/auth/");

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    if (isAuthRoute) return NextResponse.next();

    const loginUrl = new URL("/auth/login", request.url);
    if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute || pathname === "/") {
    return NextResponse.redirect(new URL(`/${session.role}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Everything except static assets and API routes (each Route Handler
  // manages its own auth and returns proper JSON status codes instead of
  // an HTML redirect).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico)$).*)"],
};
