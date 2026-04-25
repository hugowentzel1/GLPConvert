"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import MarketingLegalShell from "@/components/legal/MarketingLegalShell";
import { SUPPORT_EMAIL, PRODUCT_NAME, PARENT_COMPANY_LEGAL_NAME } from "@/lib/product-identity";
import { buildMarketingPathHref } from "@/lib/glp-intake-nav-href";

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const subject = searchParams?.get("subject");
    if (!subject) return;
    setFormData((f) => ({ ...f, message: decodeURIComponent(subject) }));
  }, [searchParams]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    /**
     * Try a real backend first (`/api/contact`). If that's not deployed or fails, fall back to a
     * `mailto:` to `SUPPORT_EMAIL` so messages aren't silently swallowed (was previously console.log only).
     */
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "", message: "" });
      }, 4000);
    } catch {
      const subject = encodeURIComponent(`Contact from ${formData.name || "site visitor"}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`,
      );
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
      setSubmitError("Opening your email app to send the message directly to our team.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MarketingLegalShell
      title="Contact"
      lead={
        <span>
          Sales, partnership, and product questions for <strong>{PRODUCT_NAME}</strong> ({PARENT_COMPANY_LEGAL_NAME}).
          For existing customer technical issues, use{" "}
          <Link
            href={buildMarketingPathHref(searchParams, "/support")}
            className="font-medium text-slate-900 underline decoration-slate-300"
          >
            Support
          </Link>{" "}
          for fastest routing and SLAs.
        </span>
      }
      contentClassName="not-prose max-w-none space-y-0"
    >
      <div className="grid gap-12 md:grid-cols-2 md:gap-14">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Send a message</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            We route commercial inquiries to our growth team. Include your role, org size, and whether you need HIPAA /
            BAA discussion—response typically within one business day.
          </p>
          {submitted ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <p className="font-semibold text-emerald-900">Thanks — we received your message.</p>
              <p className="mt-1 text-sm text-emerald-800">We&apos;ll reply to the email you provided.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-800">
                  Full name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Jamie Smith"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-800">
                  Work email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="you@clinic.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-800">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="(404) 555-0100"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-800">
                  Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="What can we help you with?"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Sending…" : "Send message"}
              </button>
              {submitError ? (
                <p className="mt-2 text-center text-xs text-slate-500">{submitError}</p>
              ) : null}
            </form>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Direct channels</h2>
          <ul className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
            <li className="flex gap-3">
              <span className="text-slate-400" aria-hidden>
                ✉
              </span>
              <span>
                <span className="font-medium text-slate-900">Email</span>
                <br />
                <a
                  className="text-slate-800 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-500"
                  href={`mailto:${SUPPORT_EMAIL}`}
                >
                  {SUPPORT_EMAIL}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-slate-400" aria-hidden>
                📍
              </span>
              <span>
                <span className="font-medium text-slate-900">Mailing address</span>
                <br />
                {PARENT_COMPANY_LEGAL_NAME}
                <br />
                1700 Northside Drive, Suite A7 #5164
                <br />
                Atlanta, GA 30318, USA
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-slate-400" aria-hidden>
                ⏰
              </span>
              <span>
                <span className="font-medium text-slate-900">Business hours (US Eastern)</span>
                <br />
                Monday–Friday, 9:00–18:00. Closed weekends and US federal holidays.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </MarketingLegalShell>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-slate-50" aria-label="Loading" />}>
      <ContactForm />
    </Suspense>
  );
}
