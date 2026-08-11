import { NextResponse } from "next/server";

function isAccessTokenValid(token) {
  if (!token) return false;
  try {
    const payloadSegment = token.split(".")[1];
    const payload = JSON.parse(Buffer.from(payloadSegment, "base64").toString("utf8"));
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Optimistic check only: decodes (does not verify signature) the access_token
// cookie so redirects are fast. The real security boundary is the backend's
// JwtAuthGuard, which verifies and enforces auth/RBAC on every request.
export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    const accessToken = request.cookies.get("access_token")?.value;
    if (!isAccessTokenValid(accessToken)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
