/**
 * POST /api/auth/verify-magic-link
 *
 * Server-side verification of the JWT magic-link token issued in the
 * post-purchase onboarding email. The buyer dashboard at
 * `/c/[handle]` calls this endpoint to:
 *
 *   1. Validate the token (signed with `JWT_SECRET`/`ADMIN_TOKEN`),
 *   2. Confirm the token's `tenantId` claim matches the requested
 *      handle (case-folded + slugified the same way as the rest of
 *      the app),
 *   3. Return a tenant-scoped session payload so the dashboard can
 *      render real Supabase data and stash the API key in
 *      `sessionStorage` for the leads page.
 *
 * This replaces the previous client-side `atob()` decode (which was
 * incompatible with the JWT signing in `lib/email-service.ts`,
 * meaning every onboarding email led to "Invalid or expired link").
 *
 * Pass-6 fix — see the discovery write-up for context.
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken } from "@/src/server/auth/jwt";
import { findTenantByHandle, TENANT_FIELDS } from "@/src/lib/storage";
import { extractPublicIntakeConfig } from "@/lib/tenant-intake-public";

function slugifyHandle(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      token?: string;
      companyHandle?: string;
    };
    const token = (body.token ?? "").trim();
    const requested = slugifyHandle(body.companyHandle ?? "");
    if (!token || !requested) {
      return NextResponse.json(
        { ok: false, error: "token and companyHandle are required" },
        { status: 400 },
      );
    }

    const payload = await verifyMagicLinkToken(token);
    if (!payload || !payload.company) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired link" },
        { status: 401 },
      );
    }
    const tokenHandle = slugifyHandle(payload.company);
    if (tokenHandle !== requested) {
      return NextResponse.json(
        { ok: false, error: "Token does not belong to this dashboard" },
        { status: 403 },
      );
    }

    const tenant = await findTenantByHandle(requested);
    if (!tenant?.id) {
      return NextResponse.json(
        { ok: false, error: "Tenant not provisioned yet — try again in a minute." },
        { status: 404 },
      );
    }

    const cfg = extractPublicIntakeConfig(tenant, requested);

    return NextResponse.json({
      ok: true,
      handle: requested,
      displayName: cfg.displayName ?? requested,
      apiKey: tenant[TENANT_FIELDS.API_KEY] ?? null,
      brandColor: cfg.brandColor ?? null,
      logoUrl: cfg.logoUrl ?? null,
      bookingUrl: cfg.bookingUrl ?? null,
      notificationEmail:
        (tenant[TENANT_FIELDS.NOTIFICATION_EMAIL] as string | undefined) ?? null,
      crmWebhookUrl:
        (tenant[TENANT_FIELDS.CAPTURE_URL] as string | undefined) ?? null,
      plan: tenant[TENANT_FIELDS.PLAN] ?? null,
      paymentStatus: tenant[TENANT_FIELDS.PAYMENT_STATUS] ?? null,
      tokenEmail: payload.email ?? null,
      /** Care packages configured by the buyer (Pass 7). */
      packages: cfg.packages,
    });
  } catch (err) {
    console.error("[verify-magic-link] error:", err);
    return NextResponse.json(
      { ok: false, error: "Verification failed" },
      { status: 500 },
    );
  }
}
