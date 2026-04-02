import Link from "next/link";
import { PARENT_COMPANY_LEGAL_NAME, PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

/**
 * Intake-specific footer: legal + product disclosure (white-label embed / link context).
 * Independent of solar legacy; GLP-1 clinic software positioning only.
 */
export default function IntakePageFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-intake-footer
      className="mx-auto mt-16 w-full max-w-2xl border-t border-slate-200/90 pt-10 pb-8 text-center"
    >
      <p className="text-xs leading-relaxed text-slate-600">
        <strong className="font-semibold text-slate-800">{PRODUCT_NAME}</strong> is pre-consult education and routing
        software for weight-management programs. It does not provide medical care, prescriptions, or eligibility
        decisions — a licensed clinician does. Estimates and ranges are illustrative; actual plans and pricing depend
        on the provider.
      </p>
      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        By continuing, visitors acknowledge they are not receiving medical advice from {PRODUCT_NAME}. Clinics are
        responsible for their own policies, consents, and compliant handling of health information with vendors under
        their agreements.
      </p>
      <nav
        className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-600"
        aria-label="Legal and support"
      >
        <Link href="/legal/terms" className="hover:text-slate-900 hover:underline">
          Terms
        </Link>
        <Link href="/legal/privacy" className="hover:text-slate-900 hover:underline">
          Privacy
        </Link>
        <Link href="/legal/refund" className="hover:text-slate-900 hover:underline">
          Refunds
        </Link>
        <Link href="/contact" className="hover:text-slate-900 hover:underline">
          Contact
        </Link>
        <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-slate-900 hover:underline">
          {SUPPORT_EMAIL}
        </a>
      </nav>
      <p className="mt-6 text-[11px] text-slate-400">
        © {year} {PRODUCT_NAME} · {PARENT_COMPANY_LEGAL_NAME}
      </p>
    </footer>
  );
}
