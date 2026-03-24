# GLPConvert — human actions only (chronological)

Smallest set of steps **you** must perform that automation cannot. After each step, reply **`done`** or **`next step`** so work can continue.

## Next required human step (single)

**1. Create a GitHub (or Git host) repository and push this project’s `main` branch.**

- **Local state:** `git init` is already done and the migration baseline is committed on `main` (`022e3cb`).
- **Why it blocks:** CI, collaboration, and Vercel Git integration need a remote URL.
- **What happens immediately after:** Connect Vercel to the repo, then mirror env vars per `GITHUB_VERCEL_SUPABASE_RESEND_STRIPE_CHECKLIST.md`.

---

### Later steps (do not start until step 1 is done)

2. **Vercel:** Create a new project pointing at this repo; set production + preview env vars from `ENV_VARS_GLPCONVERT.md` / `.env.example`.
3. **Domains:** Register or point DNS for production (e.g. `glpconvert.com`) and Resend-sending domain alignment.
4. **Supabase:** Create project (or clone schema); add `SUPABASE_URL` + service role to Vercel; run schema migrations when drafted.
5. **Stripe:** Create GLPConvert products/prices; set `STRIPE_*` keys and webhook endpoint in Dashboard; test mode → live cutover.
6. **Resend:** Verify sending domain; create API key; transactional template review.
7. **Legal:** Counsel review of Terms/Privacy/DPA for healthcare-adjacent marketing product (non-diagnostic positioning).

If step 1 is already done in your environment, say **`next step`** and the checklist will advance to the next blocking item only.
