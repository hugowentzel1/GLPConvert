"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { useCountdown } from "@/src/demo/useCountdown";
import { usePreviewQuota } from "@/src/demo/usePreviewQuota";
import { isIntakeDemoMode } from "@/lib/glp-intake-demo-mode";
import { PRODUCT_NAME } from "@/lib/product-identity";
import { parseGlpIntakeQueryBranding } from "@/lib/glp-intake-query-branding";

const INTAKE_TAGLINE = "Medical weight-loss intake";

function safeCompanyLabel(raw: string | null): string {
  if (!raw?.trim()) return "Your clinic";
  try {
    return decodeURIComponent(raw.trim());
  } catch {
    return raw.trim();
  }
}

function useIntakeDemoHover(reduceMotion: boolean) {
  if (reduceMotion) return {};
  return {
    whileHover: { y: -2, scale: 1.02 },
    whileTap: { scale: 0.99 },
    transition: { type: "spring" as const, stiffness: 420, damping: 28 },
  };
}

export default function IntakeDemoSiteHeader() {
  const sp = useSearchParams();
  const reduceMotion = useReducedMotion();
  const b = useBrandTakeover();
  const countdown = useCountdown(b.expireDays || 7);
  const { read } = usePreviewQuota(2);
  const remaining = read();
  const demo = isIntakeDemoMode(sp);
  const companyLabel = safeCompanyLabel(sp?.get("company") ?? null);
  const { primaryHex } = useMemo(() => parseGlpIntakeQueryBranding(sp), [sp]);
  const accent = primaryHex || "#0f172a";
  const hover = useIntakeDemoHover(reduceMotion);

  const homeHref = useMemo(() => {
    const q = new URLSearchParams();
    if (sp?.get("company")) q.set("company", sp.get("company")!);
    if (sp?.get("demo")) q.set("demo", sp.get("demo")!);
    if (sp?.get("brand")) q.set("brand", sp.get("brand")!);
    if (sp?.get("logo")) q.set("logo", sp.get("logo")!);
    const s = q.toString();
    return s ? `/?${s}` : "/";
  }, [sp]);

  const pricingHref = `/pricing?company=${encodeURIComponent(companyLabel)}`;

  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md"
      data-intake-site-header
    >
      {demo && b.enabled ? (
        <div className="border-b border-slate-100 bg-slate-50/90">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2 sm:justify-between">
            <span
              className="inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs font-semibold text-slate-700"
              style={{
                borderColor: `${accent}33`,
                backgroundColor: `${accent}0f`,
              }}
            >
              <span className="truncate">
                Exclusive preview for {b.brand} — expires in {countdown.days}d {countdown.hours.toString().padStart(2, "0")}:
                {countdown.minutes.toString().padStart(2, "0")}:{countdown.seconds.toString().padStart(2, "0")}
              </span>
            </span>
            <span className="text-xs font-medium tabular-nums text-slate-500">
              {remaining} {remaining === 1 ? "run" : "runs"} left
            </span>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href={homeHref}
          className="flex min-w-0 items-center gap-3 rounded-lg outline-none ring-offset-2 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-slate-900/20"
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: accent }}
            aria-hidden
          >
            GP
          </div>
          <div className="min-w-0 text-left">
            <p className="truncate text-lg font-bold tracking-tight text-slate-900">{PRODUCT_NAME}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{INTAKE_TAGLINE}</p>
          </div>
        </Link>

        {demo ? (
          <motion.a
            href={pricingHref}
            className="intake-nav-activate relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-lg"
            style={{ backgroundColor: accent }}
            data-intake-nav-activate
            aria-label={`Activate GLPConvert for ${companyLabel}`}
            {...hover}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-base" aria-hidden>
                ⚡
              </span>
              <span className="hidden sm:inline">Activate your intake</span>
              <span className="sm:hidden">Activate</span>
            </span>
          </motion.a>
        ) : null}
      </div>
    </header>
  );
}
