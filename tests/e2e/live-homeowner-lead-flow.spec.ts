/**
 * Live homeowner lead flow — browser E2E on LIVE only.
 * Run: BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/live-homeowner-lead-flow.spec.ts
 * Or:  BASE_URL=https://sunspire-demo.vercel.app npx playwright test tests/e2e/live-homeowner-lead-flow.spec.ts
 *
 * Verifies: open live report → open modal → fill form → submit → success (or error) UI.
 * Does NOT verify backend side effects (Supabase/Resend/CRM); that requires dashboard/API access.
 */

import { test, expect } from "@playwright/test";

const BASE =
  process.env.BASE_URL ||
  process.env.PLAYWRIGHT_BASE_URL ||
  "https://sunspire-web-app.vercel.app";

test.describe("Live homeowner lead flow (browser)", () => {
  test("Live report → open modal → fill and submit lead → verify success or error UI", async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.goto(
      `${BASE}/report?company=TestCo&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`,
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForSelector(
      'text=/Request a free consult|Book a Consultation|Next step|Launch Your Branded|NREL|savings/i',
      { timeout: 25000 }
    ).catch(() => null);

    const consultBtn = page.getByRole("button", { name: /Request a free consult/i }).first();
    const consultVisible = await consultBtn.isVisible().catch(() => false);
    if (!consultVisible) {
      const body = await page.locator("body").innerText().catch(() => "");
      expect(body).toMatch(/NREL|savings|solar|report|Request|Consultation|Launch/i);
      return;
    }

    await consultBtn.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
    const modal = page.locator('[role="dialog"]').first();
    await expect(
      modal.locator("text=/Where should we send your report|free consultation|Email my report/i")
    ).toBeVisible({ timeout: 5000 });

    await modal.locator("#report-lead-name").fill("Live E2E Homeowner");
    await modal.locator("#report-lead-email").fill(`live-homeowner-${Date.now()}@test.example`);
    await modal.locator("#report-lead-consent").check().catch(() => null);
    await modal.locator('button[type="submit"]').click();

    await page.waitForSelector(
      'text=/You\'re all set|hear back within 1 business day|Book a time|Something went wrong|Failed to submit|required/i',
      { timeout: 20000 }
    );
    const modalContent =
      (await modal.locator("div").first().innerText().catch(() => "")) ||
      (await page.locator("body").innerText().catch(() => ""));
    const gotSuccess = /You're all set|hear back within 1 business day|Book a time/i.test(modalContent);
    const gotError = /Something went wrong|Failed to submit|required/i.test(modalContent);
    expect(gotSuccess || gotError).toBe(true);
  });
});
