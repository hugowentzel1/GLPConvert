"use client";

import { Suspense, useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";

const DEFAULT_DEMO_ACCENT = "#0f172a";

function isIntakeDemoMode(sp: URLSearchParams | null): boolean {
  if (!sp) return false;
  return (
    sp.get("demo") === "1" || sp.get("preview") === "1" || sp.get("mode") === "demo"
  );
}

function safeCompanyLabel(raw: string | null): string {
  if (!raw?.trim()) return "Your clinic";
  try {
    return decodeURIComponent(raw.trim());
  } catch {
    return raw.trim();
  }
}

function clinicMonogramLetters(name: string): string {
  const clean = name.replace(/\s+/g, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0] ?? "";
    const b = parts[1][0] ?? "";
    return (a + b).toUpperCase() || "?";
  }
  const slice = clean.slice(0, 2).toUpperCase();
  return slice || "?";
}

function BrandMark({
  logoUrl,
  companyLabel,
  accent,
  size = "md",
}: {
  logoUrl: string | null;
  companyLabel: string;
  accent: string;
  size?: "sm" | "md" | "lg";
}) {
  const h = size === "sm" ? "h-10 w-10" : size === "md" ? "h-12 w-12" : "h-14 w-14";
  const imgMax =
    size === "lg"
      ? "h-14 max-h-14 w-auto max-w-[200px] object-contain sm:h-16 sm:max-h-16 md:max-w-[240px]"
      : size === "sm"
        ? "h-9 max-h-9 w-auto max-w-[120px] shrink-0 object-contain sm:max-w-[140px]"
        : "h-11 max-h-11 w-auto max-w-[130px] shrink-0 object-contain sm:max-w-[150px]";
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoUrl} alt="" className={imgMax} loading="eager" />
    );
  }
  return (
    <div
      className={`flex ${h} shrink-0 items-center justify-center rounded-xl text-sm font-bold tracking-tight text-white shadow-sm ring-2 ring-white/90`}
      style={{ backgroundColor: accent }}
      aria-hidden
    >
      {size === "lg" ? (
        <span className="text-base font-bold">{clinicMonogramLetters(companyLabel)}</span>
      ) : (
        clinicMonogramLetters(companyLabel)
      )}
    </div>
  );
}

function DemoStripActions({ companyLabel, accent }: { companyLabel: string; accent: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 lg:max-w-none lg:flex-row lg:items-center lg:justify-end lg:gap-3" data-intake-demo-actions>
      <span className="sr-only" aria-live="polite">
        {copied ? "Demo link copied to clipboard" : ""}
      </span>
      <a
        href={`/pricing?company=${encodeURIComponent(companyLabel)}`}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl px-5 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-[1.02] lg:min-w-[min(100%,17rem)] lg:max-w-sm lg:flex-initial"
        style={{ backgroundColor: accent }}
        data-demo-activate-intake
      >
        Activate for {companyLabel}
      </a>
      <div className="flex w-full gap-2 sm:justify-stretch lg:w-auto lg:shrink-0">
        <button
          type="button"
          onClick={() => void onCopy()}
          className="inline-flex min-h-[48px] min-w-0 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 lg:min-w-[9.5rem] lg:flex-initial"
          data-demo-copy-link
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <span
          data-intake-demo-badge
          className="inline-flex min-h-[48px] min-w-[3.75rem] shrink-0 items-center justify-center rounded-xl border px-2 text-[10px] font-bold uppercase tracking-[0.1em]"
          style={{
            borderColor: `${accent}40`,
            color: accent,
            backgroundColor: `${accent}0a`,
          }}
        >
          Demo
        </span>
      </div>
    </div>
  );
}

/** Dev-only: local URL hints for QA */
function LocalIntakeUrlHints() {
  const showDevHints = process.env.NODE_ENV === "development";
  const sp = useSearchParams();
  const [origin, setOrigin] = useState<string | null>(null);
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const urls = useMemo(() => {
    if (!origin || !showDevHints) return null;
    const base = origin.replace(/\/$/, "");
    const company = sp?.get("company")?.trim();
    const handle = sp?.get("handle")?.trim();
    const demoQs = new URLSearchParams();
    demoQs.set("demo", "1");
    if (company) demoQs.set("company", company);
    if (handle) demoQs.set("handle", handle);
    const domain = sp?.get("domain")?.trim();
    const brand = sp?.get("brand")?.trim();
    const logo = sp?.get("logo")?.trim();
    const brand2 = sp?.get("brand2")?.trim();
    const booking = sp?.get("booking")?.trim();
    if (domain) demoQs.set("domain", domain);
    if (brand) demoQs.set("brand", brand);
    if (logo) demoQs.set("logo", logo);
    if (brand2) demoQs.set("brand2", brand2);
    if (booking) demoQs.set("booking", booking);
    const paidQs = new URLSearchParams();
    if (handle) paidQs.set("company", handle);
    else if (company) paidQs.set("company", company);
    else paidQs.set("company", "glpconvert");
    return {
      demo: `${base}/intake?${demoQs.toString()}`,
      paid: `${base}/intake?${paidQs.toString()}`,
    };
  }, [origin, showDevHints, sp]);

  if (!urls) return null;

  const codeClass =
    "mt-1 block w-full break-all rounded-md bg-white px-2 py-2 font-mono text-[10px] leading-snug text-slate-700 shadow-sm ring-1 ring-slate-200/90";

  return (
    <details
      className="mx-auto mt-6 max-w-lg rounded-xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 text-left shadow-inner"
      data-intake-local-urls
    >
      <summary className="cursor-pointer list-none text-[11px] font-semibold text-slate-600 [&::-webkit-details-marker]:hidden">
        Local URLs (dev)
      </summary>
      <div className="mt-3 space-y-3 text-[11px] leading-relaxed text-slate-600">
        <div>
          <p className="font-semibold text-slate-700">Demo</p>
          <code className={codeClass} data-intake-local-url-demo>
            {urls.demo}
          </code>
        </div>
        <div>
          <p className="font-semibold text-slate-700">Paid-style</p>
          <code className={codeClass} data-intake-local-url-paid>
            {urls.paid}
          </code>
        </div>
      </div>
    </details>
  );
}

function IntakePageHeaderInner() {
  const sp = useSearchParams();
  const demo = isIntakeDemoMode(sp);
  const companyLabel = safeCompanyLabel(sp?.get("company") ?? null);
  const { logoUrl, primaryHex, secondaryHex } = useMemo(
    () => parseGlpIntakeQueryBranding(sp),
    [sp],
  );
  const accent = primaryHex || DEFAULT_DEMO_ACCENT;
  const accent2 = secondaryHex || accent;

  return (
    <div className="w-full space-y-6">
      {demo ? (
        <div
          data-intake-demo-strip
          data-intake-clinic-bar="demo"
          className="rounded-2xl border border-slate-200/90 bg-white px-4 py-5 shadow-sm ring-1 ring-slate-900/[0.04] sm:px-6 sm:py-5"
          style={{ borderColor: `${accent}28` }}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <BrandMark logoUrl={logoUrl} companyLabel={companyLabel} accent={accent} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold leading-tight tracking-tight text-slate-900">{companyLabel}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Private branded preview · ready for your clinic
                </p>
              </div>
            </div>
            <DemoStripActions companyLabel={companyLabel} accent={accent} />
          </div>
        </div>
      ) : null}

      <div
        className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white px-5 py-8 text-center shadow-[0_2px_8px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.04] sm:px-8 sm:py-10"
        style={{
          borderColor: `${accent}22`,
          boxShadow: `0 2px 8px rgba(15,23,42,0.04), 0 0 0 1px ${accent}10`,
        }}
        data-intake-hero
        {...(!demo ? { "data-intake-clinic-bar": "paid" as const } : {})}
      >
        <div
          className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, ${accent} 0%, ${accent2} 50%, ${accent} 100%)`,
          }}
          aria-hidden
        />
        <div className="relative flex justify-center">
          <BrandMark
            logoUrl={logoUrl}
            companyLabel={companyLabel}
            accent={accent}
            size={demo ? "md" : "lg"}
          />
        </div>

        <h1 className="mt-6 text-balance text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          {demo ? "The patient-facing path, under your brand" : "Before you book"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600 md:text-[15px]">
          {demo
            ? "Clarity on timing, typical ranges, and next steps — then your scheduling link. Built to drop into your site or funnel."
            : "See what to expect, typical ranges, and a clear next step — general information only."}
        </p>

        <LocalIntakeUrlHints />
      </div>
    </div>
  );
}

export default function IntakePageHeader() {
  return (
    <Suspense
      fallback={
        <div
          className="mx-auto mb-6 h-32 w-full max-w-2xl rounded-2xl bg-slate-100/90 ring-1 ring-slate-200/80"
          aria-busy
          aria-label="Loading intake header"
        />
      }
    >
      <IntakePageHeaderInner />
    </Suspense>
  );
}
