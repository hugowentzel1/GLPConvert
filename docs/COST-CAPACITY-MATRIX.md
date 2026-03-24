# Sunspire — Cost & Capacity Matrix

External APIs and services: pricing, limits, usage, and mitigation.

## Services

| Service | Purpose | Pricing / model | Rate limits / quotas | Usage per quote | Usage per lead | Usage per tenant | Risk / mitigation |
|--------|---------|------------------|----------------------|----------------|----------------|------------------|-------------------|
| **Airtable** | Tenants, leads | Per base; free tier limited | 5 req/s per base (recommended) | 0 | 1 write + 1 read (tenant) | 1 read (lookup) | Throttle; batch where possible. |
| **Stripe** | Payments, webhooks | Per transaction; no per-request fee for API | 100 req/s (standard) | 0 | 0 | Checkout 1, webhook 1+ | Webhook idempotency; retries. |
| **NREL PVWatts** | Solar production | Free (api.data.gov key) | 1000/hour (default key) | 1 | 0 | 0 | Rate limit in `app/api/estimate` (lib/rate-limit); timeout 5s. |
| **EIA** | Utility rates | Free (API key) | 5000/day (typical) | 1 (or cached) | 0 | 0 | Timeout 5s; caching in rates layer. |
| **Google Geocoding** | Address → lat/lng (server) | Free tier then per-request | 50 req/s (default) | 1 (or from client) | 0 | 0 | GOOGLE_GEOCODING_API_KEY; timeout 5s. |
| **Google Places** | Autocomplete (client) | Free tier then per-request | Per key | 0–1 | 0 | 0 | NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; client-only. |
| **Resend** | Transactional email | Per email | Plan-dependent | 0 | 1 (installer) + 0–1 (onboarding) | 0–1 (onboarding) | Timeout 5s; retry in email-service. |
| **USGS 3DEP** | Elevation / shading | Free | No strict published limit | 1 (estimate) | 0 | 0 | Timeout 8s in health; estimate uses it. |
| **Vercel KV** | Idempotency, DLQ, rate limiting | Per store | Plan-dependent | 0 | 0–1 | 0 | Used in webhook idempotency. |

## Per-flow usage (typical)

- **One homeowner quote:** 1 NREL, 1 EIA (or cached), 1 Google Geocoding (if server path), 1 USGS 3DEP (shading). No lead, no Airtable lead write.
- **One lead submit:** 1 Airtable write (upsert), 1 Airtable read (tenant), 0–1 Resend (installer email). Optional: 1 CRM webhook POST (fire-and-forget, 8s timeout).
- **One purchase:** 1 Stripe checkout, 1+ Stripe webhook events, 1 Airtable tenant upsert, 1 Resend (onboarding email).

## Risk scenarios

- **100k installers / viral traffic:** NREL 1000/hr could be exceeded; mitigate with rate limit (already in estimate route), caching, and optional queue. Airtable: stay within 5 req/s or upgrade. Stripe/Resend: scale with plan.
- **Demo abuse:** Demo mode limits enforced server-side where implemented; rate limiting on submit-lead and stripe-checkout (see `src/lib/ratelimit.ts`, create-checkout-session).

## Safety in code

- **Timeouts:** Health checks 5–8s; estimate route uses AbortSignal.timeout for NREL; lead route Resend and CRM webhook with timeouts.
- **Rate limiting:** `checkRateLimit` used for submit-lead and stripe-checkout (see `app/api/lead/route.ts`, `app/api/stripe/create-checkout-session/route.ts`).
- **Idempotency:** Stripe webhook uses `withIdempotency` (event id); lead upsert by email+tenant (one row per pair).
- **Circuit breaker / fail-open:** No formal circuit breaker; health returns 503 so monitors can alert; lead/estimate return 500/503 on dependency failure.
