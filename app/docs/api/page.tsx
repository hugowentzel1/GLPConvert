"use client";

import Container from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import Footer from '@/components/Footer';
import { PRODUCT_NAME } from '@/lib/product-identity';

export default function APIDocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <Section>
        <Container>
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">API Documentation</h1>
            <p className="text-gray-600 max-w-3xl">
              Core API surfaces for {PRODUCT_NAME}. This product is intake and booking software, not medical advice.
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
                <h2 className="text-xl font-bold mb-3">Recommendation request/response</h2>
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
          </div>
        </Container>
      </Section>
      <Footer />
    </div>
  );
}
