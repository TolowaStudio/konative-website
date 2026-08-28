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

  // Token unset in production: leave /cms and /studio public until konative-ADMIN_ACCESS_TOKEN exists.
  if (access === "disabled") {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Konative Admin", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/cms/:path*", "/studio/:path*", "/dashboard/:path*"],
};
