# Health endpoint — dependency check depth

## What `/api/health` actually checks

The health route (`app/api/health/route.ts`) performs **meaningful dependency checks**, not just shape validation:

| Dependency        | Check performed                                                                 | Timeout |
|-------------------|----------------------------------------------------------------------------------|---------|
| **Airtable**      | `base('Tenants').select({ maxRecords: 1 }).firstPage()` — real read              | 5s      |
| **Stripe**        | `stripe.balance.retrieve()` — real API call                                      | 5s      |
| **NREL**          | GET PVWatts v8 JSON with API key (lat/lon, system_capacity, etc.)                | 5s      |
| **EIA**           | GET retail-sales data API                                                        | 5s      |
| **Google Geocoding** | GET geocode JSON for "1600 Amphitheatre Parkway, Mountain View, CA"          | 5s      |
| **Resend**        | GET https://api.resend.com/domains (with Bearer token)                           | 5s      |
| **Google Places** | Config-only (NEXT_PUBLIC key set); no server ping (client-only API)             | —       |

- Each check runs with a 5s timeout; latency &lt; 2s is `ok`, else `degraded`; throw/error is `down`.
- Response: `{ ok, timestamp, version?, commit?, services: HealthCheck[] }`. HTTP 200 if all `ok`, 503 otherwise.
- **Not checked by health:** Sentry (error reporting), Vercel (hosting), Vercel KV / DLQ (optional). Documented in `/status` copy and TO-DO-LIST.

## Limitations

- **Google Places** is only “configured” (key present), not verified with a real request (client-side API).
- **Vercel KV / USGS 3DEP / DLQ** are not included in health; add if they become critical path.
- A **single** failure can make overall `ok: false` and return 503; UptimeRobot/Sentry should alert on that.

## Verification

- **Automated:** Tests assert `GET /api/health` returns 200 or 503 and body has `timestamp` and `services` array.
- **Depth:** Implementation confirms each listed service is **called** (Airtable read, Stripe balance, NREL/EIA/Geo/Resend requests). So health is **dependency-checked**, not only shape-checked.
