'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import BrandedDemoOrDefaultFooter from '@/components/intake/BrandedDemoOrDefaultFooter';
import { buildBrandedDemoReturnHref } from '@/lib/glp-intake-nav-href';

function MethodologyContent() {
  const searchParams = useSearchParams();
  const b = useBrandTakeover();
  const homeHref = buildBrandedDemoReturnHref(searchParams);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 font-inter">
      {/* Brand color CSS var (header is injected by the root layout, not in-page). */}
      <style>{`:root{--brand-primary:${b.primary};}`}</style>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Methodology
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            How GLPConvert creates deterministic, compliance-safe recommendation outputs for educational intake and booking workflows.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Sources</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Deterministic Recommendation Logic</h3>
                <p className="text-gray-600 mb-4">
                  We use explicit rule definitions mapped to structured intake answers. This avoids black-box behavior and keeps recommendations auditable.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Question-by-question weighted logic with deterministic outputs</li>
                  <li>Program recommendation, short rationale, and price signal format</li>
                  <li>Urgency scoring for internal routing (not medical claims)</li>
                  <li>Vertical-specific configs for GLP, TRT, and Pep modules</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Compliance-Safe Copy Rules</h3>
                <p className="text-gray-600 mb-4">
                  The system is intentionally constrained to educational and booking language:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>&ldquo;Based on your answers, many patients explore programs like X&rdquo;</li>
                  <li>&ldquo;A licensed provider will determine final eligibility&rdquo;</li>
                  <li>&ldquo;Not medical advice&rdquo; on intake/result/footer surfaces</li>
                  <li>No diagnosis, dosing, or guaranteed outcome language</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Minimization</h3>
                <p className="text-gray-600 mb-4">
                  v1 intake focuses on structured, non-free-text fields to reduce sensitive data exposure:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Avoid unnecessary health detail in free-text fields</li>
                  <li>Capture only data needed for routing and booking</li>
                  <li>Support GDPR export/delete and tenant controls</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Calculation Methods</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Recommendation Output</h3>
                <p className="text-gray-600">
                  The output includes recommended program, rationale, price signal (fixed / starts-at / range), and booking CTA guidance.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Pricing Signal Rules</h3>
                <p className="text-gray-600 mb-4">
                  Pricing display follows transparent rules:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Use fixed only when truly fixed for that clinic/program</li>
                  <li>Otherwise use starts-at or typical range labeling</li>
                  <li>Always clarify that provider/clinic confirms final pricing and eligibility</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Scope Boundaries</h3>
                <p className="text-gray-600">
                  GLPConvert is not an EMR, not telehealth infrastructure, and not prescribing software. It is a pre-consult conversion layer.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Accuracy & Limitations</h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Recommendations are educational and booking-oriented. Real clinical suitability is determined only by a licensed provider.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Clinical history and medical evaluation not captured in pre-intake</li>
                <li>Clinic-specific protocols and availability</li>
                <li>Provider judgment and applicable regulations</li>
                <li>Data supplied by the user during intake</li>
              </ul>
              <p className="text-gray-600 font-medium">
                This methodology is for informational software behavior only and does not constitute medical advice.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href={homeHref}
            className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white transition-colors"
            style={{ backgroundColor: b.primary }}
          >
            ← Back to Home
          </Link>
        </div>
      </main>

      <BrandedDemoOrDefaultFooter />
    </div>
  );
}

export default function MethodologyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" aria-label="Loading" />}>
      <MethodologyContent />
    </Suspense>
  );
}
