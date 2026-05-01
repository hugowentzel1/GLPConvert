"use client";

import { getMergedUtm, persistUtmFromSearchParams } from "@/lib/glp-attribution";

export type StripeCheckoutClientPayload = {
  plan: string;
  company: string | null;
  token: string | null;
  tenant_handle: string | null;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  cancel_url: string;
  client_reference_id: string;
};

/** Build POST body for `/api/stripe/create-checkout-session` from the browser (UTMs merged with sessionStorage). */
export function buildStripeCheckoutClientPayload(): StripeCheckoutClientPayload {
  if (typeof window === "undefined") {
    return {
      plan: "starter",
      company: null,
      token: null,
      tenant_handle: null,
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
      cancel_url: "",
      client_reference_id: "",
    };
  }

  const sp = new URLSearchParams(window.location.search);
  persistUtmFromSearchParams(sp);
  const utm = getMergedUtm(sp);

  const company = sp.get("company");
  const token = sp.get("token");
  const tenant_handle = sp.get("handle") || sp.get("tenant_handle");

  const safeCompany = (company || "anon").replace(/[^a-z0-9]+/gi, "_").slice(0, 48);
  const client_reference_id = `glp_${safeCompany}_${Date.now()}`.slice(0, 200);

  return {
    plan: "starter",
    company,
    token,
    tenant_handle,
    utm_source: utm.utmSource || "",
    utm_medium: utm.utmMedium || "",
    utm_campaign: utm.utmCampaign || "",
    utm_term: utm.utmTerm || "",
    utm_content: utm.utmContent || "",
    cancel_url: window.location.href,
    client_reference_id,
  };
}

/**
 * One-click "Activate" → Stripe Checkout. POSTs to
 * `/api/stripe/create-checkout-session` and redirects to the returned
 * Stripe URL. If the request fails (rate limit, missing env var,
 * network), navigates to `fallbackHref` (typically `/pricing?...`) so
 * the buyer never lands on a dead end. Used by every "buying" CTA on
 * the site (intake hero, intake nav, owner-panel Activate, Step 5
 * Activate, etc.) so cold-email landings reach checkout in a single
 * click — best-practice pattern from Stripe Atlas / Linear / Vercel /
 * Pipe / Ramp 2025 SaaS teardowns.
 */
export async function redirectToStripeCheckout(opts: { fallbackHref: string }): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const payload = buildStripeCheckoutClientPayload();
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`stripe checkout responded ${res.status}`);
    const data = (await res.json()) as { url?: unknown };
    if (typeof data?.url === "string" && data.url.length > 0) {
      window.location.href = data.url;
      return;
    }
    throw new Error("stripe checkout returned no url");
  } catch (err) {
    console.error("[redirectToStripeCheckout] failed, falling back", err);
    window.location.href = opts.fallbackHref;
  }
}
