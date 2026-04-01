/**
 * Production synthetic: primary GLP funnel (demo branded home + /intake).
 * GLPConvert uses NEXT_PUBLIC_VERTICAL=glp; legacy solar /report is not required here.
 * Run with SYNTHETIC_BASE_URL set. Do not complete real payments.
 */
import { test, expect } from '@playwright/test';

const BASE =
  process.env.SYNTHETIC_BASE_URL || process.env.BASE_URL || 'https://glp-convert.vercel.app';

test.describe('Primary funnel (synthetic)', () => {
  test('demo home loads then /intake shows simulator copy', async ({ page }) => {
    const homeUrl = `${BASE}/?company=SynthTest&demo=1`;
    await page.goto(homeUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await expect(page).toHaveURL(/\?.*company=SynthTest|demo=1/);
    await expect(page.locator('body')).toContainText(/GLP|simulator|branded|Launch|program|Convert|weight/i, {
      timeout: 20000,
    });

    const body = await page.locator('body').innerText();
    expect(body.length).toBeGreaterThan(200);

    const intakeUrl = `${BASE}/intake?company=SynthTest&demo=1`;
    await page.goto(intakeUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await expect(page.locator('body')).toContainText(/weight|simulation|goal|GLP|week|program|journey|start/i, {
      timeout: 20000,
    });

    const intakeBody = await page.locator('body').innerText();
    expect(intakeBody.length).toBeGreaterThan(150);
  });
});
