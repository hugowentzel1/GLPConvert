/**
 * Hold the browser on the current screen so you can watch a headed run (demo / QA).
 * Set VISUAL_STEP_PAUSE_MS=30000 for 30 seconds after each visual step.
 */
export function getVisualStepPauseMs(): number {
  const raw = process.env.VISUAL_STEP_PAUSE_MS || process.env.PLAYWRIGHT_VISUAL_HOLD_MS || '';
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export async function holdVisualStep(page: import('@playwright/test').Page): Promise<void> {
  const ms = getVisualStepPauseMs();
  if (ms > 0) {
    await page.waitForTimeout(ms);
  }
}
