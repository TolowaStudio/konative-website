import { NextRequest, NextResponse } from "next/server";
import { isAdminProtectedPath, verifyAdminAccess } from "@/lib/adminAccess";

const CANONICAL_HOST = "konative.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (host === `www.${CANONICAL_HOST}`) {
    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  const { pathname } = request.nextUrl;
  if (!isAdminProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const access = verifyAdminAccess(
    request.headers.get("authorization"),
    process.env.ADMIN_ACCESS_TOKEN,
  );

  if (access === "ok") {
    return NextResponse.next();
  }

  // Token unset in production: fail closed — admin surfaces must not be world-readable.
  if (access === "disabled") {
    return new NextResponse("Admin access is not configured", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Konative Admin", charset="UTF-8"' },
  });
}

export const config = {
  // Admin paths + page routes (www→apex). Exclude /api so tile proxy and JSON APIs skip edge middleware.
  matcher: [
    "/cms/:path*",
    "/studio/:path*",
    "/dashboard/:path*",
    "/((?!_next/static|_next/image|api/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
