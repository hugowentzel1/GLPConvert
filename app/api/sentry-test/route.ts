import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

// Force dynamic rendering (API routes should never be statically exported)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SENTRY_ENABLE !== "1") {
    return NextResponse.json({ error: "Sentry test disabled in production" }, { status: 403 });
  }
  
  // Intentionally throw to verify Sentry wiring (server-side)
  const error = new Error("Sentry test error (intentional - server-side)");
  Sentry.captureException(error);
  throw error;
}
