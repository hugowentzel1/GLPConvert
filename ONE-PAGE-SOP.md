# 🚀 Sunspire One-Page SOP

## Quick Start (5 min)

1. **Deploy**: `git add . && git commit -m "Complete system" && git push origin main`
2. **Test**: `curl https://sunspire-web-app.vercel.app/healthz` → `{"ok":true}`
3. **Demo**: `/?company=testco&demo=1` → shows "Activate on Your Domain"
4. **Paid**: `/?company=qa-acme` → shows "Live for qa-acme"
5. **Outreach**: `/o/testco-abc123` → redirects to demo

## Customer Activation (10 min)

1. **Send demo**: `/?company=theircompany&demo=1`
2. **Customer clicks "Activate"** → Stripe checkout
3. **Webhook fires** → Tenant created in Airtable
4. **Send paid link**: `/?company=theircompany`
5. **Customer gets clean tool** → leads save to CRM

## Daily Ops (5 min)

- [ ] Postmaster Tools: spam <0.1%
- [ ] Bounces <2%
- [ ] Leads flowing to Airtable
- [ ] `/healthz` returns 200

## Emergency

- **Webhook fails**: Check Stripe logs, verify `STRIPE_WEBHOOK_SECRET`
- **Domain fails**: Check CNAME, wait 5-10 min, test with `node test-domain.js`
- **Demo/paid wrong**: Check URL params, run E2E tests

## Test Commands

```bash
# E2E tests
export LIVE_BASE="https://sunspire-web-app.vercel.app"
npx playwright test tests/e2e.live.sunspire.spec.ts

# Webhook test
node test-webhook.js

# Domain test
node test-domain.js yourdomain.com
```

## URLs

- **Demo**: `/?company=company&demo=1`
- **Outreach**: `/o/company-abc123`
- **Paid**: `/?company=company`
- **Health**: `/healthz`

---

**Ready to sell! 🚀**
