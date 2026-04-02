/**
 * End-to-end visual regression: two customer journeys (Chromium only in project).
 *
 * 1) Patient / prospect — branded demo intake → results → readiness → lead → confirmation
 * 2) Clinic buyer — branded demo home → Launch → checkout session created (Stripe mocked)
 *
 * Local:  npm run test:glp-visual:local
 * Live:   npm run test:glp-visual:live   (after deploy)
 *
 * View report: npx playwright show-report playwright-report-glp-visual
 */
import { test, expect } from "@playwright/test";

const BRAND = "5b21b6";
const LOGO = encodeURIComponent("https://logo.clearbit.com/stripe.com");
const BOOKING = encodeURIComponent("https://example.com/schedule");

/** Top-level so Playwright can shard workers; npm script sets PLAYWRIGHT_VIDEO=1 for recordings. */
test.use({
  screenshot: "on",
  video: process.env.PLAYWRIGHT_VIDEO === "1" ? "on" : "retain-on-failure",
  trace: "on",
});

/**
 * Intake funnel hydrates inside Suspense; the Continue button can paint before React binds onClick.
 * Retry until step 2 appears so E2E matches real user timing (avoids flaky first click).
 */
async function clickIntakeContinueUntilTransition(page: import("@playwright/test").Page) {
  const continueBtn = page.locator('[data-flow-step="1"]').getByRole("button", { name: /^continue$/i });
  await expect(continueBtn).toBeVisible({ timeout: 20000 });
  await expect(async () => {
    await continueBtn.click({ force: true });
    await expect(page.locator('[data-flow-step="2"]')).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 25000 });
}

async function mockTenantIntakeConfig(page: import("@playwright/test").Page) {
  await page.route("**/api/public/tenant-intake-config**", async (route) => {
    if (route.request().method() !== "GET") return route.continue();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        handle: "glpconvert",
        bookingUrl: "https://example.com/schedule",
        logoUrl: null,
        brandColor: null,
        brandColorSecondary: null,
        displayName: "E2E Med Spa",
        pricingMonthlyLow: null,
        pricingMonthlyHigh: null,
        consultFeeNote: null,
        paymentNote: null,
      }),
    });
  });
}

test.describe("GLPConvert branded E2E (visual)", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("cookie-consent", "accepted");
    });
  });

  test("D — Intake loads global CSS (Tailwind + fonts; local http must not strip stylesheets)", async ({
    page,
  }) => {
    await mockTenantIntakeConfig(page);
    await page.goto("/intake?demo=1&handle=glpconvert&company=CSS%20Check&transition_ms=600", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByText(/GLPConvert — a product of Wellspire LLC/i).first()).toBeVisible({
      timeout: 20000,
    });
    await expect(page.locator('link[rel="stylesheet"]').first()).toBeAttached({ timeout: 20000 });
    expect(await page.locator('link[rel="stylesheet"]').count()).toBeGreaterThan(0);
    const kickerColor = await page
      .getByText(/GLPConvert — a product of Wellspire LLC/i)
      .first()
      .evaluate((el) => getComputedStyle(el).color);
    expect(kickerColor).toMatch(/100,\s*116,\s*139/);
    const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(bodyFont).toMatch(/Inter|ui-sans-serif|system-ui|-apple-system/i);
  });

  test("A — Branded demo intake (patient) full funnel", async ({ page }, testInfo) => {
    await mockTenantIntakeConfig(page);
    await page.route("**/api/lead", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "ok (e2e mock)" }),
      });
    });

    const intakeUrl = `/intake?demo=1&handle=glpconvert&company=E2E%20Med%20Spa&demo_traffic=400&logo=${LOGO}&brand=${BRAND}&brand2=0f172a&booking=${BOOKING}&transition_ms=10000`;
    await page.goto(intakeUrl, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /your glp path/i })).toBeVisible({ timeout: 20000 });
    await page.screenshot({ path: testInfo.outputPath("visual-A1-intake-input.png"), fullPage: true });

    await clickIntakeContinueUntilTransition(page);

    await expect(page.locator('[data-flow-step="2"]')).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: testInfo.outputPath("visual-A2-building.png"), fullPage: true });

    await expect(page.locator('[data-flow-step="3"]').getByRole("heading", { name: /your glp path/i })).toBeVisible({
      timeout: 30000,
    });
    await expect(page.getByText(/typical monthly range/i)).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("visual-A3-results.png"), fullPage: true });

    await page.locator('[data-flow-step="3"]').getByRole("button", { name: /review my next step/i }).click();

    await expect(page.getByRole("heading", { name: "Consult readiness", exact: true })).toBeVisible();
    await page.getByRole("button", { name: /yes, roughly/i }).click();
    await page.getByRole("button", { name: /soon \(weeks\)/i }).click();
    await page.getByRole("button", { name: /^yes$/i }).first().click();
    await page.screenshot({ path: testInfo.outputPath("visual-A4-readiness.png"), fullPage: true });

    await page.getByRole("button", { name: /save \/ book/i }).click();

    await expect(page.getByLabel(/full name/i)).toBeVisible();
    const stamp = Date.now();
    await page.getByLabel(/full name/i).fill(`E2E Patient ${stamp}`);
    await page.getByLabel(/^email$/i).fill(`e2e.patient.${stamp}@example.com`);
    await page.getByRole("checkbox").check();
    await page.screenshot({ path: testInfo.outputPath("visual-A5-lead-form.png"), fullPage: true });

    await page.getByRole("button", { name: /save my plan/i }).click();

    await expect(page.getByRole("heading", { name: /you're all set/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("link", { name: /schedule your consultation/i })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("visual-A6-confirmation.png"), fullPage: true });
  });

  test("B — Branded demo home (buyer) Launch → checkout (mocked)", async ({ page }, testInfo) => {
    await mockTenantIntakeConfig(page);
    await page.route("**/api/stripe/create-checkout-session", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "https://example.com/e2e-checkout-mock" }),
      });
    });

    await page.goto(`/?company=E2E%20Buyer%20Clinic&demo=1&logo=${LOGO}&brand=${BRAND}`, {
      waitUntil: "domcontentloaded",
    });

    await expect(page.getByText(/turn glp traffic into booked/i)).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/Demo for E2E Buyer Clinic/i).first()).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("visual-B1-buyer-hero.png"), fullPage: true });

    const launchBtn = page.locator('[data-cta-button]').first();
    await expect(launchBtn).toBeVisible({ timeout: 15000 });
    await expect(launchBtn).toBeEnabled({ timeout: 20000 });

    await Promise.all([
      page.waitForURL("**/example.com/e2e-checkout-mock**", { timeout: 15000 }),
      launchBtn.click(),
    ]);

    expect(page.url()).toContain("example.com");
    await page.screenshot({ path: testInfo.outputPath("visual-B2-checkout-redirect.png"), fullPage: true });

    // Same tab left the app — reset so serial test C starts on our origin (not example.com).
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("C — Paid patient intake (no demo) full funnel", async ({ page }, testInfo) => {
    await mockTenantIntakeConfig(page);
    await page.route("**/api/lead", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "ok (e2e mock)" }),
      });
    });

    const paidUrl =
      "/intake?handle=glpconvert&company=glpconvert&transition_ms=4500&booking=" +
      encodeURIComponent("https://example.com/schedule");
    await page.goto(paidUrl, { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/Secure intake/i)).toBeVisible({ timeout: 20000 });
    await expect(
      page.locator('[data-flow-step="1"]').getByRole("heading", { name: /your glp path/i }),
    ).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("visual-C1-paid-intake-input.png"), fullPage: true });

    await clickIntakeContinueUntilTransition(page);
    await expect(page.locator('[data-flow-step="3"]').getByRole("heading", { name: /your glp path/i })).toBeVisible({
      timeout: 25000,
    });
    await page.screenshot({ path: testInfo.outputPath("visual-C2-paid-results.png"), fullPage: true });
    await expect(page.getByText(/typical monthly range/i)).toBeVisible();
    await expect(page.locator("[data-owner-demo-panels]")).toHaveCount(0);

    await page.locator('[data-flow-step="3"]').getByRole("button", { name: /review my next step/i }).click();
    await expect(page.getByRole("heading", { name: "Consult readiness", exact: true })).toBeVisible();
    await page.locator('[data-flow-step="4"]').getByRole("button", { name: /yes, roughly/i }).click();
    await page.locator('[data-flow-step="4"]').getByRole("button", { name: /soon \(weeks\)/i }).click();
    await page.locator('[data-flow-step="4"]').getByRole("button", { name: /^yes$/i }).click();

    await page.locator('[data-flow-step="4"]').getByRole("button", { name: /continue to save/i }).click();
    const stamp = Date.now();
    await page.getByLabel(/full name/i).fill(`Paid Patient ${stamp}`);
    await page.getByLabel(/^email$/i).fill(`paid.patient.${stamp}@example.com`);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /save my plan/i }).click();

    await expect(page.getByRole("heading", { name: /you're all set/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("link", { name: /schedule your consultation/i })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("visual-C3-paid-confirmation.png"), fullPage: true });
  });
});
