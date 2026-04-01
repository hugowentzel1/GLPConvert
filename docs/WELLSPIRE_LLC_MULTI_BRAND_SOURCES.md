# Wellspire LLC — multi-brand structure (GLPConvert, TRTConvert, PEPConvert)

**Not legal advice.** This is a **research index** for **Wellspire LLC** operating multiple B2B SaaS / lead-conversion products. **Verify** requirements with a **licensed attorney** in your **formation state** and any **foreign qualification** states, plus **tax counsel** as needed.

## Bottom line (structure)

- **Yes — one LLC can legally own and operate multiple software products and brands.** There is no federal rule that GLPConvert, TRTConvert, and PEPConvert must be separate companies. The LLC is the **single legal entity**; customer-facing names are typically **trade names** / **DBAs** (state-dependent) or simply **brands** disclosed in contracts and on the site.
- **Trade-off:** Under **one LLC**, **liability and creditors generally reach the whole company’s assets** for all lines of business. A serious claim tied to one product can affect the others. **Separate LLCs per product** increase cost and admin but **isolate** liability **between** entities (imperfectly—courts can pierce in egregious cases). Many early-stage SaaS operators use **one LLC + multiple brands**; they **split entities** when revenue, risk, or investor pressure warrants it.

## DBA / fictitious name (multiple brands, one LLC)

- DBAs are **not** separate legal persons; they are **names** the LLC uses. Rules are **state and sometimes county/city** specific (fees, renewal, publication—e.g. NY publication requirements).
- **Useful primers (not substitutes for counsel):**
  - [GovDocFiling — How many DBAs can an LLC have (2025 guide)](https://www.govdocfiling.com/blog/how-many-dbas-can-an-llc-have/)
  - [LegalZoom — Can one LLC have two businesses?](https://www.legalzoom.com/articles/can-one-llc-have-two-businesses)
  - [CorpNet — Can you have multiple businesses under one LLC?](https://www.corpnet.com/blog/can-i-use-my-llc-for-more-than-one-business/)
  - [TaxSym — Multiple DBAs under one LLC](https://www.taxsym.com/blog/can-you-have-multiple-dba-under-one-llc)

## Tax / IRS (single EIN)

- The IRS issues **one EIN** to the LLC; DBAs do **not** get separate federal tax IDs for the same disregarded/partnership LLC structure in the usual case. Income from all brands is reported on the LLC’s **single** tax framework (disregarded entity, partnership, or corporate election as filed).
- **Apply for EIN (official):** [IRS — Apply for an EIN online](https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online)
- **Form SS-4 instructions:** [IRS — Instructions for Form SS-4](https://www.irs.gov/instructions/i1040ss4)

## Formation checklist (typical U.S. LLC)

- **State registration:** Articles / certificate of organization, **registered agent**, name compliance (**“LLC”** designator, no duplicate with state registry).
- **Operating agreement:** Defines members, management, capital, **permitted business purpose** (broad “software and related services” often used), decision-making, exit—**especially important** if you have co-founders.
- **SBA launch guidance (federal + state links hub):** [SBA — Register your business](https://www.sba.gov/business-guide/launch/register-your-business-federal-state-agency)
- **SBA — LLC key documents overview:** [SBA blog — Forming an LLC: key documents](https://www.sba.gov/blogs/forming-llc-key-documents-youll-need-file-and-create)
- **General educational step guides (cross-check your state):** [Investopedia — How to start an LLC](https://www.investopedia.com/how-to-start-an-llc-8631304), [Nolo — Form an LLC](https://www.nolo.com/legal-encyclopedia/form-llc-how-to-organize-llc-30287.html)

## Corporate Transparency Act / BOI (FinCEN)

- **Beneficial Ownership Information (BOI)** reporting under the **Corporate Transparency Act** has been subject to **court orders and shifting deadlines**. Do **not** rely on a static blog date: check **FinCEN** and **current** counsel guidance.
- **Official hub:** [FinCEN — Beneficial Ownership Information Reporting](https://www.fincen.gov/boi)
- **Legal industry updates (examples):** [National Law Review — CTA / FinCEN coverage](https://natlawreview.com/) (search “Corporate Transparency Act” for latest)

## Trademarks (GLPConvert, TRTConvert, PEPConvert, Wellspire)

- **Applicant** on a federal application is typically the **legal entity** (Wellspire LLC). **Use in commerce** and **specimen** rules apply per class (e.g. **SaaS** in Class 42).
- **Official:** [USPTO — Trademark basics](https://www.uspto.gov/trademarks/basics), [Apply](https://www.uspto.gov/trademarks/apply), [Base application requirements](https://www.uspto.gov/trademarks/apply/base-application-requirements), [Trademark Center](https://trademarkcenter.uspto.gov/)
- **Strategy:** clearance search (**TESS** + common-law) before major brand spend; consider **one** house mark (**Wellspire**) plus **product** marks as budget allows.

## Contracts, websites, and Stripe

- **Terms / Privacy / DPA:** Identify **Wellspire LLC** as the contracting party; use **“DBA GLPConvert”** (or similar) where clarity helps. Align **privacy policy** with actual data flows (e.g. Supabase, Stripe, email).
- **Stripe / card statements:** Business **legal name** should match **KYC**; **statement descriptors** can often reflect the **customer-facing brand** within Stripe rules—confirm in dashboard and [Stripe docs](https://docs.stripe.com/).

## Insurance and risk (software + health-adjacent marketing)

- **Commercial general liability**, **technology errors & omissions (E&O)**, and **cyber** coverage are common for B2B SaaS. Health-adjacent positioning does **not** make you a clinic, but **claims** risk and **partner** requirements may still push you toward stronger coverage and **U024** counsel review.

## When to split into multiple LLCs (summary)

| Approach | Pros | Cons |
|----------|------|------|
| **One Wellspire LLC + DBAs / brands** | Lowest friction, one tax return, one EIN, faster to ship | Shared liability pool across all products |
| **Separate LLC per product + optional holding co.** | Stronger **asset separation** between brands | Multiple filings, tax complexity, cost |

## Product note: GLPConvert billing (Stripe)

- **Wellspire** sells **software**: a **one-time setup** and **recurring subscription** are both valid under a single merchant; Stripe **Products/Prices** should mirror that (see **`MASTER_TODO_GLPCONVERT.md` U038** and **`.env.example`**).

---

**Action:** Complete **`MASTER_TODO_GLPCONVERT.md`** section **Wellspire LLC & multi-brand ladder (W001+)** before scaling **cold email**, so footers, contracts, and Stripe **Know Your Business** data are consistent.
