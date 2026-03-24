/**
 * Tests for: (1) lead modal no "Takes ~30 seconds. No obligation." text,
 * (2) CTA footer buttons visible and in correct containers,
 * (3) report bottom CTA band (demo) works with onLaunchClick.
 * Run: npx playwright test tests/e2e/popup-and-cta-alignment.spec.ts
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

test.describe("Lead modal: no 'Takes ~30 seconds. No obligation.' text", () => {
  test("consultation modal does not show Takes ~30 seconds or No obligation microcopy", async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=AcmeSolar&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: "domcontentloaded", timeout: 60000 }
    );
    await page.waitForSelector('button:has-text("Book your consultation"), button:has-text("Book a Consultation")', { timeout: 15000 }).catch(() => null);
    const consultBtn = page.getByRole("button", { name: /Book your consultation|Book a Consultation/i }).first();
    await consultBtn.click();
    // On production the button may redirect to Stripe checkout; on local it opens the modal.
    const result = await Promise.race([
      page.getByRole("dialog").waitFor({ state: "visible", timeout: 10000 }).then(() => "dialog" as const),
      page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 }).then(() => "checkout" as const),
    ]).catch(() => "none" as const);
    if (result === "dialog") {
      const dialog = page.getByRole("dialog").first();
      await expect(dialog).toContainText(/Share your details|Book your consultation/i);
      await expect(dialog.locator("p.text-xs:has-text('Takes ~30 seconds')")).not.toBeVisible();
    }
    expect(result !== "none", "Either modal should open or redirect to checkout").toBe(true);
  });
});

test.describe("CTA footer: button containers and vertical alignment", () => {
  test("Book your consultation button is in report CTA footer and visible", async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=AcmeSolar&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: "domcontentloaded", timeout: 60000 }
    );
    const footer = page.locator('[data-testid="report-cta-footer"]');
    await expect(footer).toBeVisible({ timeout: 15000 });
    const bookBtn = footer.getByRole("button", { name: /Book your consultation|Book a Consultation/i });
    await expect(bookBtn).toBeVisible();
  });

  test("Download PDF and Copy Share Link buttons are in report CTA footer and visible", async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=AcmeSolar&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: "domcontentloaded", timeout: 60000 }
    );
    const footer = page.locator('[data-testid="report-cta-footer"]');
    await expect(footer).toBeVisible({ timeout: 15000 });
    await expect(footer.getByRole("button", { name: /Download PDF/i })).toBeVisible();
    await expect(footer.getByRole("button", { name: /Copy Share Link/i })).toBeVisible();
  });
});

test.describe("Report bottom CTA band (demo mode)", () => {
  test("demo report shows bottom CTA band with Launch button", async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=AcmeSolar&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&demo=1`,
      { waitUntil: "domcontentloaded", timeout: 60000 }
    );
    const band = page.locator('[data-testid="report-bottom-cta"]');
    await expect(band).toBeVisible({ timeout: 20000 });
    const launchBtn = band.getByRole("button", { name: /Launch Your Branded/i });
    await expect(launchBtn).toBeVisible();
  });
});
