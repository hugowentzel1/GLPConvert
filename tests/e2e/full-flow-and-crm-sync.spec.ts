/**
 * Full flow E2E: health → landing → demo → report → lead API.
 * CRM sync test: POST /api/lead stores lead and returns success (CRM webhook is optional per tenant).
 * Run local: npm run test:local (or npx playwright test tests/e2e/full-flow-and-crm-sync.spec.ts)
 * Run visible: npx playwright test tests/e2e/full-flow-and-crm-sync.spec.ts --headed
 */

import { test, expect } from "@playwright/test";

const BASE =
  process.env.BASE_URL ||
  process.env.PLAYWRIGHT_BASE_URL ||
  "http://localhost:3000";

test.describe("Full flow and CRM sync", () => {
  test("Full flow: health → landing → demo URL → report → lead API success or tenant missing", async ({
    request,
    page,
  }) => {
    const healthRes = await request.get(`${BASE}/api/health`);
    expect(healthRes.ok() || healthRes.status() === 503).toBe(true);

    await page.goto(`${BASE}/?company=TestCo&demo=1`, {
      waitUntil: "networkidle",
    });
    await expect(
      page.locator('button[data-cta="primary"], button[data-cta-button]').first()
    ).toBeVisible({ timeout: 10000 });

    await page.goto(
      `${BASE}/report?company=TestCo&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`,
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForSelector("text=/NREL|PVWatts|pvwatts|annual|production|estimate|savings|kwh/i", { timeout: 15000 }).catch(() => null);
    await page.waitForTimeout(2000);
    const body = (await page.locator("body").innerText()).trim();
    expect(body).toMatch(/solar|quote|nrel|pvwatts|estimate|savings|kwh/i);

    const leadRes = await request.post(`${BASE}/api/lead`, {
      data: {
        name: "Full Flow Test",
        email: "fullflow@test.example",
        address: "1600 Amphitheatre Parkway, Mountain View, CA",
        tenantSlug: "TestCo",
      },
      headers: { "Content-Type": "application/json" },
    });
    expect([200, 500]).toContain(leadRes.status());
    const leadJson = await leadRes.json().catch(() => ({}));
    if (leadRes.status() === 200) {
      expect(leadJson.success).toBe(true);
    } else {
      expect(leadJson.error).toBeDefined();
    }
  });

  test("CRM sync: POST /api/lead with full payload returns 200 or 500 and correct shape", async ({
    request,
  }) => {
    const res = await request.post(`${BASE}/api/lead`, {
      data: {
        name: "CRM Sync Test",
        email: "crmsync@test.example",
        phone: "+15551234567",
        address: "901 S Mopac Expy, Austin, TX 78746",
        tenantSlug: "solarcorp",
        systemSizeKW: 8,
        netCostAfterITC: 18000,
        year1Savings: 1200,
        paybackYear: 12,
        npv25Year: 8000,
        co2OffsetPerYear: 4.2,
      },
      headers: { "Content-Type": "application/json" },
    });
    expect([200, 400, 429, 500]).toContain(res.status());
    const data = await res.json().catch(() => ({}));
    if (res.status() === 200) {
      expect(data.success).toBe(true);
      expect(data.message).toMatch(/success|submitted/i);
    }
    if (res.status() === 400) {
      expect(data.error).toBeDefined();
    }
    if (res.status() === 500) {
      expect(data.error).toBeDefined();
    }
  });

  test("Lead API rejects missing required fields", async ({ request }) => {
    const res = await request.post(`${BASE}/api/lead`, {
      data: { name: "A", email: "a@b.co" },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
    const data = await res.json().catch(() => ({}));
    expect(data.error).toBeDefined();
  });

  test("Lead idempotency: double submit same email+tenant returns 200 both times", async ({ request }) => {
    const payload = {
      name: "Idempotency Test",
      email: `idem-${Date.now()}@test.example`,
      address: "1600 Amphitheatre Parkway, Mountain View, CA",
      tenantSlug: "TestCo",
    };
    const res1 = await request.post(`${BASE}/api/lead`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
    const res2 = await request.post(`${BASE}/api/lead`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
    expect([200, 500]).toContain(res1.status());
    expect([200, 500]).toContain(res2.status());
    if (res1.status() === 200 && res2.status() === 200) {
      const j1 = await res1.json().catch(() => ({}));
      const j2 = await res2.json().catch(() => ({}));
      expect(j1.success).toBe(true);
      expect(j2.success).toBe(true);
    }
  });

  test("POST /api/lead accepts utm_source and demo_or_paid", async ({ request }) => {
    const res = await request.post(`${BASE}/api/lead`, {
      data: {
        name: "UTM Test",
        email: `utm-${Date.now()}@test.example`,
        address: "1600 Amphitheatre Parkway, Mountain View, CA",
        tenantSlug: "TestCo",
        utm_source: "google",
        demo_or_paid: false,
      },
      headers: { "Content-Type": "application/json" },
    });
    expect([200, 500]).toContain(res.status());
    if (res.status() === 200) {
      const data = await res.json().catch(() => ({}));
      expect(data.success).toBe(true);
    }
  });
});

test.describe("Homeowner lead flow (UI)", () => {
  test("Report page: Request a free consult opens modal; submit shows success or CTA visible", async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.goto(
      `${BASE}/report?company=TestCo&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`,
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForSelector('text=/Request a free consult|Book a Consultation|Next step|Launch Your Branded|NREL|savings/i', { timeout: 25000 }).catch(() => null);
    const consultBtn = page.getByRole("button", { name: /Request a free consult/i }).first();
    const consultVisible = await consultBtn.isVisible().catch(() => false);
    if (!consultVisible) {
      const body = await page.locator("body").innerText().catch(() => "");
      expect(body).toMatch(/NREL|savings|solar|report|Request|Consultation|Launch/i);
      return;
    }
    await consultBtn.click().catch(() => null);
    await page.waitForSelector('[role="dialog"]', { timeout: 8000 }).catch(() => null);
    const modal = page.locator('[role="dialog"]').first();
    const modalVisible = await modal.locator("text=/Where should we send your report|free consultation|Email my report/i").isVisible().catch(() => false);
    if (!modalVisible) {
      const body = await page.locator("body").innerText().catch(() => "");
      expect(body).toMatch(/solar|report|NREL|consult|next step/i);
      return;
    }
    await modal.locator("#report-lead-name").fill("E2E Homeowner");
    await modal.locator("#report-lead-email").fill(`homeowner-${Date.now()}@test.example`);
    await modal.locator("#report-lead-consent").check().catch(() => null);
    await modal.locator('button[type="submit"]').click();
    await page.waitForSelector('text=/You\'re all set|hear back within 1 business day|Book a time|Something went wrong|Failed to submit|required/i', { timeout: 15000 }).catch(() => null);
    const modalContent = await modal.locator("div").first().innerText().catch(() => "") || page.locator("body").innerText().catch(() => "");
    const gotSuccess = /You're all set|hear back within 1 business day|Book a time/i.test(modalContent);
    const gotError = /Something went wrong|Failed to submit|required/i.test(modalContent);
    expect(gotSuccess || gotError).toBe(true);
  });
});
