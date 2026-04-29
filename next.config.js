const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').nextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // App directory is now stable in Next.js 14

  // Security headers
  async headers() {
    /**
     * upgrade-insecure-requests + HSTS only on Vercel production builds.
     * Local / preview dev must not upgrade http://localhost CSS URLs or the UI renders unstyled.
     */
    /** Only upgrade on real Vercel deploys (production build). Avoids https://localhost CSS breaks with `vercel dev`. */
    const useCspUpgrade =
      process.env.VERCEL === "1" && process.env.NODE_ENV === "production";

    /**
     * Pass-6: framing policy is enforced by the runtime middleware
     * (`middleware.ts`) so we can branch per-pathname (only `/intake/*`
     * and `/embed/*` are embeddable; everything else stays strict).
     * Headers declared here apply to ALL routes, so we deliberately
     * omit `frame-ancestors` and `X-Frame-Options` from this block —
     * the middleware sets the right value depending on path. If we
     * left a strict default here, Vercel would emit BOTH a strict
     * static header and our permissive middleware header, and the
     * stricter one wins.
     */
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://js.sentry-cdn.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https: wss: https://*.sentry.io https://api.resend.com",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ];
    if (useCspUpgrade) {
      cspDirectives.push("upgrade-insecure-requests");
    }

    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
      { key: "X-Commit-SHA", value: process.env.NEXT_PUBLIC_COMMIT_SHA || "unknown" },
      { key: "Content-Security-Policy", value: cspDirectives.join("; ") },
      {
        key: "Permissions-Policy",
        value: [
          "geolocation=()",
          "microphone=()",
          "camera=()",
          "payment=(self)",
        ].join(", "),
      },
    ];

    if (useCspUpgrade) {
      securityHeaders.splice(3, 0, {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      });
    }

    return [{ source: "/(.*)", headers: securityHeaders }];
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ["@heroicons/react"],
  },

  // Bundle analyzer (optional - remove in production)
  // bundleAnalyzer: process.env.ANALYZE === 'true',

  images: {
    unoptimized: true, // TEMP: bypass image optimization to fix Vercel thumbnail
    domains: ["www.google.com", "google.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons/**",
      },
      {
        protocol: "https",
        hostname: "google.com",
        pathname: "/s2/favicons/**",
      },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/favicons/**" },
    ],
  },
};

// Keep Sentry quiet in local/dev unless explicitly enabled
const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
