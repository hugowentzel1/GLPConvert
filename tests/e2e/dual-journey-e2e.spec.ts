/**
 * End-to-end coverage for both customer journeys:
 *
 *  1. Buyer journey  — A clinic owner clicks the personalized cold-email demo
 *     link, walks through the intake to step 2, sees the owner-only value
 *     strip, clicks "Activate", lands on /pricing with attribution preserved,
 *     and the Stripe CTA produces a real checkout URL.
 *
 *  2. Patient journey — A patient on the clinic's branded site walks the
 *     full 4-step intake (basics → preview → readiness → save), the lead
 *     POSTs successfully (no "Could not save right now" toast), and step 5
 *     surfaces the configured next step.
 *
 * Runs against `PLAYWRIGHT_BASE_URL` (defaults to live deployment) so this
 * doubles as a deploy smoke test for the full end-to-end flow.
 */
import { test, expect } from "@playwright/test";

const LIVE = process.env.PLAYWRIGHT_BASE_URL ?? "https://glp-convert.vercel.app";

const COMPANY = "Sunspire Weight Clinic";
const PRIMARY = "%23146EF5";

test.describe("dual journey end-to-end", () => {
  test("buyer: cold-email demo → owner CTA → /pricing → Stripe URL", async ({ page, request }) => {
    const intakeUrl = `${LIVE}/intake?company=${encodeURIComponent(COMPANY)}&primary=${PRIMARY}&demo=1&utm_source=cold-email&utm_campaign=outbound-2026q2`;
    await page.goto(intakeUrl, { waitUntil: "networkidle" });

    // Step 1 — fill basics
    await page.getByLabel(/Current weight/i).first().fill("220");
    await page.getByLabel(/Goal weight/i).first().fill("180");
    await page.getByLabel(/Height/i).first().fill("66");

    const continueBtn = page.locator("[data-intake-continue]").first();
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();

    // Step 2 — owner block visible with both CTAs
    await expect(page.locator("[data-flow-step=\"2\"]").first()).toBeVisible({ timeout: 15_000 });
    const ownerCta = page.locator("[data-demo-owner-cta]").first();
    await expect(ownerCta).toBeVisible({ timeout: 12_000 });
    const ownerSupport = page.locator("[data-demo-owner-support]").first();
    await expect(ownerSupport).toBeVisible();

    const ownerHref = await ownerCta.getAttribute("href");
    expect(ownerHref, "owner CTA missing href").toBeTruthy();
    expect(ownerHref!).toContain("/pricing?");
    /**
     * URLSearchParams uses `+` (form-encoding) for spaces; encodeURIComponent
     * uses `%20`. Either is valid, so assert on the company token alone.
     */
    expect(ownerHref!).toMatch(/company=Sunspire(\+|%20)Weight(\+|%20)Clinic/);
    expect(ownerHref!).toContain("utm_source=cold-email");

    // Care package preview is present and labeled with company
    const carePackage = page.locator("[data-results-care-package]").first();
    await expect(carePackage).toBeVisible();
    await expect(carePackage).toContainText(`configured by ${COMPANY}`);

    // Click owner CTA — lands on /pricing with attribution preserved
    await Promise.all([page.waitForURL(/\/pricing\?/, { timeout: 15_000 }), ownerCta.click()]);
    await expect(page).toHaveURL(/\/pricing\?/);
    expect(page.url()).toMatch(/company=Sunspire(\+|%20)Weight(\+|%20)Clinic/);
    expect(page.url()).toContain("utm_source=cold-email");

    // Pricing CTA is brand color, not slate-black
    const startSetup = page.getByTestId("pricing-start-setup");
    await expect(startSetup).toBeVisible();
    const bg = await startSetup.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg, "Start setup must use brand color").not.toBe("rgb(15, 23, 42)");

    // Stripe API returns a real checkout URL
    const stripeRes = await request.post(`${LIVE}/api/stripe/create-checkout-session`, {
      headers: { "Content-Type": "application/json" },
      data: {
        plan: "starter",
        company: COMPANY,
        tenant_handle: "glpconvert",
        utm_source: "cold-email",
        utm_campaign: "outbound-2026q2",
        cancel_url: `${LIVE}/pricing`,
        client_reference_id: `dual_journey_${Date.now()}`,
      },
    });
    expect(stripeRes.status()).toBe(200);
    const stripeBody = (await stripeRes.json()) as { url?: string };
    expect(stripeBody.url, "missing stripe url").toBeTruthy();
    expect(stripeBody.url!).toMatch(/^https:\/\/checkout\.stripe\.com\//);
  });

  test("patient: full 4-step intake → save → step 5 (no save error)", async ({ page }) => {
    const intakeUrl = `${LIVE}/intake?company=${encodeURIComponent(COMPANY)}&primary=${PRIMARY}`;
    await page.goto(intakeUrl, { waitUntil: "networkidle" });

    // Step 1 — basics
    await page.getByLabel(/Current weight/i).first().fill("220");
    await page.getByLabel(/Goal weight/i).first().fill("180");
    await page.getByLabel(/Height/i).first().fill("66");
    await page.locator("[data-intake-continue]").first().click();

    // Step 2 — wait for it then continue
    await expect(page.locator("[data-flow-step=\"2\"]").first()).toBeVisible({ timeout: 20_000 });
    await page.getByRole("button", { name: /continue to readiness/i }).click();

    // Step 3 — readiness — pick one button in each of the three fieldsets.
    await expect(page.locator("[data-flow-step=\"3\"]").first()).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: /yes,? roughly/i }).click();
    await page.getByRole("button", { name: /soon \(weeks\)/i }).click();
    await page.getByRole("button", { name: /^yes$/i }).click();
    await page.getByRole("button", { name: /continue to save/i }).click();

    // Step 4 — fill name/email/consent + Save and continue
    await expect(page.locator("[data-flow-step=\"4\"]").first()).toBeVisible({ timeout: 15_000 });
    await page.getByLabel(/full name/i).first().fill("Patient Smoke Test");
    await page.getByLabel(/^email$/i).first().fill(`patient_${Date.now()}@example.com`);
    const consent = page.getByRole("checkbox").first();
    if (await consent.isVisible().catch(() => false)) {
      await consent.check().catch(() => undefined);
    }

    const saveBtn = page.getByRole("button", { name: /save and continue/i }).first();
    await saveBtn.click();

    // Step 5 — confirm landing, NO save error visible
    await expect(page.locator("[data-flow-step=\"5\"]").first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/Could not save/i)).toHaveCount(0);
  });
});
