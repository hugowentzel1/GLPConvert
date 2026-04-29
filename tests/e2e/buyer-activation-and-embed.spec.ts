/**
 * Pass-6 buyer-activation + embed E2E coverage.
 *
 * The dual-journey test in `dual-journey-e2e.spec.ts` already covers the
 * cold-email demo → /pricing → Stripe URL handoff and the patient's
 * 4-step intake save. This file fills in the gaps the buyer hits *after*
 * paying:
 *
 *   - `/c/[handle]` dashboard requires authentication and renders the
 *     "sign-in required" panel when no token / session_id is present.
 *   - `/api/auth/verify-magic-link` rejects malformed / unauthorized
 *     calls with the right HTTP status codes.
 *   - `/api/tenant/settings` rejects unauthenticated writes (401) and
 *     surface-validates payloads (400).
 *   - Cold-email demo intake renders the new "How activation works"
 *     three-step strip *before* the primary "Activate" CTA.
 *   - `/docs/embed` advertises the postMessage iframe auto-resize and
 *     the three-channel lead delivery (dashboard + email + CRM webhook).
 *   - The intake page emits a `glpconvert:resize` postMessage when
 *     embedded inside an iframe.
 */
import { test, expect } from "@playwright/test";

const LIVE =
  process.env.BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? "https://glp-convert.vercel.app";
const COMPANY = "Sunspire Weight Clinic";
const HANDLE = "sunspire-weight-clinic";

test.describe("buyer activation, embed + settings (pass 6)", () => {
  test("dashboard at /c/{handle} requires sign-in", async ({ page }) => {
    await page.goto(`${LIVE}/c/${HANDLE}`, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: /sign-in required/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/welcome email/i)).toBeVisible();
  });

  test("settings page at /c/{handle}/settings requires sign-in", async ({ page }) => {
    await page.goto(`${LIVE}/c/${HANDLE}/settings`, { waitUntil: "networkidle" });
    await expect(page.getByText(/Sign-in required\. Open the magic link/i)).toBeVisible({
      timeout: 15_000,
    });
  });

  test("/api/auth/verify-magic-link rejects bad inputs cleanly", async ({ request }) => {
    const r1 = await request.post(`${LIVE}/api/auth/verify-magic-link`, { data: {} });
    expect(r1.status()).toBe(400);
    const j1 = (await r1.json()) as { ok: boolean; error: string };
    expect(j1.ok).toBe(false);
    expect(j1.error).toMatch(/required/i);

    const r2 = await request.post(`${LIVE}/api/auth/verify-magic-link`, {
      data: { token: "not-a-real-jwt", companyHandle: HANDLE },
    });
    expect(r2.status()).toBe(401);
    const j2 = (await r2.json()) as { ok: boolean; error: string };
    expect(j2.ok).toBe(false);
    expect(j2.error).toMatch(/invalid|expired/i);
  });

  test("/api/tenant/settings rejects unauthenticated writes", async ({ request }) => {
    const r1 = await request.post(`${LIVE}/api/tenant/settings`, {
      data: { companyHandle: HANDLE, brandColor: "#146EF5" },
    });
    expect(r1.status()).toBe(401);

    const r2 = await request.post(`${LIVE}/api/tenant/settings`, {
      data: {},
    });
    expect(r2.status()).toBe(400);
  });

  test("intake demo shows the 3-step activation strip + CTA", async ({ page }) => {
    const intakeUrl = `${LIVE}/intake?company=${encodeURIComponent(COMPANY)}&primary=%23146EF5&demo=1`;
    await page.goto(intakeUrl, { waitUntil: "networkidle" });

    // Walk to step 2 where the owner block lives.
    await page.getByLabel(/Current weight/i).first().fill("220");
    await page.getByLabel(/Goal weight/i).first().fill("180");
    await page.getByLabel(/Height/i).first().fill("66");
    await page.locator("[data-intake-continue]").first().click();

    await expect(page.locator('[data-flow-step="2"]').first()).toBeVisible({ timeout: 15_000 });
    const flow = page.locator("[data-demo-owner-activation-flow]").first();
    await expect(flow).toBeVisible({ timeout: 12_000 });
    await expect(flow).toContainText(/Branded URL/i);
    await expect(flow).toContainText(/Drop into your funnel/i);
    await expect(flow).toContainText(/three ways/i);

    // Primary "Activate" CTA still in place after the strip.
    await expect(page.locator("[data-demo-owner-cta]").first()).toBeVisible();
  });

  test("/docs/embed advertises auto-resize + 3-channel lead delivery", async ({ page }) => {
    await page.goto(`${LIVE}/docs/embed`, { waitUntil: "networkidle" });
    await expect(page.getByText(/glpconvert:resize/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /three channels by default/i })).toBeVisible();
    await expect(page.getByText(/Dashboard/i).first()).toBeVisible();
    await expect(page.getByText(/CRM webhook/i).first()).toBeVisible();
  });

  test("intake emits glpconvert:resize postMessage when iframed", async ({ page, context }) => {
    /**
     * Spin up a tiny host page in the same browser that hosts an iframe
     * pointing at the live intake URL, then assert we receive at least
     * one `glpconvert:resize` event with a positive height. Validates
     * the postMessage protocol shipped in
     * `components/intake/IntakeIframeAutoResize.tsx`.
     *
     * Allow a long timeout because in dev-mode the intake bundle has to
     * fully compile + mount the funnel before our `useEffect` fires.
     */
    test.setTimeout(120_000);
    const intakeUrl = `${LIVE}/intake?company=${encodeURIComponent(COMPANY)}&primary=%23146EF5`;

    await context.route("**/__embed-host", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: `<!doctype html><html><body>
<iframe id="f" src="${intakeUrl}" style="width:100%;min-height:880px;border:0"></iframe>
<script>
  window.__heights = [];
  window.addEventListener("message", function (e) {
    var d = e && e.data;
    if (d && d.type === "glpconvert:resize" && typeof d.height === "number") {
      window.__heights.push(d.height);
    }
  });
</script>
</body></html>`,
      }),
    );

    await page.goto(`${LIVE}/__embed-host`);

    /** Confirm the intake actually mounted inside the iframe. */
    const frame = page.frameLocator("#f");
    await expect(frame.locator("[data-flow-step='1']").first()).toBeVisible({ timeout: 90_000 });

    const heights = await page
      .waitForFunction(
        () => {
          const w = window as unknown as { __heights?: number[] };
          return Array.isArray(w.__heights) && w.__heights.length > 0 ? w.__heights : null;
        },
        null,
        { timeout: 60_000 },
      )
      .then((handle) => handle.jsonValue());

    expect(Array.isArray(heights)).toBe(true);
    expect((heights as number[])[0]).toBeGreaterThan(100);
  });
});
