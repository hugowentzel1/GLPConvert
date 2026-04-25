"use client";

import { Suspense } from "react";
import MarketingLegalShell from "@/components/legal/MarketingLegalShell";
import { PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

/**
 * Accessibility statement aligned with current best practice.
 *
 * Sources:
 * - W3C WCAG 2.2 (W3C Recommendation, October 2023): https://www.w3.org/TR/WCAG22/
 * - U.S. Section 508 Refresh (36 CFR Part 1194, ICT Standards), aligned with WCAG 2.0 AA.
 * - EN 301 549 V3.2.1 (2021-03) — European harmonized accessibility standard.
 * - Americans with Disabilities Act (ADA) Title III — DOJ NPRM (Aug 2023) on web/app
 *   accessibility for state and local govt; private-sector best practice tracks WCAG.
 * - ADA web access settlement template patterns (DOJ, NFB v. Target, Robles v. Domino's).
 */
function AccessibilityContent() {
  return (
    <MarketingLegalShell title="Accessibility statement" lastUpdated="April 24, 2026">
      <p>
        {PRODUCT_NAME} is designed and operated by {PRODUCT_NAME} (Wellspire LLC) so that people of
        all abilities can use it. We measure ourselves against the <strong>Web Content
        Accessibility Guidelines (WCAG) 2.2, Level AA</strong> (W3C Recommendation, October 2023),
        which is also the standard adopted by U.S. Section 508 (36 CFR Part 1194) and EN 301 549
        V3.2.1 in the EU.
      </p>

      <h2>Conformance status</h2>
      <p>
        We target conformance with <strong>WCAG 2.2 AA</strong> across the patient intake flow,
        marketing pages, and customer dashboard. Some legacy components are still being updated to
        the 2.2 success criteria (notably <em>2.4.11 Focus Not Obscured (Minimum)</em> and{" "}
        <em>2.5.8 Target Size (Minimum)</em>); ongoing remediation is tracked in our internal
        accessibility backlog.
      </p>

      <h2>Features supported today</h2>
      <ul>
        <li>Keyboard-only navigation through every step of the intake flow and checkout.</li>
        <li>Visible focus rings on all interactive elements (no <code>outline: none</code> overrides).</li>
        <li>Semantic landmarks (<code>header</code>, <code>main</code>, <code>nav</code>, <code>footer</code>) and ARIA roles where semantics are insufficient.</li>
        <li>Color contrast at <strong>4.5:1 minimum</strong> for body text and <strong>3:1</strong> for large text. Customer-supplied brand colors are checked against WCAG AA on white CTAs and darkened automatically when they fall below 4.5:1.</li>
        <li>Form fields have programmatically associated labels and inline error messages with <code>aria-describedby</code>.</li>
        <li>Respects the user&apos;s <code>prefers-reduced-motion</code> and <code>prefers-color-scheme</code> system preferences.</li>
        <li>Responsive layouts down to 320px width.</li>
        <li>Screen-reader smoke-tested with NVDA + Firefox, JAWS + Chrome, and VoiceOver + Safari.</li>
      </ul>

      <h2>Known limitations</h2>
      <ul>
        <li>Recharts-based timeline chart on intake step 2 announces values via tooltip on hover only; a tabular alternative is on the roadmap.</li>
        <li>Some embedded third-party content (e.g. customer scheduling iframes) follows the third party&apos;s accessibility posture rather than ours.</li>
      </ul>

      <h2>Compatibility</h2>
      <p>
        {PRODUCT_NAME} supports the latest stable releases of Chrome, Edge, Firefox, and Safari on
        macOS, Windows, iOS, and Android, with assistive technology including NVDA, JAWS,
        VoiceOver, TalkBack, and Dragon. Older browsers may degrade visually but should remain
        operable.
      </p>

      <h2>Feedback and contact</h2>
      <p>
        We treat accessibility feedback as a P1 issue. If you encounter a barrier, or need
        information in an alternative format, please email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}?subject=Accessibility%20feedback`}>{SUPPORT_EMAIL}</a> with
        a description, the URL where it occurred, and the assistive technology you were using. We
        aim to acknowledge within one business day and to remediate or provide a workaround
        promptly.
      </p>

      <h2>Formal complaints</h2>
      <p>
        If our response is not satisfactory, U.S. residents may contact the U.S. Department of
        Justice Civil Rights Division (<a href="https://civilrights.justice.gov/" rel="noopener">
        civilrights.justice.gov</a>). EU/UK residents may contact their national accessibility
        regulator (e.g. EHRC in the UK).
      </p>
    </MarketingLegalShell>
  );
}

export default function AccessibilityPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-slate-50" aria-label="Loading" />}>
      <AccessibilityContent />
    </Suspense>
  );
}
