"use client";

import Footer from "@/components/Footer";
import Link from "next/link";

/**
 * Legacy URL kept for bookmarks. Sunspire does not sync leads to Airtable in-app.
 */
export default function AirtableCRMGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/docs/crm"
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            ← Back to CRM guides
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            Airtable — not a built-in sync
          </h1>
          <p className="text-gray-600 mb-4">
            <strong>Last updated:</strong> March 2026
          </p>
          <p className="text-gray-700 mb-4">
            Sunspire stores tenants and leads in <strong>Supabase</strong>. There is
            no first-party Airtable connector in the app.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>
              <strong>Dashboard &amp; API:</strong> Use{" "}
              <Link href="/docs/crm" className="text-[var(--brand-primary)] underline">
                CRM webhook
              </Link>{" "}
              (HubSpot, Salesforce, or any HTTPS endpoint) for real-time lead
              delivery.
            </li>
            <li>
              <strong>Export:</strong> Use Supabase Table Editor (export) or your
              own automation (e.g. Make, Zapier) reading from Supabase or from
              forwarded webhook payloads — on your side, not required by Sunspire.
            </li>
          </ul>
          <p className="text-sm text-gray-500">
            If you used Airtable historically, you can keep a read-only base for
            archives; archiving the base is optional and does not affect production.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
