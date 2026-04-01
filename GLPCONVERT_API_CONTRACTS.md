# GLPConvert API contracts (v1)

This file defines the intended request/response contracts for the highest-impact API surfaces.

## `POST /api/recommend`

Purpose: deterministic recommendation from structured intake.

Request:

```json
{
  "vertical": "glp",
  "answers": [
    { "questionId": "goal", "value": "lose_weight" },
    { "questionId": "timeline", "value": "asap" }
  ]
}
```

Response:

```json
{
  "ok": true,
  "vertical": "glp",
  "recommendation": {
    "programId": "priority-consult",
    "programName": "Priority consult pathway",
    "rationale": "Based on your answers, many patients explore...",
    "priceSignal": { "kind": "range", "minUsd": 149, "maxUsd": 399 },
    "urgencyScore": 85,
    "complianceNotes": [
      "Not medical advice.",
      "A licensed provider will determine final eligibility."
    ]
  }
}
```

## `POST /api/lead`

Purpose: persist lead + notify tenant.

Required fields:

- `name`
- `email`
- `address`
- `tenantSlug`

Behavior:

- applies rate limiting
- stores lead in configured storage
- optionally sends notification email if tenant notification email + Resend key exist

## `POST /api/tenant/crm-webhook`

Purpose: set/clear tenant webhook endpoint for CRM delivery.

Request:

```json
{
  "companyHandle": "clinic-slug",
  "crmWebhookUrl": "https://example.com/hook",
  "token": "<magic-link-token>"
}
```

Response:

```json
{ "success": true, "message": "CRM webhook saved. New leads will be sent to your URL." }
```

## `POST /api/stripe/create-checkout-session`

Purpose: create onboarding checkout session.

Inputs include:

- `plan`
- attribution params (`utm_source`, `utm_campaign`)
- optional `cancel_url`

Output:

- `{ "url": "https://checkout.stripe.com/..." }`

## Webhook contracts

- `POST /api/webhooks/stripe`: subscription state and provisioning events
- `POST /api/webhooks/resend`: email event ingestion

## Error model

Standardized shape (target):

```json
{
  "ok": false,
  "error": "short_machine_code",
  "message": "human readable message"
}
```

