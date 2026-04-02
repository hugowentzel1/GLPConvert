import { NextResponse } from "next/server";
import { isValidSubdomain } from "@/src/lib/domainRoot";

/**
 * Build CSP to match next.config.js intent:
 * - On Vercel (HTTPS): allow upgrade-insecure-requests
 * - On loopback: never send upgrade-insecure-requests — even if VERCEL=1 (`vercel dev`), or the browser
 *   will try https://localhost/_next/static/css/... and styles fail (unstyled “Times” page).
 */
function buildContentSecurityPolicy(hostname: string): string {
  const onVercel = process.env.VERCEL === "1";
  const isLoopback =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]";
  const useUpgrade = onVercel && !isLoopback;

  const parts = [
    "default-src 'self'",
    "img-src 'self' data: https: blob:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://js.sentry-cdn.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https: wss: https://*.sentry.io https://api.resend.com",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ];

  if (process.env.ALLOW_EMBED === "1") {
    parts.push("frame-ancestors *");
  } else {
    parts.push("frame-ancestors 'none'");
  }

  if (useUpgrade) {
    parts.push("upgrade-insecure-requests");
  }

  return parts.join("; ") + ";";
}

export function middleware(req: Request) {
  const url = new URL(req.url);

  if (url.pathname === "/refund") {
    return NextResponse.redirect(new URL("/terms#refunds", url.origin));
  }

  const res = NextResponse.next();

  const csp = buildContentSecurityPolicy(url.hostname);
  res.headers.set("Content-Security-Policy", csp);

  if (process.env.ALLOW_EMBED === "1") {
    res.headers.set("X-Frame-Options", "SAMEORIGIN");
  } else {
    res.headers.set("X-Frame-Options", "DENY");
  }

  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  if (url.searchParams.get("demo") === "1") {
    res.headers.set("x-demo", "1");
  }

  const hostname = url.hostname;
  const pathname = url.pathname;

  if (
    !hostname.includes("usesunspire.com") &&
    !hostname.includes("localhost")
  ) {
    if (isValidSubdomain(hostname)) {
      const subdomain = hostname.split(".")[0];
      res.headers.set("x-tenant", subdomain);
      res.headers.set("x-custom-domain", "true");
    } else {
      res.headers.set("x-tenant", "default");
      res.headers.set("x-custom-domain", "true");
    }
  } else {
    if (hostname.includes("solarpro") || pathname.startsWith("/solarpro")) {
      res.headers.set("x-tenant", "solarpro");
    } else if (
      hostname.includes("ecosolar") ||
      pathname.startsWith("/ecosolar")
    ) {
      res.headers.set("x-tenant", "ecosolar");
    } else if (
      hostname.includes("premiumsolar") ||
      pathname.startsWith("/premiumsolar")
    ) {
      res.headers.set("x-tenant", "premiumsolar");
    } else if (hostname.includes("acme") || pathname.startsWith("/acme")) {
      res.headers.set("x-tenant", "acme");
    } else if (hostname.includes(".usesunspire.com")) {
      const subdomain = hostname.split(".")[0];
      res.headers.set("x-tenant", subdomain);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
