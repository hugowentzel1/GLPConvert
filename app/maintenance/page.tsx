import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

/**
 * Internal-facing maintenance runbook + monitoring dashboard. Not
 * linked from the public marketing site. Only the founder + ops opens
 * this page — it consolidates every monitoring URL, crash-response
 * checklist, and "common-issue → fix" reference into one place.
 *
 * Design intent: treat the reader as a non-programmer. Every step is
 * a literal click instruction. Every URL opens in a new tab. Every
 * "if you see X, do Y" is spelled out.
 *
 * Pattern source: Stripe internal runbooks 2024 / Linear internal
 * ops doc / Vercel SRE runbooks — single page consolidating dashboards
 * + checklists; updated whenever a new monitoring tool is added.
 */

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `Maintenance — ${PRODUCT_NAME}`,
  description:
    "Internal maintenance runbook: status checks, monitoring dashboards, crash response.",
  robots: { index: false, follow: false },
};

const monitoringSections: Array<{
  title: string;
  description: string;
  links: Array<{ label: string; href: string; what: string }>;
}> = [
  {
    title: "1. Live status (open these first every morning)",
    description:
      "Two URLs — if both green you can move on. If either is not 200/green, jump straight to the relevant dashboard below.",
    links: [
      {
        label: "/healthz",
        href: "/healthz",
        what: "Returns 200 OK if the app is up. If you see anything else, the app is DOWN. Open Vercel dashboard immediately.",
      },
      {
        label: "/status",
        href: "/status",
        what: "Shows live health of Stripe, Supabase, Resend, Sentry. If any tile is red, the section below tells you which dashboard to open.",
      },
    ],
  },
  {
    title: "2. Vercel — hosting + deployment",
    description:
      "If /healthz is not 200 OR the site is showing 5xx errors, open Vercel first.",
    links: [
      {
        label: "Vercel Dashboard",
        href: "https://vercel.com/hugowentzels-projects/glp-convert",
        what: "Click the project. Top tab Deployments shows the last 20 deploys. Latest one with green check = current production.",
      },
      {
        label: "Vercel Logs (live)",
        href: "https://vercel.com/hugowentzels-projects/glp-convert/logs",
        what: "Shows real-time runtime errors. Filter by 'Error' to find 5xx. Each error has a request ID — paste it into Sentry to find the stack trace.",
      },
      {
        label: "Vercel Analytics",
        href: "https://vercel.com/hugowentzels-projects/glp-convert/analytics",
        what: "Page views + Web Vitals + traffic graphs. Spot traffic dips or country anomalies here.",
      },
    ],
  },
  {
    title: "3. Sentry — error tracking + stack traces",
    description:
      "If Vercel logs show errors but you can't tell what broke, open Sentry. Every uncaught client/server error is captured with full stack trace + browser/device + UTM.",
    links: [
      {
        label: "Sentry Issues",
        href: "https://sentry.io",
        what: "Sign in → glpconvert project → Issues tab. Sort by 'Last seen'. Top of list = most recent crash. Click into an issue for stack trace + breadcrumbs + user info.",
      },
      {
        label: "Sentry Performance",
        href: "https://sentry.io/organizations/glpconvert/performance/",
        what: "If users report slowness: Performance tab → Web Vitals → identify slowest pages.",
      },
    ],
  },
  {
    title: "4. Stripe — payments + checkout",
    description:
      "If a customer reports a failed payment OR /status shows Stripe red, open Stripe Dashboard.",
    links: [
      {
        label: "Stripe Dashboard",
        href: "https://dashboard.stripe.com",
        what: "Home shows today's payments, failed payments, MRR. Click Payments → All payments to see every transaction.",
      },
      {
        label: "Stripe Webhook Logs",
        href: "https://dashboard.stripe.com/webhooks",
        what: "Click your webhook → Recent deliveries. Anything red = our webhook endpoint failed. Open the failed event → Try again button.",
      },
      {
        label: "Stripe Disputes / Chargebacks",
        href: "https://dashboard.stripe.com/disputes",
        what: "If you see a dispute alert email, this is where to respond within 7 days.",
      },
    ],
  },
  {
    title: "5. Supabase — database",
    description:
      "If /status shows Supabase red OR leads are not appearing in the dashboard, open Supabase.",
    links: [
      {
        label: "Supabase Dashboard",
        href: "https://supabase.com/dashboard",
        what: "Sign in → glpconvert project. Top of project page shows DB status (green/yellow/red).",
      },
      {
        label: "Supabase Table Editor",
        href: "https://supabase.com/dashboard",
        what: "Project → Table Editor → leads. Each row is one intake submission. If today's count is 0 but you expect leads, there's a routing issue — check Vercel logs for /api/lead errors.",
      },
      {
        label: "Supabase Logs",
        href: "https://supabase.com/dashboard",
        what: "Project → Logs → Postgres logs. Connection drops, slow queries, RLS errors all show up here.",
      },
      {
        label: "Supabase Backups",
        href: "https://supabase.com/dashboard",
        what: "Project → Database → Backups. Daily automatic backups for 7 days on Pro plan. Click to restore.",
      },
    ],
  },
  {
    title: "6. Resend — transactional email",
    description:
      "If /status shows Resend red OR a buyer reports they didn't get a confirmation email, open Resend.",
    links: [
      {
        label: "Resend Dashboard",
        href: "https://resend.com",
        what: "Sign in → glpconvert. Emails tab shows every email sent. Filter by recipient if a customer reports missing email.",
      },
      {
        label: "Resend Domains",
        href: "https://resend.com/domains",
        what: "If domain shows yellow/red, DNS verification failed. Open Namecheap Advanced DNS for that domain and re-check the records Resend asked for.",
      },
      {
        label: "Resend Logs",
        href: "https://resend.com/logs",
        what: "Real-time delivery log. Bounces, complaints, deliveries.",
      },
    ],
  },
  {
    title: "7. Google Postmaster — cold-email reputation",
    description:
      "If reply rates drop or Instantly shows accounts paused, sender reputation degraded.",
    links: [
      {
        label: "Google Postmaster",
        href: "https://postmaster.google.com",
        what: "Sign in. Each of your 4 sending domains shows: spam-rate, IP reputation, domain reputation, delivery errors. Spam-rate must stay <0.10%. Above that = pause sending.",
      },
    ],
  },
  {
    title: "8. Cold-email + LinkedIn ops",
    description:
      "Daily reply triage + outreach health.",
    links: [
      {
        label: "Instantly",
        href: "https://app.instantly.ai/",
        what: "Unibox tab → triage replies daily. Each reply gets tagged positive/neutral/unsubscribe/OOO/wrong-person.",
      },
      {
        label: "Heyreach",
        href: "https://app.heyreach.io/",
        what: "Inbox tab → triage LinkedIn replies. Same tagging.",
      },
      {
        label: "Clay",
        href: "https://www.clay.com/",
        what: "Lead enrichment + lookalike sourcing. Refresh prospect list monthly.",
      },
      {
        label: "Airtable (lead CRM)",
        href: "https://airtable.com",
        what: "Centralized lead database. Tag intent + log outcomes.",
      },
    ],
  },
];

const crashResponseSteps: Array<{
  title: string;
  steps: string[];
}> = [
  {
    title: "If the entire site is down (404 / 5xx everywhere)",
    steps: [
      "1. Open Vercel Dashboard → Deployments. Is the latest deploy red?",
      "2. If red: click the deploy → 'Logs' button → read the build error. Usually a typo or missing env var.",
      "3. While debugging: click the previous green deploy → 'Promote to Production' (3-dot menu). Site is back up while you fix.",
      "4. Push the fix to the main branch. New deploy starts automatically.",
      "5. Verify by visiting /healthz — should return 200 OK.",
    ],
  },
  {
    title: "If checkout (Stripe) is failing",
    steps: [
      "1. Open Stripe Dashboard → Webhooks. Click your endpoint → Recent deliveries. Any red?",
      "2. If red: click the failed event → 'Send test webhook' to verify endpoint reachable. If still red, check Vercel logs for /api/stripe/webhook errors.",
      "3. Common cause: env var STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET out of sync between Stripe and Vercel. Re-copy from Stripe → paste into Vercel → redeploy.",
      "4. Verify by running a $0.50 test checkout from /pricing while in test mode.",
    ],
  },
  {
    title: "If leads are not appearing in dashboard / Supabase",
    steps: [
      "1. Open the live intake page → fill out → submit.",
      "2. Open Vercel Logs → filter on /api/lead. If you see a 500, the API route is broken.",
      "3. If 200 but no row appears in Supabase: check Supabase logs for RLS or insert errors.",
      "4. If RLS error: open Supabase → SQL Editor → paste 'select * from leads order by created_at desc limit 5' to verify table is reachable.",
      "5. Most common fix: env var SUPABASE_SERVICE_ROLE_KEY missing or rotated. Re-copy from Supabase Settings → API → paste into Vercel → redeploy.",
    ],
  },
  {
    title: "If cold-email reply rate drops / accounts paused",
    steps: [
      "1. Open Google Postmaster → check spam rate per domain. If above 0.10%, pause sending immediately.",
      "2. Open Instantly Unibox → review last 50 replies for unsubscribe / spam complaints. High complaint volume = wrong list, not wrong copy.",
      "3. Reduce daily volume per inbox by 50% for 1 week. Monitor spam rate daily.",
      "4. Run a fresh ZeroBounce on the next prospect batch before resuming full volume.",
      "5. If a single domain is still flagged after 2 weeks at half volume: retire it, buy a replacement on Namecheap, redo SPF/DKIM/DMARC, warm up 21 days.",
    ],
  },
  {
    title: "If a customer reports no confirmation email after activation",
    steps: [
      "1. Open Resend → Emails tab → search by their email address.",
      "2. If status = Delivered: tell them to check spam. Add Resend's deliverability link to your reply.",
      "3. If status = Bounced: their address is invalid or full. Reply via support directly.",
      "4. If no record exists: the post-checkout email function failed. Open Vercel logs → search for stripe/webhook → check for errors during the past 24h.",
      "5. Manually send the activation instructions from your support@ inbox while debugging.",
    ],
  },
  {
    title: "If you see a Sentry alert email",
    steps: [
      "1. Click the link in the alert → opens the issue in Sentry.",
      "2. Read 'How often this happens'. Once = ignore for now (transient). Repeating = real bug.",
      "3. Stack trace at top shows the file + line. Open that file in your editor.",
      "4. Breadcrumbs at bottom show what the user did right before the crash.",
      "5. If you can fix it: push the fix. Mark the Sentry issue 'Resolved'.",
      "6. If you can't fix it: 'Ignore for 24h' so you stop getting alerts while you investigate.",
    ],
  },
];

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 border-b border-slate-200 pb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Internal · ops runbook
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {PRODUCT_NAME} Maintenance
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 sm:text-base">
            Single page that consolidates every monitoring URL, status check, and
            crash-response runbook for {PRODUCT_NAME}. Open this every morning before
            your daily ops review. If anything is unclear, email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-900 underline decoration-slate-300">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/healthz"
              className="inline-flex min-h-[44px] items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
            >
              /healthz
            </Link>
            <Link
              href="/status"
              className="inline-flex min-h-[44px] items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
            >
              /status
            </Link>
          </div>
        </header>

        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900">
            Monitoring dashboards
          </h2>
          <p className="mb-8 text-[15px] leading-[1.7] text-slate-600 sm:text-base">
            Listed in priority order. Open the top one first; only descend if you need
            more detail. Every link opens in a new tab.
          </p>
          <div className="space-y-12">
            {monitoringSections.map((sec) => (
              <div key={sec.title}>
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  {sec.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-slate-600 sm:text-[15px]">
                  {sec.description}
                </p>
                <ul className="mt-5 space-y-4">
                  {sec.links.map((l) => (
                    <li
                      key={`${sec.title}-${l.label}`}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                    >
                      <a
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-700"
                      >
                        {l.label}
                      </a>
                      <p className="mt-2 text-[13px] leading-[1.7] text-slate-600 sm:text-[14px]">
                        {l.what}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900">
            Crash response runbook
          </h2>
          <p className="mb-8 text-[15px] leading-[1.7] text-slate-600 sm:text-base">
            Step-by-step instructions for the six most common production incidents.
            Every step is a literal click. If it&apos;s not in here, email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-900 underline decoration-slate-300">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <div className="space-y-10">
            {crashResponseSteps.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
              >
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  {c.title}
                </h3>
                <ol className="mt-5 space-y-3">
                  {c.steps.map((s, i) => (
                    <li
                      key={`${c.title}-${i}`}
                      className="text-[14px] leading-[1.7] text-slate-700 sm:text-[15px]"
                    >
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900">
            Daily / weekly / monthly cadence
          </h2>
          <p className="mb-6 text-[15px] leading-[1.7] text-slate-600 sm:text-base">
            See <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">MASTER_TODO_GLPCONVERT.md</code> →
            section <strong>🩺 MAINTENANCE</strong> for the full check-by-check list.
            Summary:
          </p>
          <ul className="space-y-3 text-[14px] leading-[1.7] text-slate-700 sm:text-[15px]">
            <li>
              <strong>Daily (10 min, every morning):</strong> Reply triage on
              Instantly + Heyreach, hand-reply positive intent within 4 business
              hours, confirm /healthz returns 200 + /status all green.
            </li>
            <li>
              <strong>Weekly (30 min, every Monday):</strong> Google Postmaster
              spam-rate check on each of 4 domains, bounce + acceptance rate review,
              Stripe failed-payments review, Vercel error-rate review, Sentry
              unresolved-issues review.
            </li>
            <li>
              <strong>Monthly (1 hr, first Monday):</strong> Retire low-performing
              inboxes, rebalance domain volume, refresh Sales Nav prospect list,
              ZeroBounce next batch, Supabase backup verification, Resend volume
              review, Stripe MRR + churn review.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900">
            Escalation
          </h2>
          <p className="text-[15px] leading-[1.7] text-slate-600 sm:text-base">
            For anything that this page doesn&apos;t cover, or any incident affecting
            multiple paying customers, email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-900 underline decoration-slate-300">
              {SUPPORT_EMAIL}
            </a>{" "}
            with the subject line <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">P0 INCIDENT</code> and
            include: (1) what broke, (2) when you noticed, (3) which dashboard you
            checked, (4) what error you saw.
          </p>
        </section>
      </div>
    </main>
  );
}
