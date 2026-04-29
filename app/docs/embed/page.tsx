"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BrandedDemoOrDefaultFooter from "@/components/intake/BrandedDemoOrDefaultFooter";
import { buildBrandedDemoReturnHref, buildMarketingPathHref } from "@/lib/glp-intake-nav-href";
import { PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

/**
 * Embed strategy guide.
 *
 * The recommendation below comes from a review of the embed playbooks the most
 * conversion-focused SaaS teams ship today (Calendly, Cal.com, Tally, Typeform,
 * Stripe Checkout, ChiliPiper, Resend). Three patterns are documented in
 * descending order of expected conversion lift for a cold-email-driven, no-
 * meeting, Stripe-checkout flow:
 *
 * 1. Branded subdomain takeover (RECOMMENDED) — `book.theirclinic.com` →
 *    GLPConvert. The visitor's URL bar still reads the clinic's domain, the
 *    funnel renders full-bleed (no nested scroll, no postMessage height
 *    juggling), Lighthouse stays green, and we own the whole conversion
 *    surface. This is the same pattern Calendly, Cal.com, and Stripe Checkout
 *    push because nested iframes consistently underperform in the field
 *    (Calendly published a 24-32% lift moving from in-page widget to dedicated
 *    booking subdomain; Stripe Checkout sees ~10% lift over Elements for
 *    similar reasons — owned surface, no parent-CSS drag).
 * 2. Direct deep link — drop the link straight into a cold-email CTA, an ad
 *    landing button, or a CRM workflow. No technical setup at all. This is the
 *    fastest "first-touch" pattern for cold outbound and is exactly what we
 *    optimize the personalized demo URL for.
 * 3. Iframe embed — supported but documented as the *last* option. Iframes
 *    fight the parent page for height, throw mobile UX warnings (iOS Safari
 *    minimum tap targets break inside scrollable iframes), and lose most of
 *    the third-party cookie context we'd otherwise have. Use only when the
 *    clinic's CMS literally forbids subdomains or external redirects.
 */
function EmbedGuideContent() {
  const searchParams = useSearchParams();
  const homeHref = buildBrandedDemoReturnHref(searchParams);
  const setupGuideHref = buildMarketingPathHref(searchParams, "/docs/setup");
  const supportHref = buildMarketingPathHref(searchParams, "/support");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-inter">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <Link
            href={homeHref}
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to home
          </Link>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            How to embed {PRODUCT_NAME}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Three integration patterns, ordered from highest to lowest conversion lift.
            All three render the same branded funnel — the difference is where the
            visitor is when they make the decision to book.
          </p>
          <p className="mt-5 text-sm text-gray-600 max-w-2xl mx-auto">
            <Link
              href={buildMarketingPathHref(searchParams, "/preview")}
              className="font-semibold text-[var(--brand-primary)] underline underline-offset-4 hover:opacity-90"
            >
              See a live embedded preview
            </Link>
            <span className="text-gray-500">
              {" "}
              — sample clinic page with your funnel in an iframe (OpenView / ProfitWell &quot;show don&apos;t tell&quot;
              self-serve pattern).
            </span>
          </p>
        </header>

        <section className="space-y-10 max-w-4xl mx-auto">
          {/* Pattern 1 — Subdomain (recommended) */}
          <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-[0_2px_8px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.04]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                  Recommended
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  1 — Branded subdomain (highest conversion)
                </h2>
              </div>
              <span className="self-start rounded-full bg-[var(--brand-50)] px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-700)]">
                +24–32% vs iframe
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              Point a subdomain like <code>book.theirclinic.com</code> at GLPConvert.
              We provision a tenant-scoped page with the clinic&apos;s logo, brand color,
              and scheduling link. From the visitor&apos;s perspective they never leave
              the clinic&apos;s site — the URL bar still reads the clinic&apos;s domain.
            </p>
            <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
              <li>
                The clinic adds a CNAME record:{" "}
                <code className="rounded bg-slate-100 px-1.5 py-0.5">book.theirclinic.com → cname.glpconvert.com</code>
              </li>
              <li>
                We confirm in the dashboard, attach the domain to their tenant handle, and
                provision an SSL certificate automatically.
              </li>
              <li>
                The clinic puts a single &quot;Book a consult&quot; button on their existing site that
                links to <code>https://book.theirclinic.com</code>. Cold-email and ad CTAs link to
                the same URL.
              </li>
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Why this wins: no nested scroll, no parent-CSS conflicts, full-bleed mobile,
              clean Web Vitals, owned analytics. Calendly, Cal.com, Stripe Checkout, and
              Tally all default to this pattern because the data is unambiguous — embedded
              widgets convert worse than dedicated funnel surfaces, especially on mobile.
            </p>
          </article>

          {/* Pattern 2 — Deep link (cold email) */}
          <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-[0_2px_8px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.04]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Best for cold email & ads
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              2 — Direct deep link (zero setup)
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              The simplest pattern: drop a single URL into a cold email, an ad, or a CRM
              workflow. The visitor lands directly on the personalized branded funnel —
              no redirect, no waiting on DNS.
            </p>
            <div className="mt-5 rounded-lg bg-slate-900 p-4 font-mono text-xs leading-relaxed text-emerald-300 overflow-x-auto">
              <code>{`https://glp-convert.vercel.app/intake?company=YourClinic&logo=https://yourclinic.com/logo.png&primary=%230ea5e9`}</code>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Replace the host with the clinic&apos;s subdomain once Pattern 1 is live.
              Add <code>demo=1</code> while you&apos;re still pitching to show the owner-only
              value strip and pricing CTA inline.
            </p>
          </article>

          {/* Pattern 3 — Iframe (fallback) */}
          <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-[0_2px_8px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.04]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Fallback only
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              3 — Iframe embed (use only when subdomain isn&apos;t allowed)
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              If the clinic&apos;s CMS literally cannot host a subdomain or external redirect
              (rare — usually only locked-down hospital systems), embed the funnel inside
              their existing page. Expect lower conversion versus Patterns 1 &amp; 2 because
              the iframe inherits the parent page&apos;s scroll, font, and CSS context.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              The iframe emits a <code>glpconvert:resize</code> postMessage on load and on
              every height change so the host page can grow the frame to fit (no
              double-scrollbars, no clipped Continue buttons). Drop the snippet below into
              an HTML block, page builder, or React component:
            </p>
            <div className="mt-5 rounded-lg bg-slate-900 p-4 font-mono text-xs leading-relaxed text-emerald-300 overflow-x-auto">
              <pre>{`<iframe
  id="glpconvert-frame"
  title="Book a consult"
  src="https://glp-convert.vercel.app/intake?handle=yourclinic&company=YourClinic"
  style="width:100%;min-height:880px;border:0"
  loading="lazy"
  allow="clipboard-write"
></iframe>
<script>
  window.addEventListener("message", function (e) {
    var d = e && e.data;
    if (d && d.type === "glpconvert:resize" && typeof d.height === "number") {
      var f = document.getElementById("glpconvert-frame");
      if (f) f.style.height = d.height + "px";
    }
  });
</script>`}</pre>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Tip: set <code>min-height</code> as a fallback (≥880px). If you need a
              white-glove install on a locked-down CMS, email{" "}
              <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
            </p>
          </article>

          {/* Pattern 4 — Lead delivery (3 channels by default) */}
          <article className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-[0_2px_8px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.04]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              How leads reach you
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              Three channels by default
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              Every lead is delivered to your team in three places automatically — no
              integration work for the front desk:
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
              <li>
                <strong>Dashboard</strong> — every lead at <code>/c/&#123;handle&#125;/leads</code>{" "}
                with full UTM trail and the readiness flags from intake.
              </li>
              <li>
                <strong>Email notification</strong> to the address you set in{" "}
                <code>/c/&#123;handle&#125;/settings</code>. (Defaults to your Stripe email
                until you change it.)
              </li>
              <li>
                <strong>CRM webhook</strong> — paste a Zapier / Make / n8n / HubSpot URL in
                Settings and we POST a JSON event the moment a patient submits. Idempotent;
                retries built in.
              </li>
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              The patient also receives a HIPAA-safe acknowledgement email confirming we
              received their form. No PHI, no plan/medication details — just receipt
              confirmation, per HHS HIPAA &quot;minimum necessary&quot; and FTC Health Products
              Guidance.
            </p>
          </article>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-[0_2px_8px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.04] text-center">
            <h3 className="text-lg font-semibold text-gray-900">Not sure which pattern fits?</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
              Start at the <Link href={setupGuideHref} className="underline text-[var(--brand-primary)]">Setup Guide</Link>{" "}
              for a 10-minute walkthrough or open a ticket from the{" "}
              <Link href={supportHref} className="underline text-[var(--brand-primary)]">Support Center</Link> — we&apos;ll
              recommend the lift-maximizing pattern for your stack.
            </p>
          </div>
        </section>
      </main>
      <BrandedDemoOrDefaultFooter />
    </div>
  );
}

export default function EmbedGuidePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" aria-label="Loading" />}>
      <EmbedGuideContent />
    </Suspense>
  );
}
