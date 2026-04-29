"use client";

/**
 * Buyer settings at `/c/[companyHandle]/settings`.
 *
 * Single form, six fields, one save button — the path the dashboard's
 * "Finish setup" checklist points to. Auth flows through the same
 * `/api/auth/verify-magic-link` endpoint as the dashboard, then writes
 * via `/api/tenant/settings`.
 *
 * Pass-6 — replaces the previous lack of a self-serve settings UI.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { SUPPORT_EMAIL } from "@/lib/product-identity";

type SettingsState = {
  displayName: string;
  brandColor: string;
  logoUrl: string;
  bookingUrl: string;
  notificationEmail: string;
  crmWebhookUrl: string;
};

export default function SettingsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const companyHandle = params?.companyHandle as string;
  const token = searchParams?.get("token") ?? "";
  const sessionId = searchParams?.get("session_id") ?? "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [state, setState] = useState<SettingsState>({
    displayName: "",
    brandColor: "",
    logoUrl: "",
    bookingUrl: "",
    notificationEmail: "",
    crmWebhookUrl: "",
  });

  const dashboardHref = useMemo(() => {
    const q = new URLSearchParams();
    if (token) q.set("token", token);
    if (sessionId) q.set("session_id", sessionId);
    const qs = q.toString();
    return `/c/${companyHandle}${qs ? `?${qs}` : ""}`;
  }, [companyHandle, token, sessionId]);

  const fetchSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!token && !sessionId) {
      setError("Sign-in required. Open the magic link in your welcome email.");
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
      const json = (await res.json()) as
        | {
            ok: true;
            displayName: string;
            brandColor: string | null;
            logoUrl: string | null;
            bookingUrl: string | null;
            notificationEmail: string | null;
            crmWebhookUrl: string | null;
          }
        | { ok: false; error: string };
      if (!("ok" in json) || json.ok !== true) {
        throw new Error(("error" in json && json.error) || "Verification failed");
      }
      setState({
        displayName: json.displayName ?? companyHandle,
        brandColor: json.brandColor ?? "",
        logoUrl: json.logoUrl ?? "",
        bookingUrl: json.bookingUrl ?? "",
        notificationEmail: json.notificationEmail ?? "",
        crmWebhookUrl: json.crmWebhookUrl ?? "",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load settings.");
    } finally {
      setLoading(false);
    }
  }, [token, sessionId, companyHandle]);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  const onChange = useCallback(
    (key: keyof SettingsState) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((prev) => ({ ...prev, [key]: e.target.value })),
    [],
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setMessage(null);
      setError(null);
      try {
        const payload: Record<string, string | undefined> = {
          companyHandle,
          token: token || undefined,
          sessionId: sessionId || undefined,
        };
        for (const k of Object.keys(state) as (keyof SettingsState)[]) {
          payload[k] = state[k];
        }
        const res = await fetch("/api/tenant/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as { ok: boolean; message?: string; error?: string };
        if (!res.ok || !json.ok) {
          throw new Error(json.error || `Save failed (${res.status})`);
        }
        setMessage(json.message || "Settings saved.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save.");
      } finally {
        setSaving(false);
      }
    },
    [companyHandle, token, sessionId, state],
  );

  const brandColor = state.brandColor || "#0f172a";

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-2xl px-4">
        <Link
          href={dashboardHref}
          className="mb-4 inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to dashboard
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Configure your branded funnel. Patients see the values below in real time —
            no redeploy.
          </p>

          {loading ? (
            <div className="mt-8 text-center text-sm text-slate-500">Loading…</div>
          ) : error && !state.displayName ? (
            <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              {error}
              <div className="mt-2 text-xs">
                <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
                  {SUPPORT_EMAIL}
                </a>{" "}
                can resend your welcome email.
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-5" data-tenant-settings-form>
              <Field
                label="Display name"
                hint="What patients see in headers, emails, and quotes."
                value={state.displayName}
                onChange={onChange("displayName")}
                placeholder="Sunspire Weight Clinic"
              />
              <Field
                label="Brand color (hex)"
                hint="#RRGGBB. Used for buttons, accents, and chart line."
                value={state.brandColor}
                onChange={onChange("brandColor")}
                placeholder="#146EF5"
                inputType="text"
              >
                <span
                  className="ml-2 inline-block h-7 w-7 shrink-0 rounded-md border border-slate-200"
                  style={{ backgroundColor: brandColor }}
                  aria-hidden
                />
              </Field>
              <Field
                label="Logo URL"
                hint="https://… link to your logo. Renders top-left of the funnel."
                value={state.logoUrl}
                onChange={onChange("logoUrl")}
                placeholder="https://yourclinic.com/logo.png"
              />
              <Field
                label="Scheduling link"
                hint="Calendly, Acuity, HubSpot Meetings, Cal.com. Patients open this when they pick 'Book consult'."
                value={state.bookingUrl}
                onChange={onChange("bookingUrl")}
                placeholder="https://calendly.com/your-clinic/consult"
              />
              <Field
                label="Lead-notification email"
                hint="Where we email you the moment a new lead submits."
                value={state.notificationEmail}
                onChange={onChange("notificationEmail")}
                placeholder="leads@yourclinic.com"
                inputType="email"
              />
              <Field
                label="CRM webhook URL (optional)"
                hint="Zapier / Make / n8n / HubSpot. Each new lead is POSTed here as JSON."
                value={state.crmWebhookUrl}
                onChange={onChange("crmWebhookUrl")}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
              />

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  {error}
                </div>
              ) : null}
              {message ? (
                <div
                  className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
                  data-tenant-settings-toast
                >
                  {message}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-70"
                  style={{ backgroundColor: brandColor }}
                  data-tenant-settings-save
                >
                  {saving ? "Saving…" : "Save settings"}
                </button>
                <Link
                  href={dashboardHref}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Done
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  inputType = "text",
  children,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  inputType?: "text" | "email" | "url";
  children?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
      <div className="mt-2 flex items-center">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-full min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          autoComplete="off"
          spellCheck={false}
        />
        {children}
      </div>
    </label>
  );
}
