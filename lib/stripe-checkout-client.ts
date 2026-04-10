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
