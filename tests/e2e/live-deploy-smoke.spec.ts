import { test, expect } from "@playwright/test";

const LIVE = "https://glp-convert.vercel.app";

test.describe("live deploy smoke", () => {
  test.use({ baseURL: LIVE });

  test("/pricing renders brand-color Start setup CTA with price", async ({ page }) => {
    await page.goto(`${LIVE}/pricing?company=Sunspire+Weight+Clinic&primary=%23146EF5&_v=${Date.now()}`, { waitUntil: "networkidle" });
    const cta = page.getByRole("button", { name: /Start setup/i }).first();
    await expect(cta).toBeVisible({ timeout: 15_000 });
    await expect(cta).toContainText(/\$399/);
    await expect(cta).toContainText(/\$99\/mo/);
    const bg = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
    console.log("Start setup bg:", bg);
    expect(bg.toLowerCase()).not.toContain("rgb(15, 23, 42)");
    await expect(page.getByText(/Risk reversal/i).first()).toBeVisible();
    await expect(page.getByText(/multi-year lock-in/i).first()).toBeVisible();
  });

  test("/intake step 2 renders chart, owner CTAs, no always-on checkpoint chip", async ({ page }) => {
    await page.goto(`${LIVE}/intake?company=Sunspire+Weight+Clinic&primary=%23146EF5&demo=1&_v=${Date.now()}`, { waitUntil: "networkidle" });
    await page.getByLabel(/Current weight/i).first().fill("220");
    await page.getByLabel(/Goal weight/i).first().fill("180");
    await page.getByLabel(/Height/i).first().fill("66");
    const next = page.getByRole("button", { name: /continue/i }).first();
    await next.click();
    await page.waitForTimeout(2500);
    /** Patient-view orientation strip for cold-email demos (pass 8). */
    await expect(page.locator("[data-intake-patient-view-banner]").first()).toBeVisible({ timeout: 5000 });
    /** Chart still renders (sanity). */
    await expect(page.locator("[data-results-chart]").first()).toBeVisible({ timeout: 15_000 });
    /** Always-on "Modeled checkpoint X%" chip must be gone (now lives only in tooltip / summary tile). */
    await expect(page.locator("[data-results-chart-final-chip]")).toHaveCount(0);
    /** New owner-block primary + secondary CTAs both present. */
    await expect(page.locator("[data-demo-owner-cta]").first()).toBeVisible();
    await expect(page.locator("[data-demo-owner-cta]").first()).toContainText(/Activate for Sunspire Weight Clinic/);
    await expect(page.locator("[data-demo-owner-support]").first()).toBeVisible();
    await expect(page.locator("[data-demo-owner-support]").first()).toContainText(/Contact support/i);
  });

  test("/support has Send Message mailto + brand-styled disclaimer at bottom", async ({ page }) => {
    await page.goto(`${LIVE}/support?company=Sunspire+Weight+Clinic&primary=%23146EF5&_v=${Date.now()}`, { waitUntil: "networkidle" });
    const sendMessage = page.getByRole("link", { name: /send message/i }).first();
    await expect(sendMessage).toBeVisible({ timeout: 15_000 });
    await expect(sendMessage).toHaveAttribute("href", /mailto:support@glpconvert\.com/);
    const compliance = page.getByText(/HIPAA hub/i).first();
    await expect(compliance).toBeVisible();
    const box = await compliance.boundingBox();
    console.log("Compliance Y:", box?.y);
    const vh = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log("Page scrollHeight:", vh);
    expect((box?.y ?? 0) > vh / 2).toBe(true);
  });

  test("/partners disclaimer is at bottom not top", async ({ page }) => {
    await page.goto(`${LIVE}/partners?company=Sunspire+Weight+Clinic&primary=%23146EF5&_v=${Date.now()}`, { waitUntil: "networkidle" });
    const disclaimer = page.getByText(/Partner terms are governed by/i).first();
    await expect(disclaimer).toBeVisible({ timeout: 15_000 });
    const box = await disclaimer.boundingBox();
    const vh = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log("Partners disclaimer Y:", box?.y, "/ scrollHeight:", vh);
    expect((box?.y ?? 0) > vh / 2).toBe(true);
  });

  test("/docs/embed surfaces branded subdomain as recommended", async ({ page }) => {
    await page.goto(`${LIVE}/docs/embed?_v=${Date.now()}`, { waitUntil: "networkidle" });
    await expect(page.getByText(/Branded subdomain/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Recommended/i).first()).toBeVisible();
  });

  test("/api/support-ticket accepts a valid ticket and returns ok", async ({ request }) => {
    const res = await request.post(`${LIVE}/api/support-ticket`, {
      headers: { "Content-Type": "application/json" },
      data: {
        subject: "live smoke ticket — ignore",
        email: "smoke-test@example.com",
        message: "Live deploy smoke test ticket. Safe to ignore.",
        priority: "normal",
      },
    });
    expect(res.status(), `expected 200, got ${res.status()} ${await res.text()}`).toBe(200);
    const body = (await res.json()) as { ok?: boolean; delivered?: boolean; message?: string };
    expect(body.ok, "support ticket POST did not return ok").toBe(true);
    expect(typeof body.delivered).toBe("boolean");
    expect(body.message).toBeTruthy();
  });

  test("/api/stripe/create-checkout-session returns a valid Stripe URL", async ({ request }) => {
    const res = await request.post(`${LIVE}/api/stripe/create-checkout-session`, {
      headers: { "Content-Type": "application/json" },
      data: {
        plan: "starter",
        company: "Sunspire Weight Clinic",
        tenant_handle: "glpconvert",
        utm_source: "smoke",
        utm_medium: "playwright",
        utm_campaign: "live-deploy-smoke",
        cancel_url: `${LIVE}/pricing`,
        client_reference_id: `smoke_${Date.now()}`,
      },
    });
    /**
     * If this is 500 with `automatic tax / valid head office address`, the
     * Stripe Tax setting was re-enabled without dashboard config — the
     * automatic_tax flag must remain opt-in via STRIPE_AUTOMATIC_TAX.
     */
    expect(res.status(), `expected 2xx, got ${res.status()} ${await res.text()}`).toBe(200);
    const body = (await res.json()) as { url?: string; sessionId?: string; livemode?: boolean };
    expect(body.url, "missing checkout url in response").toBeTruthy();
    expect(body.url!).toMatch(/^https:\/\/checkout\.stripe\.com\//);
    expect(body.sessionId, "missing sessionId in response").toBeTruthy();
  });

  test("intake owner-block 'Activate' CTA routes to /pricing with attribution", async ({ page }) => {
    await page.goto(
      `${LIVE}/intake?company=Sunspire+Weight+Clinic&primary=%23146EF5&demo=1&utm_source=cold-email&_v=${Date.now()}`,
      { waitUntil: "networkidle" },
    );
    await page.getByLabel(/Current weight/i).first().fill("220");
    await page.getByLabel(/Goal weight/i).first().fill("180");
    await page.getByLabel(/Height/i).first().fill("66");
    await page.getByRole("button", { name: /continue/i }).first().click();
    await page.waitForTimeout(2500);
    const cta = page.locator("[data-demo-owner-cta]").first();
    await expect(cta).toBeVisible({ timeout: 15_000 });
    const href = await cta.getAttribute("href");
    expect(href, "owner CTA missing href").toBeTruthy();
    expect(href!).toContain("/pricing?");
    expect(href!).toContain("company=Sunspire");
    expect(href!).toContain("utm_source=cold-email");
  });
});
