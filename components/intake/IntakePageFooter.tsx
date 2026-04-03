import Link from "next/link";
import { PARENT_COMPANY_LEGAL_NAME, PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

/**
 * Intake footer: minimum visible legal + vendor line low in hierarchy.
 */
export default function IntakePageFooter() {
  const year = new Date().getFullYear();

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
        className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] font-medium text-slate-500"
        aria-label="Legal and support"
      >
        <Link href="/legal/terms" className="hover:text-slate-800">
          Terms
        </Link>
        <Link href="/legal/privacy" className="hover:text-slate-800">
          Privacy
        </Link>
        <Link href="/contact" className="hover:text-slate-800">
          Contact
        </Link>
        <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-slate-800">
          Support
        </a>
      </nav>
      <p className="mt-5 text-[10px] text-slate-400">© {year} {PRODUCT_NAME}</p>
    </footer>
  );
}
