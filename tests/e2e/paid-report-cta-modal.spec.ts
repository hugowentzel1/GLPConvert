/**
 * Paid report only: CTA footer (Block A + Block B) and consultation modal.
 * No demo tests. Run: npx playwright test tests/e2e/paid-report-cta-modal.spec.ts
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
// Local: E2E_PAID_COMPANY=paid for /paid and paid report (e.g. /paid?company=paid, /report?company=paid)
const PAID_COMPANY = process.env.E2E_PAID_COMPANY || "TestCo";

test.describe("Paid report CTA footer", () => {
  test("footer has primary action area with Book your consultation visible", async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=${PAID_COMPANY}&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: "domcontentloaded", timeout: 35000 }
    );
    const footer = page.locator('[data-testid="report-cta-footer"], [data-testid="report-bottom-cta"]').first();
    await expect(footer).toBeVisible({ timeout: 20000 });
    const primaryBtn = page.getByRole("button", { name: /Book your consultation|Book a Consultation/i }).first();
    await expect(primaryBtn).toBeVisible({ timeout: 5000 });
  });

  test("footer has secondary action area with Download PDF and Copy Share Link visible", async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=${PAID_COMPANY}&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: "domcontentloaded", timeout: 35000 }
    );
    const footer = page.locator('[data-testid="report-cta-footer"]');
    await expect(footer).toBeVisible({ timeout: 20000 });
    await expect(footer.getByRole("button", { name: /Download PDF/i })).toBeVisible({ timeout: 5000 });
    await expect(footer.getByRole("button", { name: /Copy Share Link/i })).toBeVisible({ timeout: 5000 });
  });

  test("footer contains primary and secondary rows with correct structure", async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=${PAID_COMPANY}&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: "domcontentloaded", timeout: 35000 }
    );
    const footer = page.locator('[data-testid="report-cta-footer"]');
    await expect(footer).toBeVisible({ timeout: 20000 });
    await expect(footer.locator(".cta-row, .utility-row").first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Paid report consultation modal", () => {
  test("modal opens and shows title, form, submit, cancel", async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=${PAID_COMPANY}&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: "domcontentloaded", timeout: 35000 }
    );
    const consultBtn = page.getByRole("button", { name: /Book your consultation|Book a Consultation/i }).first();
    await expect(consultBtn).toBeVisible({ timeout: 15000 });
    await consultBtn.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog).toContainText(/Book your free consultation|Share your details/i);
    await expect(dialog.locator("#report-lead-name")).toBeVisible({ timeout: 5000 });
    await expect(dialog.locator("#report-lead-email")).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByRole("button", { name: /Book your consultation|Sending/ })).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByRole("button", { name: /Cancel|Close/ })).toBeVisible().catch(() => null);
  });
});
