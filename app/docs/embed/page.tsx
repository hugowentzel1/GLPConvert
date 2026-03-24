"use client";

import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import Footer from "@/components/Footer";

export default function EmbedGuidePage() {
  const b = useBrandTakeover();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="text-center space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Embed Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Add to your website with one line of code
            </p>
          </div>

          {/* Embed Code Section */}
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                One-Line Integration
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
            </div>

            {/* Customization Options */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Customization Options
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
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Branding
                  </h3>
                  <p className="text-sm text-gray-600">
                    Custom colors, logos, and company information
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Validation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Address validation and error handling
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Performance
                  </h3>
                  <p className="text-sm text-gray-600">
                    Optimized loading and caching
                  </p>
                </div>
              </div>
            </div>

            {/* Testing Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Testing Your Integration
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Test locally
                    </h4>
                    <p className="text-sm text-gray-600">
                      Verify the widget appears and functions correctly
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Check functionality
                    </h4>
                    <p className="text-sm text-gray-600">
                      Test address input and quote generation
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Verify branding
                    </h4>
                    <p className="text-sm text-gray-600">
                      Ensure your company colors and logo appear correctly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
