import { NextResponse } from "next/server";
import { getRootDomain, isValidSubdomain } from "@/src/lib/domainRoot";

export function middleware(req: Request) {
  const url = new URL(req.url);

  // Redirect refund page to terms#refunds
  if (url.pathname === "/refund") {
    return NextResponse.redirect(new URL("/terms#refunds", url.origin));
  }

  const res = NextResponse.next();

  // Security headers (aligned with next.config.js)
  let csp =
    "default-src 'self'; img-src 'self' data: https: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://js.sentry-cdn.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https: wss: https://*.sentry.io https://api.resend.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests;";

  // Handle embed permissions
  if (process.env.ALLOW_EMBED === "1") {
    // Allow embedding from any domain (for testing)
    csp += " frame-ancestors *;";
    res.headers.set("X-Frame-Options", "SAMEORIGIN");
  } else {
    // Default: deny iframe embedding
    csp += " frame-ancestors 'none';";
    res.headers.set("X-Frame-Options", "DENY");
  }

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // Set demo header for demo pages
  if (url.searchParams.get("demo") === "1") {
    res.headers.set("x-demo", "1");
  }

  // Handle tenant resolution
  const hostname = url.hostname;
  const pathname = url.pathname;

  // Check if this is a custom domain (not usesunspire.com)
  if (
    !hostname.includes("usesunspire.com") &&
    !hostname.includes("localhost")
  ) {
    // This is a custom domain - extract tenant from subdomain or use default
    if (isValidSubdomain(hostname)) {
      const subdomain = hostname.split(".")[0];
      res.headers.set("x-tenant", subdomain);
      res.headers.set("x-custom-domain", "true");
    } else {
      // Apex domain - use default tenant or redirect to subdomain
      res.headers.set("x-tenant", "default");
      res.headers.set("x-custom-domain", "true");
    }
  } else {
    // Handle company-specific URLs for white-label demos and fallback domains
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
      // Extract tenant from subdomain
      const subdomain = hostname.split(".")[0];
      res.headers.set("x-tenant", subdomain);
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
