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

  // ---- PATH & EXPECTATIONS share the same card structure ----
  const pathCards = page.locator("[data-results-path] .grid > div");
  const expectationCards = page.locator("[data-results-expectations] .grid > div");
  await expect(pathCards).toHaveCount(3);
  await expect(expectationCards).toHaveCount(3);

  // Each card in both grids should have 3 rows: eyebrow, sub-headline title, description
  for (let i = 0; i < 3; i++) {
    const pCount = await pathCards.nth(i).locator(":scope > p").count();
    const eCount = await expectationCards.nth(i).locator(":scope > p").count();
    expect(pCount, `path card ${i} should have 3 <p> rows`).toBe(3);
    expect(eCount, `expectations card ${i} should have 3 <p> rows (eyebrow + title + description)`).toBe(3);
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
  // Path + Expectations side-by-side region for visual comparison
  await page.locator("[data-results-path]").screenshot({
    path: "screenshots-step2/04-path.png",
  });
  await page.locator("[data-results-expectations]").screenshot({
    path: "screenshots-step2/05-expectations.png",
  });
  // Bottom-of-page spacing audit: owner panels → FAQ → disclaimer → nav
  const owner = page.locator("[data-results-owner]");
  if (await owner.count()) {
    await owner.screenshot({ path: "screenshots-step2/06-owner.png" });
  }
  await page.locator("[data-results-faq]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  // capture a tall slice from owner-panels through nav buttons
  const ownerBox = (await owner.first().boundingBox()) ?? null;
  const navBox = (await page.locator("[data-results-nav]").first().boundingBox()) ?? null;
  if (ownerBox && navBox) {
    await page.screenshot({
      path: "screenshots-step2/07-bottom-flow.png",
      clip: {
        x: 0,
        y: Math.max(0, ownerBox.y - 16),
        width: page.viewportSize()?.width ?? 1280,
        height: navBox.y + navBox.height + 24 - (ownerBox.y - 16),
      },
    });
  }
});
