import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isEnabled = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_SENTRY_ENABLE === "1";

// Debug logging (only in browser console)
if (typeof window !== "undefined") {
  console.log("[Sentry Client] Initializing...", {
    hasDsn: !!dsn,
    dsnPrefix: dsn ? dsn.substring(0, 30) + "..." : "missing",
    isEnabled,
    nodeEnv: process.env.NODE_ENV,
  });
}

if (dsn && isEnabled) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.05,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.0,
    enabled: true,
    environment: process.env.NODE_ENV || "development",
    beforeSend(event) {
      console.log("[Sentry Client] Capturing event:", event.exception?.values?.[0]?.value);
      return event;
    },
  });
} else {
  console.warn("[Sentry Client] Not initialized:", {
    reason: !dsn ? "Missing NEXT_PUBLIC_SENTRY_DSN" : "Not enabled",
    hasDsn: !!dsn,
    isEnabled,
  });
}

