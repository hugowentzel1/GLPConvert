import { test, expect } from "@playwright/test";

/**
 * Captures the chart's "load in" sequence by stepping through the funnel and
 * screenshotting frame-by-frame. Used to actually SEE which elements vanish
 * during the L→R reveal so we can diagnose root cause vs guess.
 */
test.use({ video: "on" });
test("chart flicker diagnostic", async ({ page }, testInfo) => {
  testInfo.setTimeout(60000);
  // Cold-email demo URL with brand color, mirrors live LinkedIn / email links
  // Use the user's standard cold-email demo URL pattern
  await page.goto(
    "http://localhost:3000/intake?demo=1&handle=glpconvert&company=Sunspire+Weight+Clinic&brand=059669&brand2=064e3b",
    { waitUntil: "domcontentloaded" },
  );

  // Step 1: fill in basics → click Continue
  await page
    .locator("input[type='number'][placeholder='220']")
    .fill("220")
    .catch(() => {});
  await page.locator("input[type='number']").first().fill("220").catch(() => {});

  // Look for any continue button and click
  const continueBtn = page.locator("[data-intake-continue]").first();
  if (await continueBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await continueBtn.click();
  } else {
    console.log("continue button not visible - looking for first numeric input fill");
    // Sometimes step 1 needs more fields filled
    const inputs = page.locator("input[type='number']");
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      await inputs.nth(i).fill("180");
    }
    await page.locator("[data-intake-continue]").first().click();
  }

  // Wait for step 2 chart to start mounting
  await page.locator("[data-results-chart]").waitFor({ timeout: 10000 });

  // Capture screenshots every 100ms for 4 seconds, focused on chart
  const chart = page.locator("[data-results-chart]");
  const start = Date.now();
  const frames: { t: number; path: string }[] = [];
  while (Date.now() - start < 4000) {
    const t = Date.now() - start;
    const file = `/tmp/chart-flicker-debug/frame-${String(t).padStart(4, "0")}.png`;
    await chart.screenshot({ path: file }).catch(() => {});
    frames.push({ t, path: file });
    await page.waitForTimeout(80);
  }

  console.log(`captured ${frames.length} frames`);
  expect(frames.length).toBeGreaterThan(20);
});
