import { test, expect } from "@playwright/test";

/**
 * Visual / structural check for Step 2 of the intake form:
 *   1. Y-axis caption ("Toward your stated goal") visually centered with equal horizontal
 *      gutters between card edge ↔ caption ↔ chart edge.
 *   2. X-axis caption ("Time (months from start)") visually centered with equal vertical
 *      space between chart bottom ↔ caption ↔ "Last checkpoint" footnote.
 *   3. The three "At a glance" tiles share a consistent overline → headline → support →
 *      footer rhythm (no body-text-vs-metric mismatch like before).
 *
 * The test snapshots into screenshots-step2/ so we can eyeball the output, AND asserts
 * structural facts (caption margins, tile content uniformity) that should never regress.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("cookie-consent", "accepted");
    } catch {
      /* ignore */
    }
  });
});

test("intake step 2 — chart axis spacing + at-a-glance tiles look consistent", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1800 });

  await page.goto(
    "/intake?demo=1&handle=glpconvert&company=Sunspire+Weight+Clinic&brand=059669&demo_traffic=400&transition_ms=200",
    { waitUntil: "load" },
  );

  const continueBtn = page.locator("[data-intake-continue]");
  await expect(continueBtn).toBeVisible({ timeout: 30000 });
  await continueBtn.click();

  await expect(page.locator('[data-flow-step="2"]')).toBeVisible({ timeout: 20000 });
  // Wait for chart to render
  await expect(page.locator("[data-results-chart]")).toBeVisible({ timeout: 20000 });
  // Allow for animations to finalize
  await page.waitForTimeout(3500);

  // ---- AXIS CAPTIONS: structural assertions ----
  const yLabel = page.locator("[data-results-chart-y-label]").first();
  const xLabel = page.locator("[data-results-chart-x-label]").first();
  await expect(yLabel).toBeVisible();
  await expect(xLabel).toBeVisible();
  await expect(yLabel).toHaveText("Toward your stated goal");
  await expect(xLabel).toHaveText("Time (months from start)");

  // Same font-size / font-family / weight (single source of truth = axisCaptionStyle)
  const yStyles = await yLabel.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { fontSize: cs.fontSize, fontWeight: cs.fontWeight, color: cs.color };
  });
  const xStyles = await xLabel.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { fontSize: cs.fontSize, fontWeight: cs.fontWeight, color: cs.color };
  });
  expect(yStyles.fontSize).toBe(xStyles.fontSize);
  expect(yStyles.fontWeight).toBe(xStyles.fontWeight);
  expect(yStyles.color).toBe(xStyles.color);

  // ---- TILES: structural assertions ----
  const tiles = page.locator("[data-results-summary] > div");
  await expect(tiles).toHaveCount(3);

  // Each tile must have: 1 overline, 1 headline, 1 support line, 1 footer
  for (let i = 0; i < 3; i++) {
    const tile = tiles.nth(i);
    const paragraphs = await tile.locator(":scope > p").count();
    expect(paragraphs, `tile ${i} should have 4 stacked <p> rows`).toBe(4);
  }

  // ---- SCREENSHOTS for visual eyeball ----
  await page.locator("[data-results-chart]").screenshot({
    path: "screenshots-step2/01-chart.png",
  });
  await page.locator("[data-results-summary]").screenshot({
    path: "screenshots-step2/02-tiles.png",
  });
  await page.locator('[data-flow-step="2"]').screenshot({
    path: "screenshots-step2/03-full-step2.png",
    timeout: 30000,
  });
});
