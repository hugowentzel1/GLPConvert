"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Container from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import BrandedDemoOrDefaultFooter from "@/components/intake/BrandedDemoOrDefaultFooter";
import { buildBrandedDemoReturnHref, buildMarketingPathHref } from "@/lib/glp-intake-nav-href";
import { PRODUCT_NAME } from "@/lib/product-identity";

function APIDocumentationContent() {
  const sp = useSearchParams();
  const homeHref = buildBrandedDemoReturnHref(sp);
  const supportHref = buildMarketingPathHref(sp, "/support");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <Section>
        <Container>
          <div className="space-y-8">
            <div>
              <Link
                href={homeHref}
                className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to home
              </Link>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900">API documentation</h1>
            <p className="text-gray-600 max-w-3xl">
              Core API surfaces for {PRODUCT_NAME}. This product is intake and booking software,
              not medical advice. All endpoints are JSON, authenticated by tenant API key (server
              calls) or session cookie (admin dashboard).
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-3">Core endpoints</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><code>POST /api/recommend</code> — deterministic recommendation output</li>
                  <li><code>POST /api/lead</code> — lead persistence + email notification</li>
                  <li><code>POST /api/tenant/crm-webhook</code> — set tenant CRM endpoint</li>
                  <li><code>POST /api/stripe/create-checkout-session</code> — onboarding checkout</li>
                  <li><code>POST /api/webhooks/stripe</code> — Stripe webhook handling</li>
                </ul>
              </Card>
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-3">Recommendation request / response</h2>
                <pre className="bg-gray-900 text-green-300 p-3 rounded text-xs overflow-x-auto"><code>{`POST /api/recommend
{
  "vertical": "glp",
  "answers": [
    {"questionId":"goal","value":"lose_weight"},
    {"questionId":"timeline","value":"asap"}
  ]
}`}</code></pre>
                <pre className="bg-gray-900 text-green-300 p-3 rounded text-xs overflow-x-auto mt-3"><code>{`{
  "ok": true,
  "vertical": "glp",
  "recommendation": {
    "programId": "priority-consult",
    "programName": "Priority consult pathway",
    "priceSignal": {"kind":"range","minUsd":149,"maxUsd":399},
    "urgencyScore": 85
  }
}`}</code></pre>
              </Card>
            </div>

            <div className="text-center pt-6">
              <Link
                href={supportHref}
                className="inline-flex items-center px-6 py-3 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                ← Back to support
              </Link>
            </div>
          </div>
        </Container>
      </Section>
      <BrandedDemoOrDefaultFooter />
    </div>
  );
}

export default function APIDocumentationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" aria-label="Loading" />}>
      <APIDocumentationContent />
    </Suspense>
  );
}
