"use client";

/**
 * Buyer dashboard at `/c/[companyHandle]`.
 *
 * Pass-6 rewrite. The previous version had three correctness bugs:
 *
 *   1. Magic-link auth: client tried to `atob()` decode a token that
 *      `lib/email-service.ts` was signing as a JWT — every onboarding
 *      email led to "Invalid or expired link". We now POST the token
 *      to `/api/auth/verify-magic-link`, which verifies the JWT
 *      server-side and returns the tenant-scoped session payload.
 *
 *   2. Tenant data was hard-coded — none of it came from Supabase. We
 *      now render real branded URL, real embed snippet, real settings
 *      links, and stash the API key in `sessionStorage` so the
 *      `/c/[handle]/leads` page works without manual setup.
 *
 *   3. Visitors without a token were silently treated as authenticated.
 *      We now require `?token=` (magic link) OR `?session_id=` (post-
 *      checkout success URL) and exchange either for a real session.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { SUPPORT_EMAIL } from "@/lib/product-identity";

type DashboardSession = {
  ok: true;
  handle: string;
  displayName: string;
  apiKey: string | null;
  brandColor: string | null;
  logoUrl: string | null;
  bookingUrl: string | null;
  notificationEmail: string | null;
  crmWebhookUrl: string | null;
  plan: string | null;
  paymentStatus: string | null;
  tokenEmail: string | null;
};

export default function CompanyDashboard() {
  const params = useParams();
  const searchParams = useSearchParams();
  const companyHandle = params?.companyHandle as string;
  const token = searchParams?.get("token") ?? "";
  const sessionId = searchParams?.get("session_id") ?? "";

  const [session, setSession] = useState<DashboardSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    [],
  );
  const intakeUrl = useMemo(
    () =>
      baseUrl
        ? `${baseUrl}/intake?handle=${encodeURIComponent(companyHandle)}&company=${encodeURIComponent(
            session?.displayName || companyHandle,
          )}`
        : "",
    [baseUrl, companyHandle, session?.displayName],
  );
  const embedCode = useMemo(
    () =>
      `<iframe
  title="Book a consult with ${session?.displayName || companyHandle}"
  src="${intakeUrl}"
  style="width:100%;min-height:880px;border:0"
  loading="lazy"
  allow="clipboard-write">
</iframe>`,
    [intakeUrl, session?.displayName, companyHandle],
  );

  const exchangeToken = useCallback(async () => {
    setLoading(true);
    setError(null);

    /** Cached client-side session (so refresh doesn't kill the dashboard). */
    if (!token && !sessionId) {
      try {
        const cached = sessionStorage.getItem(`session:${companyHandle}`);
        if (cached) {
          const parsed = JSON.parse(cached) as DashboardSession;
          if (parsed?.handle === companyHandle) {
            setSession(parsed);
            setLoading(false);
            return;
          }
        }
      } catch {
        // ignore parse errors
      }
      setError("Sign-in required. Open the magic link from your welcome email.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token || undefined,
          sessionId: sessionId || undefined,
          companyHandle,
        }),
      });
      const json = (await res.json()) as DashboardSession | { ok: false; error: string };
      if (!("ok" in json) || json.ok !== true) {
        throw new Error(("error" in json && json.error) || "Verification failed");
      }
      setSession(json);
      try {
        sessionStorage.setItem(`session:${companyHandle}`, JSON.stringify(json));
        if (json.apiKey) sessionStorage.setItem(`apikey:${companyHandle}`, json.apiKey);
        sessionStorage.setItem(`auth:${companyHandle}`, "true");
      } catch {
        // sessionStorage might be unavailable in some embed contexts — degrade gracefully
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not verify your link.");
    } finally {
      setLoading(false);
    }
  }, [token, sessionId, companyHandle]);

  useEffect(() => {
    void exchangeToken();
  }, [exchangeToken]);

  const copy = useCallback((text: string, key: string) => {
    void navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-slate-900" />
          <p className="text-sm text-slate-600">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-slate-900">Sign-in required</h1>
          <p className="mt-3 text-sm text-slate-600">
            {error ?? "Open the secure link in your welcome email to access this dashboard."}
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Lost the email?{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-slate-800 underline">
              {SUPPORT_EMAIL}
            </a>{" "}
            can resend it.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const brandColor = session.brandColor || "#0f172a";
  const settingsHref = `/c/${companyHandle}/settings${
    token ? `?token=${encodeURIComponent(token)}` : sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : ""
  }`;
  const leadsHref = `/c/${companyHandle}/leads${
    token ? `?token=${encodeURIComponent(token)}` : ""
  }`;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {session.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={session.logoUrl}
                  alt={session.displayName}
                  className="h-9 w-9 rounded-lg border border-slate-200 object-contain"
                />
              ) : (
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: brandColor }}
                >
                  {session.displayName.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {session.displayName}
                </h1>
                <p className="mt-0.5 text-sm text-slate-600">
                  {session.plan ? `${session.plan} · ` : ""}
                  Branded GLPConvert funnel
                </p>
              </div>
            </div>
            <span
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
              data-dashboard-status
            >
              {session.paymentStatus === "Paid" ? "Active" : session.paymentStatus || "Pending"}
            </span>
          </div>

          {/* Setup checklist — drives the buyer to a green state */}
          <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50/60 p-5">
            <h2 className="text-sm font-semibold text-slate-900">Finish setup</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <ChecklistRow done={!!session.logoUrl} label="Add your logo URL" />
              <ChecklistRow done={!!session.brandColor} label="Set your brand color" />
              <ChecklistRow
                done={!!session.bookingUrl}
                label="Connect your scheduling link (Calendly / Acuity / etc.)"
              />
              <ChecklistRow
                done={!!session.notificationEmail}
                label="Pick where to receive lead notifications"
              />
              <ChecklistRow
                done={!!session.crmWebhookUrl}
                label="(Optional) Wire your CRM webhook"
              />
            </ul>
            <Link
              href={settingsHref}
              className="mt-4 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
              style={{ backgroundColor: brandColor }}
              data-dashboard-settings-cta
            >
              Open settings →
            </Link>
          </div>

          {/* Patient intake URL */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Your branded patient URL</h2>
            <p className="mt-1 text-xs text-slate-600">
              Send patients here from cold email, ads, your existing site, or your CRM workflows.
              Branding (logo, color, scheduling link) renders automatically.
            </p>
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <code className="break-all text-xs text-slate-800" data-dashboard-intake-url>
                {intakeUrl}
              </code>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => copy(intakeUrl, "url")}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {copied === "url" ? "Copied" : "Copy URL"}
              </button>
              <a
                href={intakeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Preview funnel
              </a>
              <Link
                href={leadsHref}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                View leads
              </Link>
            </div>
          </div>

          {/* Embed snippet */}
          <details className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3" data-dashboard-embed>
            <summary className="cursor-pointer text-sm font-semibold text-slate-800">
              Embed on your existing site
            </summary>
            <p className="mt-2 text-xs text-slate-600">
              Paste into an HTML block or page builder. The funnel auto-resizes inside the iframe
              (postMessage protocol shipped Pass 6); set <code>min-height</code> as a fallback.
              For best conversion, point a subdomain like{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5">book.{companyHandle}.com</code>{" "}
              at us — see the <Link href="/docs/embed" className="underline">embed guide</Link>.
            </p>
            <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-relaxed text-emerald-300">
{embedCode}
            </pre>
            <button
              type="button"
              onClick={() => copy(embedCode, "embed")}
              className="mt-2 text-xs font-semibold text-slate-700 underline"
            >
              {copied === "embed" ? "Copied" : "Copy embed snippet"}
            </button>
          </details>

          {/* Lead-delivery summary */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">How leads reach you</h2>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
              <li>
                <span className="font-medium text-slate-800">Dashboard:</span>{" "}
                <Link href={leadsHref} className="underline">
                  /c/{companyHandle}/leads
                </Link>{" "}
                — every submission, immediately.
              </li>
              <li>
                <span className="font-medium text-slate-800">Email notification:</span>{" "}
                {session.notificationEmail ? (
                  <span>
                    sent to <code>{session.notificationEmail}</code>.
                  </span>
                ) : (
                  <span className="text-amber-700">
                    not configured — set in{" "}
                    <Link href={settingsHref} className="underline">
                      settings
                    </Link>
                    .
                  </span>
                )}
              </li>
              <li>
                <span className="font-medium text-slate-800">CRM webhook:</span>{" "}
                {session.crmWebhookUrl ? (
                  <span>POSTed to your URL on every new lead.</span>
                ) : (
                  <span className="text-slate-500">
                    not configured — optional Zapier/Make/n8n endpoint.
                  </span>
                )}
              </li>
            </ul>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-4 border-t border-slate-100 pt-6 text-sm">
            <Link href="/docs/embed" className="font-medium text-slate-700 hover:text-slate-900">
              Embed guide
            </Link>
            <Link href="/support" className="font-medium text-slate-700 hover:text-slate-900">
              Support
            </Link>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-medium text-slate-700 hover:text-slate-900"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistRow({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
          done
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-200 text-slate-500"
        }`}
        aria-hidden
      >
        {done ? "✓" : "·"}
      </span>
      <span className={done ? "text-slate-700 line-through" : "text-slate-800"}>{label}</span>
    </li>
  );
}
