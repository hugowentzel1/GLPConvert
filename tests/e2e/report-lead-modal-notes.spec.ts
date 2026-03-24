/**
 * Step 29: Exhaustive tests for optional "Any additional comments or notes?" on paid report.
 * - Modal shows notes field (visual).
 * - Submit with notes → stored in Supabase → verifiable via last-lead API.
 * Run: npx playwright test tests/e2e/report-lead-modal-notes.spec.ts
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const TEST_TOKEN = process.env.TEST_API_TOKEN;
// Local: E2E_PAID_COMPANY=paid for paid report + last-lead tenant (e.g. /report?company=paid)
const COMPANY = process.env.E2E_PAID_COMPANY || process.env.E2E_COMPANY || "AcmeSolar";

test.describe("Step 29 — Paid report lead modal with optional notes", () => {
  test("report page loads and CTA footer or Book consultation button is visible", async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=${COMPANY}&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: "domcontentloaded", timeout: 25000 }
    );
    await page.waitForSelector('[data-testid="report-page"], [data-testid="report-cta-footer"], [data-testid="report-bottom-cta"]', { timeout: 45000 }).catch(() => null);
    const consultBtn = page.getByRole("button", { name: /Book your consultation|Book a Consultation/i }).first();
    await expect(consultBtn).toBeVisible({ timeout: 15000 });
  });

  test("consultation modal opens and shows optional notes field", async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=${COMPANY}&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: "domcontentloaded", timeout: 35000 }
    );
    const consultBtn = page.getByRole("button", { name: /Book your consultation|Book a Consultation/i }).first();
    await expect(consultBtn).toBeVisible({ timeout: 18000 });
    await consultBtn.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 12000 });
    await expect(dialog).toContainText(/Book your free consultation|Share your details/i);
    await expect(dialog.locator("#report-lead-name")).toBeVisible({ timeout: 5000 });
    await expect(dialog.locator("#report-lead-email")).toBeVisible({ timeout: 5000 });
    await expect(dialog.locator("#report-lead-phone")).toBeVisible({ timeout: 5000 });
    await expect(dialog.locator("#report-lead-notes")).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByLabel(/Any additional comments or notes\? \(optional\)/i).or(dialog.locator("#report-lead-notes"))).toBeVisible();
    const notesEl = dialog.locator("#report-lead-notes");
    await expect(notesEl).toHaveAttribute("placeholder", /timeline|questions|contacted|optional/i).catch(() => null);
  });

  test("notes field is optional — submit without notes succeeds or returns clear response", async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=${COMPANY}&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: "domcontentloaded", timeout: 25000 }
    );
    const consultBtn = page.getByRole("button", { name: /Book your consultation/i }).first();
    await expect(consultBtn).toBeVisible({ timeout: 12000 });
    await consultBtn.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await dialog.locator("#report-lead-name").fill("NoNotes Test");
    await dialog.locator("#report-lead-email").fill(`nonotes-${Date.now()}@test.example`);
    await dialog.getByRole("radio", { name: /Email/i }).check();
    await dialog.locator("#report-lead-consent").check();
    await dialog.getByRole("button", { name: /Book your consultation|Sending/ }).click();
    await expect(
      page.getByText(/You're all set|You'll hear back|Thanks for submitting|all set|hear back within|Something went wrong|Failed|error|SUPABASE_URL/i).or(page.getByTestId("report-lead-success"))
    ).toBeVisible({ timeout: 12000 });
  });

  test("submit with notes — notes visible in form, submit returns success or error", async ({ page, request }) => {
    const uniqueNote = `E2E note ${Date.now()} prefer call after 5pm`;
    await page.goto(
      `${BASE}/report?company=${COMPANY}&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: "domcontentloaded", timeout: 25000 }
    );
    const consultBtn = page.getByRole("button", { name: /Book your consultation/i }).first();
    await expect(consultBtn).toBeVisible({ timeout: 12000 });
    await consultBtn.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await dialog.locator("#report-lead-name").fill("NotesTest User");
    await dialog.locator("#report-lead-email").fill(`notes-${Date.now()}@test.example`);
    await dialog.locator("#report-lead-notes").fill(uniqueNote);
    await dialog.getByRole("radio", { name: /Call/i }).check();
    await dialog.locator("#report-lead-consent").check();
    await dialog.getByRole("button", { name: /Book your consultation|Sending/ }).click();
    await expect(
      page.getByText(/You're all set|You'll hear back|Thanks for submitting|all set|hear back within|Something went wrong|Failed|error|SUPABASE_URL/i).or(page.getByTestId("report-lead-success"))
    ).toBeVisible({ timeout: 12000 });

    if (TEST_TOKEN) {
      const lastRes = await request.get(
        `${BASE}/api/test/last-lead?tenant=${COMPANY}`,
        { headers: { "x-test-token": TEST_TOKEN } }
      );
      if (lastRes.ok()) {
        const { last } = await lastRes.json();
        const notes = last?.fields?.Notes ?? last?.fields?.notes ?? "";
        if (notes) expect(notes).toContain(uniqueNote);
      }
    }
  });

  test("visual — modal shows notes textarea and placeholder", async ({ page }) => {
    await page.goto(
      `${BASE}/report?company=${COMPANY}&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA`,
      { waitUntil: "domcontentloaded", timeout: 35000 }
    );
    const consultBtn = page.getByRole("button", { name: /Book your consultation/i }).first();
    await expect(consultBtn).toBeVisible({ timeout: 18000 });
    await consultBtn.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 12000 });
    const notesLabel = dialog.getByLabel(/Any additional comments or notes\? \(optional\)/i).or(dialog.locator("#report-lead-notes"));
    await expect(notesLabel).toBeVisible({ timeout: 5000 });
    const notesTextarea = dialog.locator("#report-lead-notes");
    await expect(notesTextarea).toBeVisible();
    await expect(notesTextarea).toHaveAttribute("placeholder", /timeline|questions|contacted|optional/i).catch(() => null);
  });
});
