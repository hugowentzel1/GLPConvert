"use client";

import Footer from "@/components/Footer";
import PaidFooter from "@/components/PaidFooter";
import { SUPPORT_EMAIL, PRODUCT_NAME } from "@/lib/product-identity";
import { useIsDemo } from "@/src/lib/isDemo";
import { useSearchParams } from "next/navigation";

export default function AccessibilityPage() {
  const isDemo = useIsDemo();
  const searchParams = useSearchParams();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/80">
      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <a
              href={searchParams?.get("demo") ? `/?${searchParams?.toString()}` : `/paid?${searchParams?.toString()}`}
              className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </a>
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Accessibility</h1>
          <p className="mb-10 text-sm text-slate-500">
            {PRODUCT_NAME} — last updated: {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
          </p>
          <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-li:text-slate-600">
            <p className="lead text-lg text-slate-700">
              We work to make {PRODUCT_NAME} usable by people with a wide range of abilities. This page describes our
              intent and how to report issues.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Accessibility Standards</h2>
            <p className="mb-4">
              We strive to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Accessibility Features</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Keyboard navigation support</li>
              <li>Screen reader compatibility</li>
              <li>High contrast mode support</li>
              <li>Alternative text for images</li>
              <li>Semantic HTML structure</li>
              <li>Focus indicators for interactive elements</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Assistive Technologies</h2>
            <p className="mb-4">
              Our website is designed to work with common assistive technologies including:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
              <li>Voice control software</li>
              <li>Keyboard-only navigation</li>
              <li>Magnification software</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Reporting accessibility issues</h2>
            <p className="mb-4">
              If you hit a barrier using our marketing site or a clinic-branded intake experience, email{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-900 underline decoration-slate-300">
                {SUPPORT_EMAIL}
              </a>{" "}
              with the page URL and what you were trying to do. We route clinic-specific issues to the subscribing
              practice when appropriate.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Ongoing Commitment</h2>
            <p className="mb-4">
              We regularly review and update our accessibility practices to ensure we continue to meet the needs of all users.
              This page will be updated as we make improvements.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Alternative Formats</h2>
            <p className="mb-4">
              If you need information from our website in an alternative format, please contact us and we will work to provide it in a format that meets your needs.
            </p>

          </div>
        </div>
      </main>
      {isDemo ? <Footer /> : <PaidFooter />}
    </div>
  );
}

