# Health & alerts setup — one place to look

**Goal:** Look at UptimeRobot, the health/status page, and Sentry daily (or have them email you when something breaks). All alerts must go to **support@getsunspire.com**.

## 1. What /api/health covers

`GET /api/health` is the single source of truth. It probes **every** API Sunspire depends on in the quote → lead → payment path:

| Service        | Purpose                          |
|----------------|----------------------------------|
| Airtable       | Tenants & leads                  |
| Stripe         | Payments & webhooks              |
| NREL PVWatts   | Solar production                 |
| EIA            | Utility rates                    |
| Google Geocoding | Address → lat/lng (server)     |
| Google Places  | Address autocomplete (config)    |
| Resend         | Lead & onboarding email          |
| Vercel KV      | DLQ, idempotency, rate limiting  |
| USGS 3DEP      | Elevation / shading               |

- If **any** probed dependency fails, the endpoint returns **503** so monitors can alert.
- Full route-to-health mapping: `docs/API-HEALTH-COVERAGE.md`.

## 2. UptimeRobot

- **Monitor:** `GET https://[your-domain]/api/health`
- **Alert when:** HTTP status ≠ 200 (e.g. 503 when a dependency is down)
- **Alert contact:** Add **support@getsunspire.com** as the alert email so you get notified when the check fails.

## 3. Status page (/status)

- Open **/status** to see every API row (ok/degraded/down), version, and timestamp.
- Same data as /api/health, in a human-readable layout. Auto-refreshes every 60s.

## 4. Sentry

- **Purpose:** Error monitoring (exceptions, failed requests).
- **Make it work:** Set `SENTRY_DSN` (server) and `NEXT_PUBLIC_SENTRY_DSN` (client) in Vercel env. In production, Sentry will capture errors.
- **Alerts:** In Sentry project **Settings → Alerts**, set notifications to **support@getsunspire.com** so you get email when new issues or spikes occur.
- **Limits:** Free plan has event limits; see MAINTENANCE-GUIDE for scaling.

## 5. Daily routine (or rely on alerts)

1. **UptimeRobot** — You get email only when /api/health fails (if alert contact is support@getsunspire.com).
2. **Sentry** — You get email on new issues/spikes (if alerts set to support@getsunspire.com).
3. **Optional:** Open /status once a day to confirm all green.

If alerts are set correctly, you don’t have to check manually; you’ll be notified when something breaks.
