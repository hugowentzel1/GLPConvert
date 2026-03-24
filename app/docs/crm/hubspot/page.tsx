"use client";

import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import Footer from "@/components/Footer";

export default function HubSpotCRMGuidePage() {
  const b = useBrandTakeover();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <a
            href="/"
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
            HubSpot CRM Integration
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Seamlessly connect your solar quotes to HubSpot for lead
              management and automation.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Setup Steps
              </h2>

              <ol className="list-decimal ml-6 space-y-4">
                <li>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Get HubSpot API Key
                  </h3>
                  <p className="text-gray-600">
                    Navigate to Settings → Integrations → API Keys in your
                    HubSpot account
                  </p>
                </li>

                <li>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Configure Contact Properties
                  </h3>
                  <p className="text-gray-600">
                    Set up custom properties for solar-specific data like roof
                    size, energy usage, etc.
                  </p>
                </li>

                <li>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Create Deal Pipeline
                  </h3>
                  <p className="text-gray-600">
                    Set up stages: Lead → Qualified → Proposal → Closed Won/Lost
                  </p>
                </li>

                <li>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Test Integration
                  </h3>
                  <p className="text-gray-600">
                    Submit a test quote to verify data flows correctly
                  </p>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Data Mapping
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Properties
                  </h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      <strong>Address:</strong> Property Address
                    </li>
                    <li>
                      <strong>Roof Size:</strong> Square Footage
                    </li>
                    <li>
                      <strong>Energy Usage:</strong> Monthly kWh
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Deal Properties
                  </h3>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      <strong>System Size:</strong> kW
                    </li>
                    <li>
                      <strong>Estimated Cost:</strong> Dollar Amount
                    </li>
                    <li>
                      <strong>Savings:</strong> Annual $
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Automation Workflows
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Welcome Email
                  </h3>
                  <p className="text-sm text-gray-600">
                    Send immediate confirmation when quote is generated
                  </p>
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Follow-up Sequence
                  </h3>
                  <p className="text-sm text-gray-600">
                    Schedule calls and send additional information
                  </p>
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lead Scoring
                  </h3>
                  <p className="text-sm text-gray-600">
                    Automatically score leads based on quote data
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
