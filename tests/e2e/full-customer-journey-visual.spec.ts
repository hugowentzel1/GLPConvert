/**
 * Full customer journey — broken into 5 steps so each can pass/fail independently.
 *
 * Part A: Demo landing → report → Launch (Stripe redirect).
 * Part B: Activation page.
 * Part C: Paid report → CTA → lead modal → submit (mocked estimate + lead API).
 * Part D: Status page.
 * Part E: Refund page.
 *
 * Run all (serial): npx playwright test tests/e2e/full-customer-journey-visual.spec.ts --workers=1
 * Run one step:     npx playwright test tests/e2e/full-customer-journey-visual.spec.ts -g "Part C" --workers=1
 * Headed:           npx playwright test tests/e2e/full-customer-journey-visual.spec.ts --headed --workers=1
 */

import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

function mockEstimatePayload(address: string, lat: number, lng: number) {
  return {
    estimate: {
      id: `mock-${Date.now()}`,
      address,
      coordinates: { lat, lng },
      date: new Date().toISOString(),
      systemSizeKW: 7.2,
      tilt: 22,
      azimuth: 180,
      losses: 14,
      annualProductionKWh: { estimate: 11105, low: 9995, high: 12216 },
      monthlyProduction: Array(12).fill(1000),
      solarIrradiance: 4.5,
      grossCost: 25800,
      netCostAfterITC: 18060,
      year1Savings: { estimate: 2254, low: 2029, high: 2480 },
      paybackYear: 8,
      npv25Year: 73000,
      co2OffsetPerYear: 10200,
      utilityRate: 0.14,
      utilityRateSource: "E2E",
      tariff: "E2E",
      dataSource: "E2E",
      shadingAnalysis: { method: "remote", accuracy: "high", shadingFactor: 0.9, annualShadingLoss: 10, confidence: 0.92 },
      assumptions: { itcPercentage: 0.3, costPerWatt: 3, degradationRate: 0.005, oandmPerKWYear: 22, electricityRateIncrease: 0.025, discountRate: 0.07 },
      cashflowProjection: Array.from({ length: 25 }, (_, i) => ({
        year: i + 1,
        production: Math.round(12000 * Math.pow(0.995, i)),
        savings: Math.round(12000 * Math.pow(0.995, i) * 0.14),
        cumulativeSavings: Math.round(12000 * 0.14 * (i + 1)),
        netCashflow: Math.round(12000 * 0.14 * (i + 1) - 18060),
      })),
    },
  };
}

test.describe.serial("Full customer journey (visual)", () => {
  test("Part A: Demo landing and report", async ({ page }) => {
    test.setTimeout(30000);
    await page.route("**/api/estimate*", async (route) => {
      const u = new URL(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockEstimatePayload(u.searchParams.get("address") || "1600 Amphitheatre Parkway", Number(u.searchParams.get("lat")) || 37.422, Number(u.searchParams.get("lng")) || -122.084)),
      });
    });

    await page.goto(`${BASE}/?company=TestCo&demo=1`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: /Launch Your Branded Version|Activate on Your Domain/i }).first()).toBeVisible({ timeout: 10000 });

    await page.goto(`${BASE}/report?company=TestCo&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toContainText(/NREL|savings|Production|System Size|Launch/i, { timeout: 15000 });
  });

  test("Part B: Activation page", async ({ page }) => {
    test.setTimeout(15000);
    await page.goto(`${BASE}/c/TestCo?session_id=test_visual&demo=1`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toContainText(/Instant URL|dashboard|Connect your CRM|you're live|embed|API key/i, { timeout: 10000 });
  });

  test("Part C: Paid report and lead modal", async ({ page }) => {
    test.setTimeout(35000);
    await page.route("**/api/estimate*", async (route) => {
      const u = new URL(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockEstimatePayload(u.searchParams.get("address") || "1600 Amphitheatre Parkway", Number(u.searchParams.get("lat")) || 37.422, Number(u.searchParams.get("lng")) || -122.084)),
      });
    });
    await page.route("**/api/lead*", (route) => {
      if (route.request().method() === "POST") route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
      else route.continue();
    });

    await page.goto(`${BASE}/report?company=TestCo&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('[data-testid="report-cta-footer"]', { timeout: 12000 });
    const consultBtn = page.getByRole("button", { name: /Request a free consult|Book a Consultation/i }).first();
    await expect(consultBtn).toBeVisible({ timeout: 5000 });
    await consultBtn.click();

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.locator("#report-lead-name")).toBeVisible();
    await modal.locator("#report-lead-name").fill("E2E Test");
    await modal.locator("#report-lead-email").fill(`e2e-${Date.now()}@test.example`);
    await modal.locator("#report-lead-phone").fill("+15551234567");
    await modal.locator("#report-lead-consent").check();
    await modal.locator('button[type="submit"]').click();

    await expect(modal.getByRole("heading", { name: /all set/i })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /No thanks/i }).first().click().catch(() => null);
  });

  test("Part D: Status page", async ({ page }) => {
    test.setTimeout(25000);
    await page.goto(`${BASE}/status`, { waitUntil: "load" });
    await expect(page.locator("body")).toContainText(/support@getsunspire\.com|Status check failed/i, { timeout: 15000 });
    const body = await page.locator("body").innerText();
    if (!/Status check failed/i.test(body)) {
      await expect(page.getByRole("button", { name: /Refresh now|Refreshing/i })).toBeVisible({ timeout: 5000 });
      await expect(page.locator("body")).toContainText(/api\/health|System Status|Operational/i);
    }
  });

  test("Part E: Refund page", async ({ page }) => {
    test.setTimeout(15000);
    await page.goto(`${BASE}/legal/refund`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toContainText(/Refund Policy|support@getsunspire|Sunspire Software LLC|1700 Northside/i, { timeout: 10000 });
    await expect(page.locator('a[href*="support@getsunspire"]').first()).toBeVisible({ timeout: 5000 });
  });
});
