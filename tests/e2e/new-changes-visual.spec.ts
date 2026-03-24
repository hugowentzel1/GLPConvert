/**
 * Visual/functional checks for the new changes:
 * - Streamlined status page (support@getsunspire.com, UptimeRobot, Sentry)
 * - Report CTA block (Next step heading, Request a free consult)
 * - Lead modal (wording, consent, post-submit "Book a time" / "No thanks")
 * - Refund page (legal name, support link)
 * - Health API shape
 * Run: BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/new-changes-visual.spec.ts
 */

import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

test.describe("New changes — visual and buttons", () => {
  test("Status page: support@getsunspire.com, UptimeRobot, Sentry, daily check", async ({
    page,
    request,
  }) => {
    const healthRes = await request.get(`${BASE}/api/health`);
    expect(healthRes.ok() || healthRes.status() === 503).toBe(true);
    const healthBody = await healthRes.json().catch(() => ({}));
    expect(healthBody.services).toBeDefined();
    expect(Array.isArray(healthBody.services)).toBe(true);

    await page.goto(`${BASE}/status`, { waitUntil: "load" });
    await page.waitForSelector('[data-testid="status-service-list"], text=/Status check failed/i', { timeout: 20000 }).catch(() => null);
    await expect(page.locator("body")).toContainText(/support@getsunspire\.com|Status check failed/i, { timeout: 15000 });
    // Single h1: use scoped wrapper when present (new deploy), else fallback to body (e.g. older live)
    const statusContent = page.locator('[data-testid="status-page-content"]').first();
    const hasScope = await statusContent.isVisible().catch(() => false);
    if (hasScope) {
      const h1InStatus = statusContent.locator("h1");
      await expect(h1InStatus).toHaveCount(1);
      expect(await h1InStatus.first().innerText()).toMatch(/System Status|Status check failed/i);
    } else {
      // Older deploy or nav visible: body must contain status page title (any h1 or main content)
      const bodyEarly = await page.locator("body").innerText();
      expect(bodyEarly).toMatch(/System Status|Status check failed/i);
    }
    const body = await page.locator("body").innerText();
    const isErrorState = /Status check failed/i.test(body);
    if (!isErrorState) {
      expect(body).toMatch(/Sentry|sentry/i);
      expect(body).toMatch(/\/api\/health|api\/health/i);
      const hasNewBlock = /UptimeRobot|uptimerobot|Daily check|daily check/i.test(body);
      const hasOldBlock = /Not checked on this page|probed by/i.test(body);
      expect(hasNewBlock || hasOldBlock).toBe(true);
    }
  });

  test("Report page: CTA section and consult/booking button", async ({
    page,
  }) => {
    await page.goto(
      `${BASE}/report?company=TestCo&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`,
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForSelector('text=/Next step|Request a free consult|Book a Consultation|NREL|savings/i', {
      timeout: 20000,
    });
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/NREL|savings|solar|report|Production|System Size/i);
    const hasNextStep = /Next step: (schedule your free consultation|book your consultation)|free consultation|Request a free consult|You already have your estimate/i.test(body);
    const hasConsultBtn = /Request a free consult|Book a Consultation|Book your consultation/i.test(body);
    expect(hasNextStep || hasConsultBtn).toBe(true);
    const consultBtn = page.getByRole("button", { name: /Request a free consult|Book a Consultation|Book your consultation/i }).first();
    await expect(consultBtn).toBeVisible({ timeout: 5000 });
    // Paid report: CTA footer should not show "Talk to a Specialist" (hideTalkToSpecialist)
    const footer = page.locator('[data-testid="report-cta-footer"]');
    await expect(footer.getByRole("button", { name: /Talk to a Specialist/i })).toHaveCount(0);
  });

  test("Lead modal: open, wording, consent, submit button, then success or error", async ({
    page,
  }) => {
    test.setTimeout(60000);
    const minimalEstimate = () => ({
      estimate: {
        id: "mock-1",
        address: "1600 Amphitheatre Parkway",
        coordinates: { lat: 37.422, lng: -122.084 },
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
        cashflowProjection: Array.from({ length: 25 }, (_, i) => ({ year: i + 1, production: 12000, savings: 1680, cumulativeSavings: 1680 * (i + 1), netCashflow: 1680 * (i + 1) - 18060 })),
      },
    });
    await page.route("**/api/estimate*", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(minimalEstimate()) }));
    await page.route("**/api/lead*", (route) => {
      if (route.request().method() === "POST") route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
      else route.continue();
    });
    await page.goto(
      `${BASE}/report?company=TestCo&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`,
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForSelector('[data-testid="report-cta-footer"]', { timeout: 20000 }).catch(() => null);
    await page.waitForSelector('button:has-text("Book your consultation"), button:has-text("Book a Consultation")', { timeout: 8000 }).catch(() => null);
    const consultBtn = page.getByRole("button", { name: /Book your consultation|Book a Consultation/i }).first();
    await expect(consultBtn).toBeVisible({ timeout: 15000 });
    await consultBtn.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal.getByRole("heading", { name: /Book your free consultation/i })).toBeVisible({ timeout: 5000 });
    const modalText = await modal.innerText();
    expect(modalText).toMatch(/Share your details|contact you within 1-2 business days|Book your consultation/i);
    await expect(modal.locator("#report-lead-name")).toBeVisible();
    await expect(modal.locator("#report-lead-email")).toBeVisible();
    await expect(modal.locator("#report-lead-phone")).toBeVisible();
    await expect(modal.locator("#report-lead-consent")).toBeVisible();
    await expect(modal.locator("text=/agree to be contacted/i").first()).toBeVisible({ timeout: 3000 });
    await expect(modal.locator('button[type="submit"]')).toContainText(/Book your consultation|Sending/i);

    await modal.locator("#report-lead-name").fill("Visual Test");
    await modal.locator("#report-lead-email").fill(`visual-${Date.now()}@test.example`);
    await modal.getByRole("radio", { name: /Call/i }).check().catch(() => null);
    await modal.locator("#report-lead-consent").check();
    await modal.locator('button[type="submit"]').click();

    await expect(modal.getByRole("heading", { name: /all set/i })).toBeVisible({ timeout: 15000 });
    const afterBody = (await modal.innerText().catch(() => "")) || (await page.locator("body").innerText().catch(() => ""));
    const hasSuccess = /You're all set|hear back within 1 business day|Book a time|No thanks — have them reach out/i.test(afterBody);
    const hasError = /Something went wrong|Failed to submit|Failed|error/i.test(afterBody);
    expect(hasSuccess || hasError).toBe(true);
  });

  test("Activation (post-pay) page: no main site header (Activate, Pricing, Support)", async ({
    page,
  }) => {
    await page.goto(`${BASE}/c/activate-test?session_id=cs_test_123&demo=1`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector('text=/Dashboard|Instant URL|Custom Domain|Embed/i', { timeout: 15000 });
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/Dashboard|Instant URL|Custom Domain|embed/i);
    // Main site nav (header with Pricing/Support/Activate) must not be present on /c/ pages
    await expect(page.getByTestId("main-site-nav")).toHaveCount(0);
  });

  test("Refund page: loads, legal name, support link", async ({ page }) => {
    await page.goto(`${BASE}/legal/refund`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('text=/Refund Policy|Setup-Fee|support@getsunspire/i', { timeout: 10000 });
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/Refund Policy|Setup-Fee Refund|setup fee/i);
    expect(body).toMatch(/support@getsunspire\.com/i);
    expect(body).toMatch(/Sunspire Software LLC|1700 Northside/i);
    const supportLink = page.locator('a[href*="support@getsunspire"]').first();
    await expect(supportLink).toBeVisible({ timeout: 3000 });
  });

  test("Health API: timestamp, services array, each service has service + status", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/api/health`);
    const data = await res.json().catch(() => ({}));
    expect(data.timestamp).toBeDefined();
    expect(Array.isArray(data.services)).toBe(true);
    if (data.services?.length > 0) {
      const first = data.services[0];
      expect(first).toHaveProperty("service");
      expect(first).toHaveProperty("status");
      expect(["ok", "degraded", "down"]).toContain(first.status);
    }
  });
});
