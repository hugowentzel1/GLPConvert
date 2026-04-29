import { NextRequest, NextResponse } from "next/server";
import { findTenantByHandle } from "@/src/lib/storage";
import { extractPublicIntakeConfig } from "@/lib/tenant-intake-public";

/**
 * Public, read-only: branding + booking URL for white-label intake (no API keys, no webhooks).
 * Clinics set booking_url in tenants.crm_keys JSON: { "booking_url": "https://calendly.com/..." }
 */
export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get("handle")?.trim().toLowerCase();
  if (!handle || !/^[a-z0-9-]{1,64}$/.test(handle)) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }

  try {
    const tenant = await findTenantByHandle(handle);
    const cfg = extractPublicIntakeConfig(tenant, handle);
    return NextResponse.json({
      ok: true,
      handle,
      bookingUrl: cfg.bookingUrl,
      logoUrl: cfg.logoUrl,
      brandColor: cfg.brandColor,
      brandColorSecondary: cfg.brandColorSecondary,
      displayName: cfg.displayName,
      pricingMonthlyLow: cfg.pricingMonthlyLow,
      pricingMonthlyHigh: cfg.pricingMonthlyHigh,
      consultFeeNote: cfg.consultFeeNote,
      paymentNote: cfg.paymentNote,
      /** Up to 3 buyer-configured care packages (Pass 7). */
      packages: cfg.packages,
    });
  } catch (e) {
    console.error("tenant-intake-config:", e);
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
}
