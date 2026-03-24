"use client";

import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";

export default function SetupGuidePage() {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <a
            href={searchParams?.get('demo') ? `/?${searchParams?.toString()}` : `/paid?${searchParams?.toString()}`}
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </a>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
          <h1 className="text-4xl font-black text-gray-900 mb-8 text-center">
            Setup Guide
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> September 2025
            </p>

            <p className="text-gray-600 mb-6">
              Get your branded solar quote tool up and running in 24 hours
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Step-by-step Installation
              </h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Account Setup
                    </h3>
                    <p className="text-gray-600">
                      Complete your company profile and branding configuration
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Domain Configuration
                    </h3>
                    <p className="text-gray-600">
                      Connect your website domain and set up SSL certificates
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Widget Integration
                    </h3>
                    <p className="text-gray-600">
                      Add the one-line script to your website
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow-lg">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Lead delivery
                    </h3>
                    <p className="text-gray-600">
                      Leads hit your inbox instantly and your dashboard; optional CRM connection when you&apos;re ready.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shadow-lg">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Testing & Launch
                    </h3>
                    <p className="text-gray-600">
                      Test the system and go live with your branded tool
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Embed Guide
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Add to your website
                  </h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <code>
                      &lt;script
                      src=&quot;https://your-domain.com/widget.js&quot;&gt;&lt;/script&gt;
                    </code>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Replace &quot;your-domain.com&quot; with your actual domain
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      WordPress
                    </h4>
                    <p className="text-sm text-gray-600">
                      Add to your theme&apos;s footer.php or use a custom HTML
                      widget
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Shopify
                    </h4>
                    <p className="text-sm text-gray-600">
                      Add to your theme.liquid file in the &lt;/body&gt; section
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Wix</h4>
                    <p className="text-sm text-gray-600">
                      Use the HTML embed element in your page editor
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Custom HTML
                    </h4>
                    <p className="text-sm text-gray-600">
                      Add the script tag anywhere in your HTML
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                CRM Guides
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-8 h-8 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    HubSpot
                  </h3>
                  <p className="text-sm text-gray-600">
                    Automatic contact creation and deal tracking
                  </p>
                  <a
                    href="/docs/crm/hubspot"
                    className="inline-flex items-center text-[var(--brand-primary)] hover:underline font-medium"
                  >
                    View Guide
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-8 h-8 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Salesforce
                  </h3>
                  <p className="text-sm text-gray-600">
                    Lead and opportunity management integration
                  </p>
                  <a
                    href="/docs/crm/salesforce"
                    className="inline-flex items-center text-[var(--brand-primary)] hover:underline font-medium"
                  >
                    View Guide
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-8 h-8 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Supabase + CRM webhook
                  </h3>
                  <p className="text-sm text-gray-600">
                    Leads and tenants live in Supabase. Connect HubSpot, Salesforce, or a custom URL from the dashboard.
                  </p>
                  <a
                    href="/docs/crm"
                    className="inline-flex items-center text-[var(--brand-primary)] hover:underline font-medium"
                  >
                    View Guide
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                System Status
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-green-800">
                      All Systems Operational
                    </span>
                  </div>
                  <span className="text-sm text-green-600">99.9% uptime</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      API Performance
                    </h4>
                    <p className="text-sm text-gray-600">
                      Average response time: 45ms
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Database
                    </h4>
                    <p className="text-sm text-gray-600">
                      Connected and responsive
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">CDN</h4>
                    <p className="text-sm text-gray-600">
                      Global distribution active
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      SSL Certificates
                    </h4>
                    <p className="text-sm text-gray-600">Valid and secure</p>
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href="/status"
                    className="inline-flex items-center text-[var(--brand-primary)] hover:underline font-medium"
                  >
                    View Live Status Page
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </section>
          </div>
          
          {/* Back to Support */}
          <div className="mt-12 text-center">
            <a
              href={searchParams?.toString() ? `/support?${searchParams.toString()}` : '/support'}
              className="inline-flex items-center px-6 py-3 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              ← Back to Support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
