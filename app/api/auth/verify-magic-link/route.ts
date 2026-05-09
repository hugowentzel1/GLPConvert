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
import { getStripe } from "@/src/lib/stripe";

function slugifyHandle(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

/**
 * Round 33 — also accept Stripe `sessionId` (post-checkout). Stripe's
 * `success_url` redirects buyers to `/c/[handle]?session_id={CHECKOUT_SESSION_ID}`,
 * and the dashboard calls this endpoint immediately to authenticate. Before
 * this change the endpoint only honored a JWT magic-link token, so the
 * dashboard would render "Sign-in required" until the buyer clicked the
 * onboarding email — a noticeable activation gap. Symmetric with
 * `/api/tenant` and `/api/tenant/settings` which already accept either
 * auth path.
 */
async function tenantHandleFromStripeSession(
  sessionId: string,
): Promise<string | null> {
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: [] });
    if (session.payment_status !== "paid") return null;
    const meta = (session.metadata ?? {}) as Record<string, string>;
    const handle = slugifyHandle(meta.tenant_handle ?? meta.company ?? "");
    return handle || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      token?: string;
      sessionId?: string;
      companyHandle?: string;
    };
    const token = (body.token ?? "").trim();
    const sessionId = (body.sessionId ?? "").trim();
    const requested = slugifyHandle(body.companyHandle ?? "");
    if ((!token && !sessionId) || !requested) {
      return NextResponse.json(
        { ok: false, error: "token (or sessionId) and companyHandle are required" },
        { status: 400 },
      );
    }

    let authedHandle: string | null = null;
    let tokenEmail: string | null = null;
    if (token) {
      const payload = await verifyMagicLinkToken(token);
      if (payload?.company) {
        authedHandle = slugifyHandle(payload.company);
        tokenEmail = payload.email ?? null;
      }
    }
    if (!authedHandle && sessionId) {
      authedHandle = await tenantHandleFromStripeSession(sessionId);
    }
    if (!authedHandle) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired link" },
        { status: 401 },
      );
    }
    if (authedHandle !== requested) {
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
      tokenEmail,
      /** Care packages configured by the buyer (Pass 7). */
      packages: cfg.packages,
      /** Patient-facing monthly cost range (Pass 32 — populates the "Monthly cost" tile on intake step 2). */
      pricingMonthlyLow: cfg.pricingMonthlyLow,
      pricingMonthlyHigh: cfg.pricingMonthlyHigh,
    });
  } catch (err) {
    console.error("[verify-magic-link] error:", err);
    return NextResponse.json(
      { ok: false, error: "Verification failed" },
      { status: 500 },
    );
  }
}
