/**
 * Visual check: paid report page + consultation modal.
 * Run with: npx playwright test tests/e2e/visual-report-and-modal.spec.ts --headed --workers=1
 * Optional: BASE_URL=http://localhost:3000 (or 3004 if dev is there)
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

test("Report page loads and modal opens (visual)", async ({ page }) => {
  const reportUrl = `${BASE}/report?company=AcmeSolar&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`;
  await page.goto(reportUrl, { waitUntil: "networkidle", timeout: 60000 });
  await expect(page.locator('body')).toContainText(/Next step|Book your consultation|solar|estimate/i, { timeout: 15000 });
  await expect(page.locator('[data-testid="report-cta-footer"]')).toBeVisible({ timeout: 10000 });
  const btn = page.getByRole("button", { name: /Book your consultation/i }).first();
  await expect(btn).toBeVisible({ timeout: 5000 });
  await btn.click();
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("dialog")).toContainText(/Book your free consultation|Share your details below|call or email/i);
  await page.screenshot({ path: "test-results/visual-report-modal.png", fullPage: false });
});
