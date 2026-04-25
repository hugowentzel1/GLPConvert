"use client";

import { Suspense } from "react";
import MarketingLegalShell from "@/components/legal/MarketingLegalShell";
import { PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

/**
 * Cookie policy + preference center.
 *
 * Sources / pattern references:
 * - EU ePrivacy Directive 2002/58/EC + GDPR Recital 30 — consent for non-essential cookies.
 * - EDPB Guidelines 05/2020 on consent (cookie banners must offer a "reject all" option as
 *   prominent as "accept all").
 * - California CPRA — sale/share opt-out interplay with cookies.
 * - Google Consent Mode v2 (2024) — required signaling for ads/analytics.
 */
function CookiesContent() {
  const handleOpenPreferences = () => {
    if (typeof window === "undefined") return;
    const w = window as unknown as Record<string, unknown>;
    if (typeof w.__cmp === "function") {
      (w.__cmp as (cmd: string) => void)("open");
      return;
    }
    if (typeof w.__tcfapi === "function") {
      (w.__tcfapi as (cmd: string, version: number, cb: () => void) => void)(
        "displayConsentUi",
        2,
        () => {},
      );
      return;
    }
    /** Fallback: trigger the in-app cookie consent banner re-open. */
    document.dispatchEvent(new CustomEvent("glpconvert:open-cookie-prefs"));
  };

  return (
    <MarketingLegalShell title="Cookie policy" lastUpdated="April 24, 2026">
      <p>
        {PRODUCT_NAME} uses a small set of cookies and similar storage to operate the service,
        remember your preferences, measure aggregate traffic, and process payments via Stripe.
        Non-essential cookies are only set when you give consent through our cookie banner; you can
        change your mind at any time using the button below.
      </p>

      <h2>Cookie categories</h2>
      <ul>
        <li>
          <strong>Strictly necessary</strong> — session cookies for authentication, CSRF protection,
          load balancing, and Stripe checkout session continuity. Always on; cannot be disabled.
        </li>
        <li>
          <strong>Functional</strong> — remember your dashboard preferences (e.g. theme, recently
          viewed clinic).
        </li>
        <li>
          <strong>Analytics</strong> — aggregate, privacy-respecting product analytics (Plausible /
          Vercel Analytics class). No cross-site tracking and no advertising IDs.
        </li>
        <li>
          <strong>Marketing</strong> — disabled by default. Only enabled if you explicitly opt in.
        </li>
      </ul>

      <h2>Manage your preferences</h2>
      <p>You can re-open the consent banner any time:</p>

      <p className="not-prose">
        <button
          type="button"
          onClick={handleOpenPreferences}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-slate-800"
        >
          Open cookie preferences
        </button>
      </p>

      <h2>Browser-level controls</h2>
      <p>
        You can also block or clear cookies directly in your browser. We respect the{" "}
        <strong>Global Privacy Control (GPC)</strong> signal as a CPRA opt-out for the browser /
        device that sends it.
      </p>

      <h2>Third-party storage</h2>
      <p>
        Stripe (payments) and our error reporting provider may set their own cookies on their
        respective domains. See <a href="https://stripe.com/cookies-policy/legal" rel="noopener">
        Stripe&apos;s cookie policy</a> for details.
      </p>

      <h2>Questions</h2>
      <p>
        For privacy or cookie questions, email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </MarketingLegalShell>
  );
}

export default function CookiesPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-slate-50" aria-label="Loading" />}>
      <CookiesContent />
    </Suspense>
  );
}
