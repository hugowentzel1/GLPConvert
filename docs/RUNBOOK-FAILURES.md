# Runbook — When things fail

## Email fails (Resend)

- **Symptom:** Installer does not receive “New solar lead” email; onboarding email not received after purchase.
- **Lead still stored:** Yes — Airtable upsert completes before email. Installer can see lead in dashboard `/c/[handle]/leads`.
- **Actions:** Check Resend dashboard for bounces/errors; verify tenant “Notification Email” in Airtable; verify RESEND_API_KEY and domain. No automatic retry queue; manual resend or replay if needed.

## Airtable fails

- **Symptom:** POST `/api/lead` returns 500; Stripe webhook fails on tenant upsert.
- **Actions:** Check Airtable status; verify AIRTABLE_API_KEY and AIRTABLE_BASE_ID; check base permissions and table names (Tenants, Leads). For webhook: Stripe will retry; fix Airtable then replay event if needed (admin/replay-webhook).

## Stripe webhook delayed or failing

- **Symptom:** Customer paid but tenant not active; dashboard shows no data.
- **Actions:** Stripe retries webhooks; check Stripe Dashboard → Developers → Webhooks → event logs. Verify STRIPE_WEBHOOK_SECRET; ensure endpoint returns 200 on success. Idempotency prevents duplicate tenant/email on retry. If event failed permanently, use admin replay endpoint with event id (if implemented).

## CRM webhook (Zapier/Make) fails

- **Symptom:** Lead in Airtable and email sent, but not in installer CRM.
- **Actions:** Fire-and-forget; no retry in app. Installer checks webhook URL in Airtable or dashboard; tests URL manually; checks Zapier/Make logs. Optional: add delivery_status fields and retry queue later.

## Quote/estimate API down (NREL, EIA, etc.)

- **Symptom:** Report page fails to load estimate; /api/health returns 503.
- **Actions:** Check /api/health and /status page for which service is down. NREL: verify API key and rate limit (1000/hr). EIA: verify key. Timeouts (5–8s) may cause “degraded” or “down” in health.

## UptimeRobot / monitoring

- **Monitor:** GET `https://[your-domain]/api/health`. If response is not 200, consider system degraded (health returns 503 when any probed dependency fails).
- **Alert:** Configure alert to support@getsunspire.com (or Sentry for errors).

## Vercel preview verification

- After pushing a branch, run Playwright against the preview URL to verify before merge:
  - `BASE_URL=https://<preview-url> npx playwright test tests/e2e/smoke.spec.ts tests/e2e/full-flow-and-crm-sync.spec.ts tests/e2e/full-user-journey.spec.ts --reporter=list`
- Optional production smoke: `BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/smoke.spec.ts --reporter=list`

## Refund / cancellation / chargebacks

- **Refund policy:** `/legal/refund` (or redirect to `/terms#refunds`). Setup fee refund if not live in 24h; contact support@getsunspire.com.
- **Cancellation:** Customer can cancel subscription via Stripe Customer Portal (link from dashboard or support).
- **Chargebacks:** Provide Stripe with: logs (webhook, tenant creation), onboarding email, ToS acceptance, usage. Use the internal evidence template: `docs/CHARGEBACK-EVIDENCE-TEMPLATE.md`.

## Stripe statement descriptor

- **Location:** Stripe Dashboard → Settings → Branding → Statement descriptor (or Payment methods → Statement descriptor). Ensure it matches customer expectations and is within character limit (typically 22 characters). Document the chosen descriptor in your operator checklist.
