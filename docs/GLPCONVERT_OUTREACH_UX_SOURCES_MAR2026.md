# GLPConvert — outreach & embed UX (external sources, Mar 2026 snapshot)

Curated **third-party** references to inform **cold-email selling**, **multi-segment buyers** (med spa, telehealth, brick-and-mortar), and **white-label / embed** fit. This is **not legal advice**; align copy and flows with **`COMPLIANCE_NOTES_GLPCONVERT.md`** and counsel. **See also:** **`docs/GLPCONVERT_WHITE_LABEL_SAAS_SOURCES.md`** (multi-tenant architecture, branding checklist, bounded customization for resellers).

## Telehealth / GLP-1 funnel & stack

- [Thimble Hub — GLP-1 telehealth stack](https://www.thimblehub.com/resources/glp1-telehealth-stack-guide) — layers: marketing site, checkout/intake, provider network, pharmacy/eRx, portal, CRM, analytics; mobile/Lighthouse and SEO emphasis.
- [Orr Consulting — Marketing GLP-1 & weight-loss telehealth responsibly (CMO playbook)](https://www.orr-consulting.com/post/marketing-glp-1-weight-loss-telehealth-responsibly-a-cmo-playbook) — education over hype, program (not pill-only) positioning, monitoring/long-term framing.
- [Topflight Apps — GLP-1 virtual clinic in 2026](https://topflightapps.com/ideas/glp-1-virtual-clinic/) — scale, automation, retention tooling context.

## Regulatory / claims context (weight loss & telehealth)

- [GlobeNewswire — MEDVi GLP-1 claims / telehealth structure (Mar 2026 report)](https://www.globenewswire.com/news-release/2026/03/17/3257828/0/en/MEDVi-GLP-1-Weight-Loss-Claims-Evaluated-2026-Report-Examining-Most-Trusted-Online-Medical-Care-Positioning-Telehealth-Structure-and-Regulatory-Context.html) — example of how **claims + structure** get scrutinized in 2026 coverage.
- [FTC — Health products compliance guidance](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance) — substantiation, truthful/non-misleading health claims.
- [FTC — Health claims (business center)](https://business.ftc.gov/tips-advice/business-center/advertising-and-marketing/health-claims) — advertising baseline for health-related marketing.

## Med spa / aesthetic web & conversion

- [Digital Med Spa — Spa marketing in 2026](https://www.digitalmedspa.net/post/spa-marketing-in-2026-the-definitive-guide-to-high-value-growth) — authority over discount-heavy tactics; hybrid wellness-medical positioning.
- [RA Digital Creative — Great med spa website (2026)](https://www.radigitalcreative.com/what-makes-a-great-med-spa-website-in-2026) — trust, mobile, booking friction, real imagery.
- [Workee — Best med spa website examples / design trends (2026)](https://workee.ai/blog/best-medspa-websites) — layout and conversion patterns (industry blog).

## Embed, white-label, HIPAA-oriented integration (patterns)

- [Accountable HQ — White labeling HIPAA: requirements & risks](https://www.accountablehq.com/post/is-white-labeling-hipaa-compliant-requirements-risks-and-best-practices) — BAAs, data flow, safeguards when rebranding health tech.
- [Truto — HIPAA-compliant integrations for healthcare SaaS](https://truto.one/blog/how-to-build-hipaa-compliant-integrations-for-healthcare-saas) — encryption, integration hygiene.
- [Knowi — Embed analytics healthcare / HIPAA (2026 guide)](https://www.knowi.com/blog/embed-analytics-healthcare-hipaa/) — iframe vs SDK vs server-side tradeoffs (generalizable to widgets).

## Product implications for GLPConvert (summary)

1. **Funnel:** Education-first simulator, clear **non-medical** framing where appropriate, **program + provider** story—not “magic pill” (aligns with CMO/regulatory themes above).
2. **Segments:** Med spa buyers expect **luxury + clinical trust**; telehealth expects **speed + clarity + compliance**; doctors’ offices may want **minimal chrome** and **printable / shareable** patient-facing flows.
3. **Embed fit:** Narrow layouts, **mobile-first**, fast LCP, **CSS variables** for tenant brand, optional **iframe** with documented height and `sandbox`/parent-page guidance (**R008**, **R017+** in `MASTER_TODO_GLPCONVERT.md`).
4. **Cold email:** Demo links must load **fast** on 4G; **UTM + tenant** params already supported—add **segment-specific landing** copy tests as **AUTO** copy tasks, not one-size-fits-all.
