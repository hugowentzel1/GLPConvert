# COMPLIANCE_NOTES_GLPCONVERT.md

Practical compliance posture for GLPConvert. **Not legal advice.** Route final copy and BAA templates to counsel (`U024` in `MASTER_TODO_GLPCONVERT.md`).

## Product role

Educational, pre-consult **conversion and expectation** layer. All treatment decisions remain with a **licensed provider**.

**Wording:** Prefer **HIPAA-ready** (architecture + vendor chain toward BAA) in product and sales until counsel approves **HIPAA-compliant** or equivalent claims. Do not imply certification you do not hold.

## Minimal patient-facing disclosures (use on results + capture as needed)

- This is **general information**, not medical advice. Final treatment decisions are made by a **licensed provider**.  
- **Actual pricing may vary** based on provider evaluation and program selection.  
- **Individual results vary.**  

Avoid long legal walls; repeat only where needed (results, pricing, ROI illustration).

## HIPAA-ready posture (engineering + ops)

When storing **PHI/PII** tied to health-related intake:

| Area | Direction |
|------|-----------|
| **BAA** | Execute BAA with subprocessors (e.g. Supabase) where required; clinic BAA as your sales motion defines. |
| **Encryption** | TLS in transit; at-rest per host (Supabase/Vercel defaults); no secrets in client bundles. |
| **Access** | Service role server-only; tenant isolation in data model. |
| **Audit** | Server logs / Supabase audit where available; avoid logging full PHI in plain text. |
| **Consent** | Checkbox before contact/follow-up; store consent flags on lead. |

## What we do not claim in product UI

- Diagnosis, eligibility, or “you qualify”  
- Guaranteed outcomes or specific medical results  
- Fixed price guarantees unless clinic explicitly configures a fixed offer (still show “may vary” where appropriate)  

## Compounded / drug-specific copy

Follow `U023`: no overstated compounding claims; align with counsel for jurisdiction-specific rules.

## Attribution / pixels

UTM capture is implemented (`lib/glp-attribution.ts`). **Meta / Google pixels** are not hard-coded—add behind env + consent after **legal review** (`U024`). See **`docs/ATTRIBUTION_PIXELS_GLPCONVERT.md`**.

## Marketing testimonials (Apr 2026)

Homepage quote cards and `data/trust.json` may use **composite / illustrative** operator quotes to explain positioning. They must **not** imply verified clinical outcomes, specific patient results, or third-party endorsement. Prefer language like “illustrative,” “pilot,” “category norm,” and keep **`U024`** review before implying HIPAA compliance or guaranteed business lift.

## Related

- `GLPCONVERT_LEGAL_COMPLIANCE_NOTES.md` — legacy/extended notes  
- `app/legal/terms`, `app/legal/privacy` — **human review before production claims** (`U024`)  
