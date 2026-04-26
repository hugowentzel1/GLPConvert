import { test, expect } from "@playwright/test";

const LIVE = "https://glp-convert.vercel.app";

test.describe("live deploy smoke", () => {
  test.use({ baseURL: LIVE });

  test("/pricing renders brand-color Start setup CTA with price", async ({ page }) => {
    await page.goto(`${LIVE}/pricing?company=Sunspire+Weight+Clinic&primary=%23146EF5&_v=${Date.now()}`, { waitUntil: "networkidle" });
    const cta = page.getByRole("button", { name: /Start setup/i }).first();
    await expect(cta).toBeVisible({ timeout: 15_000 });
    await expect(cta).toContainText(/\$399/);
    await expect(cta).toContainText(/\$99\/mo/);
    const bg = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
    console.log("Start setup bg:", bg);
    expect(bg.toLowerCase()).not.toContain("rgb(15, 23, 42)");
  });

  test("/intake step 2 renders chart, owner CTAs, no always-on checkpoint chip", async ({ page }) => {
    await page.goto(`${LIVE}/intake?company=Sunspire+Weight+Clinic&primary=%23146EF5&demo=1&_v=${Date.now()}`, { waitUntil: "networkidle" });
    await page.getByLabel(/Current weight/i).first().fill("220");
    await page.getByLabel(/Goal weight/i).first().fill("180");
    await page.getByLabel(/Height/i).first().fill("66");
    const next = page.getByRole("button", { name: /continue/i }).first();
    await next.click();
    await page.waitForTimeout(3500);
    /** Chart still renders (sanity). */
    await expect(page.locator("[data-results-chart]").first()).toBeVisible({ timeout: 15_000 });
    /** Always-on "Modeled checkpoint X%" chip must be gone (now lives only in tooltip / summary tile). */
    await expect(page.locator("[data-results-chart-final-chip]")).toHaveCount(0);
    /** New owner-block primary + secondary CTAs both present. */
    await expect(page.locator("[data-demo-owner-cta]").first()).toBeVisible();
    await expect(page.locator("[data-demo-owner-cta]").first()).toContainText(/Activate for Sunspire Weight Clinic/);
    await expect(page.locator("[data-demo-owner-support]").first()).toBeVisible();
    await expect(page.locator("[data-demo-owner-support]").first()).toContainText(/Contact support/i);
  });

  test("/support has Send Message mailto + brand-styled disclaimer at bottom", async ({ page }) => {
    await page.goto(`${LIVE}/support?company=Sunspire+Weight+Clinic&primary=%23146EF5&_v=${Date.now()}`, { waitUntil: "networkidle" });
    const sendMessage = page.getByRole("link", { name: /send message/i }).first();
    await expect(sendMessage).toBeVisible({ timeout: 15_000 });
    await expect(sendMessage).toHaveAttribute("href", /mailto:support@glpconvert\.com/);
    const compliance = page.getByText(/HIPAA hub/i).first();
    await expect(compliance).toBeVisible();
    const box = await compliance.boundingBox();
    console.log("Compliance Y:", box?.y);
    const vh = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log("Page scrollHeight:", vh);
    expect((box?.y ?? 0) > vh / 2).toBe(true);
  });

  test("/partners disclaimer is at bottom not top", async ({ page }) => {
    await page.goto(`${LIVE}/partners?company=Sunspire+Weight+Clinic&primary=%23146EF5&_v=${Date.now()}`, { waitUntil: "networkidle" });
    const disclaimer = page.getByText(/Partner terms are governed by/i).first();
    await expect(disclaimer).toBeVisible({ timeout: 15_000 });
    const box = await disclaimer.boundingBox();
    const vh = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log("Partners disclaimer Y:", box?.y, "/ scrollHeight:", vh);
    expect((box?.y ?? 0) > vh / 2).toBe(true);
  });

  test("/docs/embed surfaces branded subdomain as recommended", async ({ page }) => {
    await page.goto(`${LIVE}/docs/embed?_v=${Date.now()}`, { waitUntil: "networkidle" });
    await expect(page.getByText(/Branded subdomain/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Recommended/i).first()).toBeVisible();
  });
});
