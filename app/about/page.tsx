import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCT_NAME } from "@/lib/product-identity";

export const metadata: Metadata = {
  title: `About — ${PRODUCT_NAME}`,
  description:
    "White-label pre-consult conversion for GLP-1 and medical weight-loss programs. Educational layer only — not telehealth or prescribing.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">About</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-[2rem] md:leading-snug">
          Built for clinics that already run GLP-1 programs
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-600">
          {PRODUCT_NAME} is a product of <strong className="font-semibold text-slate-800">Wellspire LLC</strong>. We
          focus on one job: what happens <em>before</em> the consult—expectations, typical ranges, consult readiness,
          and a clean handoff to <em>your</em> booking flow or CRM.
        </p>
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-slate-700">
          <p>
            We are <strong className="text-slate-900">not</strong> an EMR, telehealth platform, prescribing service, or
            clinical decision engine. Licensed providers make all treatment decisions.
          </p>
          <p>
            The product is optimized for <strong className="text-slate-900">demo-led</strong> sales: a personalized link
            that shows your branding so buyers feel &ldquo;this is already my front end,&rdquo; then self-serve
            activation when you are ready.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/privacy"
            className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300"
          >
            Privacy
          </Link>
          <Link
            href="/legal/privacy"
            className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300"
          >
            Legal — Privacy
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Contact
          </Link>
        </div>
      </article>
    </main>
  );
}
