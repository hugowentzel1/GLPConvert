"use client";

import Head from "next/head";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import BrandedDemoOrDefaultFooter from "@/components/intake/BrandedDemoOrDefaultFooter";
import { buildBrandedDemoReturnHref } from "@/lib/glp-intake-nav-href";
import { buildStripeCheckoutClientPayload } from "@/lib/stripe-checkout-client";
import { PRODUCT_NAME } from "@/lib/product-identity";

/**
 * Activation form: real Stripe Checkout redirect; falls back to /pricing on any error so the user
 * is never stranded. Chrome (header) is provided by the root layout via ConditionalSharedNav,
 * since `/signup` is in `MARKETING_INTAKE_CHROME_PATHS` — no in-page <SharedNavigation/> here, to
 * avoid the duplicate-header bug. Footer matches the rest of the marketing surface.
 */
function SignupContent() {
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const companyParam = searchParams?.get("company") ?? "";
  const homeHref = buildBrandedDemoReturnHref(searchParams);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const formCompany = String(fd.get("company") ?? "");
      const payload = {
        ...buildStripeCheckoutClientPayload(),
        company: formCompany || buildStripeCheckoutClientPayload().company,
      };
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      const qs = searchParams?.toString() ?? "";
      window.location.href = qs ? `/pricing?${qs}` : "/pricing";
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Activate {PRODUCT_NAME} — Wellspire LLC</title>
        <meta
          name="description"
          content={`Activate your ${PRODUCT_NAME} branded pre-consult site. Live in 24 hours, $99/mo + $399 setup, refundable setup if not live.`}
        />
      </Head>

      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <p className="mb-10 sm:mb-12">
            <Link
              href={homeHref}
              className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              <svg className="mr-2 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
          </p>

          <header className="mb-8 sm:mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {companyParam
                ? `Activate ${PRODUCT_NAME} for ${companyParam}`
                : `Activate ${PRODUCT_NAME}`}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
              Make your branded pre-consult site permanent. Live in <strong>24 hours</strong>, no
              calls required — or your setup fee is refunded.
            </p>
          </header>

          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-slate-800">
                  Clinic / brand name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  defaultValue={companyParam}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="e.g. Sunspire Weight Clinic"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-800">
                  Work email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="you@yourclinic.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-800">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="(555) 555-5555"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-800">Plan</label>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800">
                  <strong>{PRODUCT_NAME}</strong> — $99/mo + $399 setup
                </div>
                <input type="hidden" name="plan" value="starter" />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Preparing secure checkout…" : "Continue to secure checkout"}
              </button>
              {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              $99/mo + $399 setup · Live in 24 hours — or your setup fee is refunded.
            </p>
          </section>
        </main>
        <BrandedDemoOrDefaultFooter />
      </div>
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" aria-label="Loading" />}>
      <SignupContent />
    </Suspense>
  );
}
