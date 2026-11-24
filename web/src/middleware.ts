import { NextRequest, NextResponse } from "next/server";
import { isAdminProtectedPath, verifyAdminAccess } from "@/lib/adminAccess";

export function middleware(request: NextRequest) {
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
  matcher: ["/cms/:path*", "/studio/:path*", "/dashboard/:path*"],
};
