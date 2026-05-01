"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buildMarketingPathHref } from "@/lib/glp-intake-nav-href";
import { PARENT_COMPANY_LEGAL_NAME, PRODUCT_NAME } from "@/lib/product-identity";

/**
 * Intake footer: minimum visible legal + vendor line low in hierarchy.
 * Preserves full query (demo, UTM, branding) on in-app links.
 *
 * Buyer pass 25:
 *   • Support link routed to /support PAGE (was mailto: — direct
 *     mailto on a footer link is jarring on mobile and inconsistent
 *     with the rest of the site, where /support is a full help page
 *     with docs + ticket form + email). Stripe / Notion / Linear
 *     2024 footer convention: "Support" → /support page; "Contact"
 *     → /contact form. Both kept here because they serve different
 *     audiences (general inquiry vs help/troubleshooting).
 *   • Mobile tap targets: every nav link now has py-2 px-2 padding
 *     so each clickable area is ≥44×44 per Apple HIG iOS Touch
 *     Target guidelines (Material 3: 48dp). Previously links were
 *     17-20px tall — below the touch-accuracy threshold.
 */
export default function IntakePageFooter() {
  const year = new Date().getFullYear();
  const sp = useSearchParams();
  const terms = buildMarketingPathHref(sp, "/legal/terms");
  const privacy = buildMarketingPathHref(sp, "/privacy");
  const contact = buildMarketingPathHref(sp, "/contact");
  const support = buildMarketingPathHref(sp, "/support");

  const navLinkClass =
    "inline-flex min-h-[44px] items-center px-2 py-2 hover:text-slate-800 transition-colors";

  return (
    <footer
      data-intake-footer
      className="mx-auto mt-14 w-full max-w-2xl border-t border-slate-200/80 pt-8 pb-10 text-center"
    >
      <p
        data-intake-attribution
        className="text-[11px] font-medium leading-relaxed text-slate-500"
      >
        {PRODUCT_NAME} · {PARENT_COMPANY_LEGAL_NAME}
      </p>
      <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-slate-500">
        Pre-consult education and routing software — not medical care or prescribing. A licensed clinician decides
        treatment. Estimates are illustrative; pricing and plans depend on your provider.
      </p>
      <nav
        className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-0 text-[11px] font-medium text-slate-500"
        aria-label="Legal and support"
      >
        <Link href={terms} className={navLinkClass}>
          Terms
        </Link>
        <Link href={privacy} className={navLinkClass}>
          Privacy
        </Link>
        <Link href={contact} className={navLinkClass}>
          Contact
        </Link>
        <Link href={support} className={navLinkClass}>
          Support
        </Link>
      </nav>
      <p className="mt-3 text-[10px] text-slate-400">© {year} {PRODUCT_NAME}</p>
    </footer>
  );
}
