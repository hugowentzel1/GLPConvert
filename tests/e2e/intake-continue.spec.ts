import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("cookie-consent", "accepted");
    } catch {
      /* ignore */
    }
  });
});

test("intake Continue shows preparing overlay then advances to step 2", async ({ page }) => {
  // `load` (not `domcontentloaded`) so React has hydrated; otherwise the visible SSR button
  // can be clicked before `onClick` is attached and the building overlay never appears.
  await page.goto(
    "/intake?demo=1&handle=glpconvert&company=Test%20Clinic&brand=059669&demo_traffic=400&transition_ms=600",
    { waitUntil: "load" },
  );

  const continueBtn = page.locator("[data-intake-continue]");
  await expect(continueBtn).toBeVisible({ timeout: 30000 });
  await continueBtn.click();
  await expect(page.locator("[data-building-overlay]")).toBeVisible({ timeout: 10000 });

  await expect(page.locator('[data-flow-step="2"]')).toBeVisible({ timeout: 20000 });
  await expect(page.getByText(/Step 2 of 5/i).first()).toBeVisible();
  await expect(
    page.locator('[data-flow-step="2"]').getByRole("heading", { name: /your path preview/i }),
  ).toBeVisible();
});

test("partners (branded demo) shows exclusive strip in header (no private-demo line on static subpages)", async ({
  page,
}) => {
  await page.goto(
    "/partners?demo=1&company=Sunspire%20Weight%20Clinic&brand=059669&handle=glpconvert",
    { waitUntil: "domcontentloaded" },
  );
  await expect(page.locator("[data-intake-demo-banner-strip]")).toBeVisible({ timeout: 25000 });
  await expect(page.getByText(/Exclusive preview for/i).first()).toBeVisible();
  await expect(page.locator("[data-intake-private-demo-disclaimer]")).toHaveCount(0);
});
