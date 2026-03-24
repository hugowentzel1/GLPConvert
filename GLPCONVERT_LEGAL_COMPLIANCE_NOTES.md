# GLPConvert — legal & compliance implementation notes

**Not legal advice.** Engineering checklist for safer defaults; **counsel review required** before production healthcare marketing.

## Product stance

- Software for **marketing, intake, scheduling, and lead routing** only.
- **No diagnosis**, no medication **eligibility** decisions in product copy or logic naming, no **dosage** suggestions, no **outcome** guarantees.

## Required disclaimers (draft — verify with counsel)

- “**This tool is for educational and booking purposes only.**”
- “**Not medical advice.**”
- “**A licensed provider will determine final eligibility.**”
- For program suggestions: “**Based on your answers, many patients explore programs like [X].**”

## Banned wording patterns (product + marketing)

- “You qualify for [drug].”
- “You should take [therapy].”
- “Clinically proven for your case.”
- Equating **compounded** products with **FDA-approved** products without attorney-vetted language.

## Safer replacements

| Avoid | Prefer |
|-------|--------|
| You qualify | You may be a candidate — **provider decides** |
| Best dose | **Provider determines** medication plan |
| Guaranteed weight loss | **Individual results vary** |

## Where disclaimers must appear

- **Footer** (all public pages) — short line + link to Terms/Privacy.
- **Intake start** — one screen before health-related questions.
- **Result / recommendation** — repeat disclaimer adjacent to CTA.
- **Email footers** — same minimal set.

## Privacy / consent

- Separate **marketing email** vs **transactional** consent where applicable.
- Cookie banner aligned with actual trackers (PostHog, Sentry, etc.).

## Data minimization (v1)

- Avoid collecting **free-text clinical history** in v1 if possible; prefer structured multiple-choice.
- Do **not** collect government IDs, full DOB unless strictly necessary and counsel-approved.
- Minimize **weight-related** data unless essential; if collected, treat as sensitive and document purpose limitation.

## HIPAA / BAA

- If vendor stack handles **PHI** on behalf of clinic, **BAA** may be required with hosting/email/CRM vendors.
- Default posture: **no PHI** in v1 lead payloads; pass **booking intent** + **contact** + **non-clinical** structured answers.

## What not to store (v1 default)

- Social Security numbers, insurance member IDs, full clinical notes, lab PDFs.

## SMS consent (draft)

- “By providing your mobile number, you agree to receive **transactional** messages (e.g. booking confirmations) from [Clinic]. Message/data rates may apply. Reply STOP to opt out.”  
- **Marketing SMS** requires separate explicit opt-in — do not conflate with booking.

## Result page disclaimer (draft)

- “**Results are informational.** Program options depend on your clinician’s evaluation. **Not medical advice.**”

## Footer disclaimer (short draft)

- “© [year] [Clinic or GLPConvert]. **Educational and booking purposes only.** **Not medical advice.**”

## Provider eligibility disclaimer (draft)

- “**Only a licensed provider** can determine if a medical weight-loss program is appropriate for you.”

## Human legal review likely needed

- Terms of Service, Privacy Policy, DPA, state advertising rules, weight-loss claim regulation, compound vs branded drug messaging.
