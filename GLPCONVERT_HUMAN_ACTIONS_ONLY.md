# GLPCONVERT_HUMAN_ACTIONS_ONLY.md

Human-only steps, strict chronological order.

Legend: `[x] DONE` | `[~] IN_PROGRESS` | `[ ] TODO`

---

- [~] **S008** Create remote Git repository and push local `main`.  
  Why: required for Vercel/GitHub integration.

- [ ] **S010** Create Vercel project from repo and configure Preview + Production environment variables.

- [ ] **S012** Create Supabase project(s) and set Supabase env vars in Vercel.

- [ ] **S013** Run `supabase/migrations/0003_glpconvert_intake_and_programs.sql` on staging.

- [ ] **S025** Create Resend sending domain and API key.

- [ ] **S027** Create Stripe test products/prices and webhook endpoints.

- [ ] **S029** Configure production DNS/domain alignment (app + email sending domain).

- [ ] **S034** Legal counsel review and approve Terms/Privacy/DPA/claims wording.

- [ ] **S036** Run final production smoke checks.

---

Reply **`done`** after completing the current `IN_PROGRESS` step.
