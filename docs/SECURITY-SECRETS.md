# Secrets handling

- **Local:** Put real values in **`.env.local`** only (or copy `.env.example` → `.env.local` and fill in). `.env.local` matches `.gitignore` rule **`.env*.local`** — it will **not** be committed. Never commit or upload this file.
- **Production / Vercel:** Set variables in the Vercel dashboard only. Do not paste secrets into tickets, chat, or git.
- **If secrets were exposed:** Rotate them in each provider (Stripe, Supabase, Resend, JWT, Vercel, Airtable, etc.) and update Vercel + your local `.env.local`.

**Vercel naming:** Use `VERCEL_PROJECT_ID` (underscores). A typo like `Vercel_Project_ID` is not read by the app.

**Supabase on Vercel:** Either set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, or set the staging/prod pairs (`SUPABASE_URL_STAGING` + `SUPABASE_SERVICE_ROLE_KEY_STAGING` for Preview; prod pair for Production). Preview uses **staging** unless `VERCEL_ENV === "production"`.
