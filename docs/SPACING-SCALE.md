# Sunspire — Spacing & typography scale

Single system used across homepage, report, dashboard, and modals. Implemented with Tailwind classes.

## Vertical spacing (sections)

- **Section padding:** `py-8 md:py-10` or `py-10 md:py-12` for major blocks (e.g. CTA section, How it works, features grid).
- **Card/block internal:** `p-6`, `p-8`, or `p-8 md:p-10` for large cards.
- **Between elements in a stack:** `space-y-6` (e.g. CTA section), `space-y-8` (e.g. How it works steps), `gap-8` for grids.

## Horizontal spacing

- **Between “How it works” steps:** `gap-8 md:gap-10 lg:gap-12` (flex row on desktop).
- **Between bullet items (CTA bullets):** `gap-3 sm:gap-6`; each bullet: `gap-2` between bullet char and text.
- **Grid gaps:** `gap-8` (feature cards), `gap-6` (dashboard grid).

## Typography

- **Page titles:** `text-2xl md:text-3xl font-bold`.
- **Card titles:** `text-xl font-bold` or `text-2xl font-black`.
- **Body:** `text-sm` / `text-base`, `text-gray-600` / `text-slate-700`.
- **Microcopy:** `text-sm text-slate-500`, `text-xs text-gray-500`.

## Tokens (Tailwind)

- No custom CSS variables for spacing; Tailwind scale used: 2, 3, 4, 6, 8, 10, 12 (in `rem` via Tailwind config).
- Brand color: `var(--brand-primary)` or `style={{ backgroundColor: 'var(--brand-primary)' }}` for CTAs.

## Files

- Homepage: `app/page.tsx` (CTA bullets, How it works, features grid).
- Report: `app/report/page.tsx` (tiles, chart, CTA footer).
- Dashboard: `app/c/[companyHandle]/page.tsx` (cards, Connect CRM block).
- Lead modal: `components/LeadModal.tsx` (form spacing).
- Report lead modal: `components/report/ReportLeadModal.tsx` (p-6 md:p-8, space-y-4).
- Report CTA footer: `components/report/ReportCTAFooter.tsx` (mt-8 mb-8, p-6 md:p-8, gap-3).
