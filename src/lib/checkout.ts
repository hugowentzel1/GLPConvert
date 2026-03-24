"use client";

export async function startCheckout(explicit?: {
  plan?: "starter" | "pro";
  company?: string | null;
  token?: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
  email?: string | null;
}) {
  try {
    const sp = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : "",
    );
    
    // Capture the current page URL for cancel redirect
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    
    const body = {
      plan: explicit?.plan ?? "starter",
      company: explicit?.company ?? sp.get("company"),
      token: explicit?.token ?? sp.get("token"),
      utm_source: explicit?.utm_source ?? sp.get("utm_source"),
      utm_campaign: explicit?.utm_campaign ?? sp.get("utm_campaign"),
      email: explicit?.email ?? null,
      cancel_url: currentUrl, // Pass current URL for cancel redirect
    };

    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || `Checkout failed (${res.status})`);
    }

    const json = await res.json();
    if (!json?.url) throw new Error("No checkout URL returned");
    window.location.assign(json.url);
  } catch (e) {
    // keep it simple for now
    alert((e as Error).message || "Could not start checkout");
    console.error("[checkout] error", e);
  }
}

/** Auto-attach to anything marked data-cta="primary" (button or link). */
export function attachCheckoutHandlers() {
  if (typeof window === "undefined") return;
  const els = Array.from(
    document.querySelectorAll<HTMLElement>('[data-cta="primary"]'),
  );
  els.forEach((el) => {
    if ((el as any).__boundCheckout) return;
    el.addEventListener("click", (ev) => {
      // Prevent default link behavior so we can start checkout first
      ev.preventDefault?.();
      ev.stopPropagation?.();
      startCheckout();
    });
    (el as any).__boundCheckout = true;
  });
}
