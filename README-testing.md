# 🧪 Sunspire E2E Testing Guide

## Required Environment Variables

```bash
# Required for live tests
LIVE_BASE=https://sunspire-web-app.vercel.app
DEMO_BASE=https://demo.sunspiredemo.com   # or same as LIVE_BASE
QA_TENANT_SLUG=qa-acme                    # ensure this tenant exists in Airtable
NEXT_PUBLIC_E2E=1                         # exposes data-testid attrs

# Optional for lead verification
TEST_API_TOKEN=<random-secret>            # enables /api/test/last-lead verification
```

## Installation

```bash
# Install dependencies
npm i -D @playwright/test cross-env
npx playwright install
```

## Running Tests

### Live E2E Tests (Recommended)

```bash
# Set environment variables
export LIVE_BASE="https://sunspire-web-app.vercel.app"
export DEMO_BASE="https://demo.sunspiredemo.com"
export QA_TENANT_SLUG="qa-acme"
export NEXT_PUBLIC_E2E=1
export TEST_API_TOKEN="your-secret-token"

# Run live tests
npm run test:e2e:live
```

### All Tests

```bash
npm run test:e2e
```

### Debug Mode

```bash
npm run test:debug
```

### Headed Mode (see browser)

```bash
npm run test:headed
```

## Test Coverage

### ✅ Health Endpoint

- `/healthz` returns 200 with `{ok: true}`

### ✅ Demo Mode (`/?company=testco&demo=1`)

- Shows `demo-cta` (Activate on Your Domain button)
- Shows `pricing-section` (FAQ section)
- Shows `howitworks-section` (How It Works)
- Does NOT show `live-bar`

### ✅ Outreach Slugs (`/o/testco-abc123`)

- Redirects to demo URL
- Shows demo experience

### ✅ Paid Mode (`/?company=qa-acme`)

- Does NOT show `demo-cta`, `pricing-section`, `howitworks-section`
- Shows `live-bar` (Live for {Company})
- Shows `footer-legal-links` (Terms, Privacy, etc.)
- Does NOT show `footer-marketing-links` (Pricing, Partners, Demo)

### ✅ Lead Submission

- Shows `lead-success-toast` on successful submit
- Optionally verifies lead in Airtable via `/api/test/last-lead`

## Test Data Requirements

### Airtable Setup

1. Create `qa-acme` tenant with `demo=false`
2. Ensure `Leads` table exists with fields:
   - `Company Handle`
   - `Name`
   - `Email`
   - `Address`
   - `Created`

### Test API Token

1. Set `TEST_API_TOKEN` environment variable
2. Use same token in test headers for lead verification

## Troubleshooting

### Tests Failing

1. **Check environment variables** - all required vars must be set
2. **Verify live site** - ensure `LIVE_BASE` is accessible
3. **Check tenant exists** - `QA_TENANT_SLUG` must exist in Airtable
4. **Verify test IDs** - ensure `NEXT_PUBLIC_E2E=1` is set

### Common Issues

- **Timeout errors**: Increase timeout in `playwright.config.ts`
- **Element not found**: Check if test IDs are properly added
- **Network errors**: Verify live site is accessible
- **Lead verification fails**: Check `TEST_API_TOKEN` and Airtable setup

## Test Reports

After running tests, check:

- Console output for test results
- `playwright-report/` folder for HTML report
- Screenshots in `test-results/` for failed tests

## Continuous Integration

Add to your CI pipeline:

```yaml
- name: Run E2E Tests
  run: |
    export LIVE_BASE="${{ secrets.LIVE_BASE }}"
    export QA_TENANT_SLUG="${{ secrets.QA_TENANT_SLUG }}"
    export NEXT_PUBLIC_E2E=1
    npm run test:e2e:live
```

---

## 🎯 Success Criteria

All tests should pass when:

- Demo mode shows demo CTAs and marketing
- Paid mode hides demo content and shows Live bar
- Outreach slugs redirect correctly
- Lead submission shows success toast
- Footer shows appropriate links for each mode
- Health endpoint returns 200

**Total test time: ~2-3 minutes** 🚀
