/**
 * POST /api/tenant/settings — Update buyer-configurable tenant fields.
 *
 * One endpoint, six fields, two auth modes:
 *
 *   Auth (either is sufficient):
 *     - `token`           — JWT magic-link token from the onboarding email.
 *     - `sessionId` /
 *       `session_id`      — Stripe Checkout session id (only accepted if the
 *                           session is `paid` and `metadata.company` /
 *                           `metadata.tenant_handle` matches).
 *
 *   Fields (all optional — only the ones supplied are written):
 *     - `displayName`        → `name`
 *     - `brandColor`         → `brand_colors` (single hex; we store the JSON
 *                              `{"primary":"#xxxxxx"}` so the public intake
 *                              config helper still works).
 *     - `logoUrl`            → `logo_url`
 *     - `bookingUrl`         → `crm_keys.booking_url` (merged into the JSON
 *                              column so other CRM keys aren't clobbered).
 *     - `notificationEmail`  → `notification_email`
 *     - `crmWebhookUrl`      → `capture_url`  (cleared with empty string).
 *
 * This is the single place the buyer dashboard writes settings. The
 * narrower `/api/tenant/crm-webhook` endpoint stays for backward compat
 * but the dashboard uses this one.
 *
 * Pass-6 — see /c/[handle]/settings page.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  findTenantByHandle,
  upsertTenantByHandle,
  TENANT_FIELDS,
} from "@/src/lib/storage";
import { verifyMagicLinkToken } from "@/src/server/auth/jwt";
import { getStripe } from "@/src/lib/stripe";

function slugifyHandle(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

function isHttpsUrl(s: unknown): s is string {
  return typeof s === "string" && /^https:\/\/[^\s]+$/i.test(s);
}

function isHexColor(s: unknown): s is string {
  return typeof s === "string" && /^#[0-9a-f]{6}$/i.test(s);
}

function isEmail(s: unknown): s is string {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      companyHandle?: string;
      token?: string;
      sessionId?: string;
      session_id?: string;
      displayName?: string;
      brandColor?: string;
      logoUrl?: string;
      bookingUrl?: string;
      notificationEmail?: string;
      crmWebhookUrl?: string;
      /** Pass-7: optional array of up to 3 care packages, merged into `crm_keys.packages`. */
      packages?: Array<{
        title?: string | null;
        priceLabel?: string | null;
        items?: Array<string | null> | null;
      }>;
    };

    const requested = slugifyHandle(body.companyHandle ?? "");
    if (!requested) {
      return NextResponse.json(
        { ok: false, error: "companyHandle is required" },
        { status: 400 },
      );
    }

    /** Auth */
    let allowed = false;
    if (body.token) {
      const payload = await verifyMagicLinkToken(body.token);
      if (payload?.company && slugifyHandle(payload.company) === requested) {
        allowed = true;
      }
    }
    const sessionId = body.sessionId ?? body.session_id;
    if (!allowed && sessionId) {
      try {
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const meta = (session.metadata ?? {}) as Record<string, string>;
        const sessionHandle = slugifyHandle(meta.tenant_handle ?? meta.company ?? "");
        if (sessionHandle === requested && session.payment_status === "paid") {
          allowed = true;
        }
      } catch {
        // intentional — fall through to 401
      }
    }
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized — magic-link token or paid session_id required" },
        { status: 401 },
      );
    }

    /** Validate + map */
    const fields: Record<string, unknown> = {};

    if (body.displayName != null) {
      const v = String(body.displayName).trim().slice(0, 120);
      if (v.length > 0) fields["name"] = v;
    }

    if (body.brandColor != null) {
      const v = String(body.brandColor).trim();
      if (!isHexColor(v)) {
        return NextResponse.json(
          { ok: false, error: "brandColor must be a 6-digit hex like #146EF5" },
          { status: 400 },
        );
      }
      fields[TENANT_FIELDS.BRAND_COLORS] = JSON.stringify({ primary: v });
    }

    if (body.logoUrl != null) {
      const v = String(body.logoUrl).trim();
      if (v.length > 0 && !isHttpsUrl(v)) {
        return NextResponse.json(
          { ok: false, error: "logoUrl must be an https URL or empty" },
          { status: 400 },
        );
      }
      fields[TENANT_FIELDS.LOGO_URL] = v;
    }

    /**
     * `crm_keys` is the JSON catch-all column. We merge any of
     *   - bookingUrl  → `booking_url`
     *   - packages    → `packages`
     * into the existing JSON so other keys (e.g. `intake_brand_name`) are
     * preserved. Both fields can be sent in one PATCH and end up in a
     * single Supabase write.
     */
    const wantsBookingUrl = body.bookingUrl != null;
    const wantsPackages = Array.isArray(body.packages);
    if (wantsBookingUrl || wantsPackages) {
      const existing = await findTenantByHandle(requested);
      let merged: Record<string, unknown> = {};
      const raw = existing?.[TENANT_FIELDS.CRM_KEYS] as string | undefined;
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as unknown;
          if (parsed && typeof parsed === "object") merged = parsed as Record<string, unknown>;
        } catch {
          // fall through with empty merged
        }
      }

      if (wantsBookingUrl) {
        const v = String(body.bookingUrl).trim();
        if (v.length > 0 && !isHttpsUrl(v)) {
          return NextResponse.json(
            { ok: false, error: "bookingUrl must be an https URL or empty" },
            { status: 400 },
          );
        }
        merged.booking_url = v;
      }

      if (wantsPackages) {
        /** Sanitize packages — at most 3, items capped at 3 each, every string trimmed + length-clamped. */
        const sanitized: Array<{ title: string; priceLabel: string | null; items: string[] }> = [];
        for (const entry of body.packages ?? []) {
          if (!entry) continue;
          const title = typeof entry.title === "string" ? entry.title.trim().slice(0, 80) : "";
          if (!title) continue;
          const priceLabelRaw =
            typeof entry.priceLabel === "string" ? entry.priceLabel.trim().slice(0, 80) : "";
          const items: string[] = [];
          if (Array.isArray(entry.items)) {
            for (const it of entry.items) {
              if (typeof it !== "string") continue;
              const t = it.trim().slice(0, 120);
              if (t) items.push(t);
              if (items.length >= 3) break;
            }
          }
          sanitized.push({ title, priceLabel: priceLabelRaw || null, items });
          if (sanitized.length >= 3) break;
        }
        merged.packages = sanitized;
      }

      fields[TENANT_FIELDS.CRM_KEYS] = JSON.stringify(merged);
    }

    if (body.notificationEmail != null) {
      const v = String(body.notificationEmail).trim();
      if (v.length > 0 && !isEmail(v)) {
        return NextResponse.json(
          { ok: false, error: "notificationEmail must be a valid email or empty" },
          { status: 400 },
        );
      }
      fields[TENANT_FIELDS.NOTIFICATION_EMAIL] = v;
    }

    if (body.crmWebhookUrl != null) {
      const v = String(body.crmWebhookUrl).trim();
      if (v.length > 0 && !isHttpsUrl(v)) {
        return NextResponse.json(
          { ok: false, error: "crmWebhookUrl must be an https URL or empty" },
          { status: 400 },
        );
      }
      fields[TENANT_FIELDS.CAPTURE_URL] = v;
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ ok: true, message: "No changes" });
    }

    await upsertTenantByHandle(requested, fields);
    return NextResponse.json({ ok: true, message: "Settings saved." });
  } catch (err) {
    console.error("[tenant/settings] error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to save settings" },
      { status: 500 },
    );
  }
}
