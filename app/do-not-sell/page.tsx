"use client";

import { Suspense, useState } from "react";
import MarketingLegalShell from "@/components/legal/MarketingLegalShell";
import { PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

/**
 * "Do Not Sell or Share My Personal Information" — California CPRA (Cal. Civ. Code § 1798.135)
 * compliant opt-out form. Also fulfills the "limit use of sensitive personal information" right.
 *
 * Sources:
 * - California Code of Regulations § 7026 (Notice at Collection / Opt-Out methods).
 * - CPPA Final Rules, March 2023, on Universal Opt-Out and Authorized Agents.
 * - Cal. Civ. Code § 1798.130(a)(2) (request handling timeline: 45 days, extendable to 90).
 * - Stripe / Vercel / Notion privacy centers as 2024–2026 self-serve pattern references.
 *
 * Submission path: tries `/api/privacy/opt-out` first; falls back to a `mailto:` so requests are
 * never silently dropped (the previous version `console.log`-only with a stale `getsunspire.com`
 * address has been removed).
 */
function DoNotSellContent() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/privacy/opt-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, kind: "ccpa_opt_out" }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setSubmitted(true);
    } catch {
      const subject = encodeURIComponent("CCPA Do-Not-Sell / Do-Not-Share opt-out request");
      const body = encodeURIComponent(
        `Email: ${email}\n\nThis user is requesting to opt out of the sale or sharing of their personal information under the California Privacy Rights Act (CPRA).`,
      );
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
      setError("Opening your email app to send the request directly to our privacy team.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MarketingLegalShell
      title="Do Not Sell or Share My Personal Information"
      lastUpdated="April 24, 2026"
      lead={
        <span>
          California residents have the right to opt out of the &quot;sale&quot; or
          &quot;sharing&quot; of their personal information under the California Privacy Rights Act
          (CPRA). {PRODUCT_NAME} does not sell personal information for monetary consideration and
          does not share personal information for cross-context behavioral advertising. We provide
          this form to honor the opt-out right and the &quot;limit use of sensitive personal
          information&quot; right.
        </span>
      }
      contentClassName="not-prose max-w-none space-y-10"
    >
      <section
        className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="opt-out-heading"
      >
        <h2 id="opt-out-heading" className="text-xl font-semibold tracking-tight text-slate-900">
          Submit an opt-out request
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          We process verifiable consumer requests within 45 days (extendable to 90 days with
          notice) per Cal. Civ. Code § 1798.130(a)(2).
        </p>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-800">
                Email address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Submitting…" : "Submit opt-out request"}
            </button>
            {error ? (
              <p className="text-center text-xs text-slate-500">{error}</p>
            ) : null}
          </form>
        ) : (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="font-semibold text-emerald-900">Request received</p>
            <p className="mt-1 text-sm text-emerald-800">
              We&apos;ll process your opt-out and confirm by email within 45 days. You can submit
              another request any time.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="mt-3 text-sm font-medium text-emerald-900 underline decoration-emerald-300 underline-offset-2 hover:decoration-emerald-500"
            >
              Submit another request
            </button>
          </div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-slate-500">
          {PRODUCT_NAME} respects the Global Privacy Control (GPC) signal where transmitted by your
          browser; an enabled GPC signal is treated as a valid CPRA opt-out request for that
          browser/device under Cal. Code Regs. tit. 11, § 7025.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Your CPRA rights</h2>
        <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700">
          <li>
            <strong>Right to know</strong> — request the categories and specific pieces of personal
            information we have collected about you.
          </li>
          <li>
            <strong>Right to delete</strong> — request deletion of personal information we have
            collected, subject to legal exceptions.
          </li>
          <li>
            <strong>Right to correct</strong> — request correction of inaccurate personal information.
          </li>
          <li>
            <strong>Right to opt out</strong> — opt out of any sale or sharing of personal information.
          </li>
          <li>
            <strong>Right to limit use of sensitive personal information</strong> — restrict use of
            sensitive PI to that necessary to provide the service.
          </li>
          <li>
            <strong>Right to non-discrimination</strong> — exercise these rights without losing access
            to services or paying a different price.
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-slate-700">
          For broader privacy questions, see the <a href="/privacy" className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-500">Privacy Policy</a>{" "}
          or email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-500">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>
    </MarketingLegalShell>
  );
}

export default function DoNotSellPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-slate-50" aria-label="Loading" />}>
      <DoNotSellContent />
    </Suspense>
  );
}
