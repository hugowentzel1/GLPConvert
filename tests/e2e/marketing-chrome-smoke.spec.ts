import { test, expect } from "@playwright/test";

/** Branded demo query so `IntakeDemoSiteHeader` + marketing pages get full chrome. */
const DEMO =
  "demo=1&handle=glpconvert&company=Sunspire%20Weight%20Clinic&brand=059669&demo_traffic=400";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("cookie-consent", "accepted");
      sessionStorage.removeItem("intake-demo-banner-dismissed-v3");
    } catch {
      /* ignore */
    }
  });
});

test.describe("Marketing chrome (Chromium)", () => {
  test("header nav links are spaced (not concatenated)", async ({ page }) => {
    await page.goto(`/pricing?${DEMO}`, { waitUntil: "load" });
    await expect(page.locator("[data-intake-site-header]")).toBeVisible({ timeout: 30000 });
    const nav = page.getByRole("navigation", { name: "Product links" });
    await expect(nav.getByRole("link", { name: "Pricing" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Partners" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Support" })).toBeVisible();
    const t = await nav.textContent();
    expect(t).not.toMatch(/PricingPartners/i);
    expect(t).toMatch(/Pricing/);
    expect(t).toMatch(/Partners/);
  });

  for (const { path, must } of [
    { path: "/pricing", must: /\$99|setup|Launch GLPConvert/i },
    { path: "/partners", must: /Partner Program|Earn recurring/i },
    { path: "/support", must: /Support Center|Get help/i },
    { path: "/privacy", must: /Privacy|personal information|data/i },
    { path: "/contact", must: /Contact|GLPConvert|message/i },
    { path: "/legal/terms", must: /Terms|Agreement|GLPConvert/i },
    { path: "/terms", must: /Terms of Service|Acceptance of Terms|GLPConvert/i },
  ] as const) {
    test(`loads ${path} (not 404) with expected content`, async ({ page }) => {
      await page.goto(`${path}?${DEMO}`, { waitUntil: "load" });
      await expect(page.getByRole("heading", { name: "Page Not Found" })).toHaveCount(0);
      await expect(page.locator("main, [role='main'], article").first()).toBeVisible({
        timeout: 25000,
      });
      expect(page.url()).toMatch(
        new RegExp(`${path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\?|$)`),
      );
      await expect(page.locator("body")).toContainText(must, { timeout: 15000 });
    });
  }

  test("home shows pilot social proof cards with full names (verbatim hero quotes)", async ({ page }) => {
    await page.goto(`/?${DEMO}`, { waitUntil: "load" });
    const section = page.locator('[data-testid="demo-testimonials"]');
    await expect(section).toBeVisible({ timeout: 25000 });
    await expect(section.getByText("Jordan Mercer", { exact: true })).toBeVisible();
    await expect(section.getByText("Priya Krishnan", { exact: true })).toBeVisible();
    await expect(section.getByText("Marcus Ellison", { exact: true })).toBeVisible();
    await expect(section.getByText(/Same ad spend, noticeably more booked consults/i)).toBeVisible();
    await expect(section.getByText(/Less leakage from paid clicks/i)).toBeVisible();
    await expect(section.getByRole("heading", { name: /What early clinics report in pilot/i })).toBeVisible();
  });

  test("branded marketing pages show full Intake demo header (strip + private disclaimer)", async ({ page }) => {
    await page.goto(`/partners?${DEMO}`, { waitUntil: "load" });
    await expect(page.locator("[data-intake-site-header]")).toBeVisible({ timeout: 30000 });
    await expect(page.locator("[data-intake-demo-banner-strip]")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Sunspire Weight Clinic/i).first()).toBeVisible();
    await expect(page.getByText(/Branded intake/i).first()).toBeVisible();
    await expect(page.locator("[data-intake-private-demo-disclaimer]")).toBeVisible();
    await expect(page.getByText(/Private demo for/i).first()).toBeVisible();
  });

  test("intake step 2 shows toward-your-goal label beside chart", async ({ page }) => {
    await page.goto(
      `/intake?${DEMO}&transition_ms=400`,
      { waitUntil: "load" },
    );
    await page.locator("[data-intake-continue]").click();
    await expect(page.locator('[data-flow-step="2"]')).toBeVisible({ timeout: 25000 });
    await expect(page.locator("[data-results-chart-y-label]")).toHaveCount(2);
    await expect(
      page.locator("[data-results-chart-y-label]").getByText(/Toward your stated goal/i).first(),
    ).toBeVisible();
    await expect(page.getByText(/How progress toward your stated goal can build/i).first()).toBeVisible();
  });
});
