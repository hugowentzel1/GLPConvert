# Clinic onboarding wizard (structure)

Maps to existing flows: Stripe checkout → `app/activate` → `/c/[handle]` dashboard.

## Steps (product)

1. **Plan & pay** — `/pricing` → Stripe Checkout (setup + subscription).
2. **Activate** — `/activate?session_id=` — confirm email, magic link.
3. **Brand** — logo URL, primary color, company name (query params today; wizard UI TODO).
4. **Programs** — map clinic packages to `programs` rows (Supabase — TODO).
5. **CRM** — webhook URL + field mapping (`/api/tenant/crm-webhook` patterns).
6. **Go live** — copy instant URL, embed snippet (`public/embed.js`), optional custom domain (`/onboard/domain`).

## Compliance gates

- Checkbox: “I will not use the tool for diagnosis or medication eligibility decisions.”
- Link to Terms + Privacy.

## Engineering TODO

- Consolidate scattered post-purchase copy into one `OnboardingChecklist` component on `/c/[handle]`.
- Persist checklist progress in Supabase `tenant_onboarding` (future table).
