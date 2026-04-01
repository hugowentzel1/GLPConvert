# GLPConvert — white-label / multi-tenant SaaS patterns (sources)

How strong **B2B white-label** platforms make the product **usable for any reseller** while you keep one codebase. Use with **`TenantProvider`**, tenant rows in Supabase, **`docs/GLPCONVERT_OUTREACH_UX_SOURCES_MAR2026.md`**, and **`MASTER_TODO_GLPCONVERT.md`** **R017–U020**.

## Architecture & tenancy

- [Veld Systems — White label SaaS architecture & business model](https://veldsystems.com/blog/white-label-saas-architecture-business-model) — partner vs end-customer hierarchy; shared DB + **tenant isolation** (RLS / `tenant_id`) vs cost tradeoffs.
- [Developex — White-label SaaS architecture & growth (2026)](https://developex.com/blog/building-scalable-white-label-saas/) — **bounded flexibility**, fast time-to-market, feature flags / partner-specific behavior without forked codebases.
- [Sell SaaS / Partner — White label app advantages & challenges (2025)](https://partner.sell-saas.com/building-a-white-label-app-advantages-and-challenges-in-2025-architecture-example-included) — customization vs maintainability.

## Branding & “looks like them, not you”

- [LMS Portals — Branding checklist for white-label resellers](https://www.lmsportals.com/post/checklist-branding-elements-every-white-label-saas-reseller-needs) — name, logo, **2–3 colors**, typography, **custom domain**, no visible vendor traces where possible.
- [Tarkenton — Customizing white-label SaaS: flexibility vs consistency](https://tarkenton.com/customizing-white-label-saas-balancing-flexibility-and-consistency/) — tiered customization, workflows, integrations—avoid unlimited one-off forks.

## Product implications for GLPConvert (actionable)

1. **Tenant surface:** Logo, **primary/secondary colors** (CSS variables), display name, optional **custom domain** later—defaults must look professional when unset.
2. **Embed:** **Iframe + link-out** with documented **min-height**, optional `postMessage` resize (**R017**); parent page should not need to know your internal routing.
3. **Demo URLs:** `company` / `demo` query params for **cold email**—each prospect sees *their* brand without a separate deploy.
4. **Compliance:** White-label does **not** remove **FTC / state / medical advertising** obligations from the **tenant’s** claims; GLPConvert stays **educational + non-diagnostic** in copy (**`COMPLIANCE_NOTES_GLPCONVERT.md`**).
5. **Onboarding:** Short checklist in **`/docs/setup`**—env **names** only on public pages; secrets only in Vercel + **`.env.local`**.
