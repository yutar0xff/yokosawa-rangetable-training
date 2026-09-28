import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SITE_URL } from "./lib/basePath";

const ENABLE_CANONICAL_REDIRECT =
  process.env.ENABLE_VERCEL_CANONICAL_REDIRECT === "true";
const CANONICAL_REDIRECT_URL =
  process.env.VERCEL_CANONICAL_REDIRECT_URL ?? SITE_URL;
const PROXY_MARKER_HEADER = "x-portfolio-proxy";

function isVercelHost(host: string): boolean {
  return host.endsWith(".vercel.app");
}

function shouldRedirect(request: NextRequest): boolean {
  if (!ENABLE_CANONICAL_REDIRECT || !CANONICAL_REDIRECT_URL) return false;

  const host = request.headers.get("host") ?? "";
  const hasProxyMarker = request.headers.has(PROXY_MARKER_HEADER);
  return isVercelHost(host) && !hasProxyMarker;
}

export function proxy(request: NextRequest) {
  if (!shouldRedirect(request)) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    CANONICAL_REDIRECT_URL,
  );
  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: "/:path*",
};
