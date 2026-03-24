# GLPConvert route inventory (App Router)

| Path | Role |
|------|------|
| `/` | Marketing + legacy address entry |
| `/intake` | **GLP intake stepper** → sessionStorage → `/result` |
| `/result` | Recommendation card + CTA (`?demo=1` or `?from=intake`) |
| `/report` | **Legacy solar report** (banner when `NEXT_PUBLIC_VERTICAL=glp`) |
| `/pricing`, `/signup`, `/paid`, `/activate`, `/success` | SaaS funnel |
| `/c/[companyHandle]/*` | Clinic dashboard |
| `/embed/[slug]` | Hosted embed |
| `/[companyHandle]` | Tenant hosted funnel |
| `/o/*` | Short links |
| `/admin/dashboard` | Internal admin UI |
| `/api/recommend` | POST vertical + answers → recommendation JSON |
| `/api/estimate` | Solar PVWatts stack — **503** when solar disabled (default for `glp`) |
| `/api/health` | Dependency probe |
| `/api/stripe/*`, `/api/webhooks/stripe` | Billing |
| `/api/lead`, `/api/submit-lead`, `/api/leads/*` | Lead capture |
| `/privacy`, `/terms`, `/dpa`, `/security`, `/legal/*` | Legal |
| `/docs/*` | Partner/docs (copy still partially Sunspire — TODO) |
| `/status` | Status page |
