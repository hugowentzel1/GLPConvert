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
        <div
          className="border-b border-[#e5e7eb]"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div
            className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3.5"
            style={{ gap: 16 }}
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3" style={{ gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  background: `color-mix(in srgb, ${accent} 8%, white)`,
                  borderRadius: 8,
                  border: `1px solid color-mix(in srgb, ${accent} 20%, white)`,
                }}
              >
                <strong
                  className="min-w-0 truncate text-[15px] font-semibold leading-snug tabular-nums"
                  style={{ color: accent }}
                >
                  Exclusive preview for {b.brand} — expires in {countdown.days}d{" "}
                  {countdown.hours.toString().padStart(2, "0")}:{countdown.minutes.toString().padStart(2, "0")}:
                  {countdown.seconds.toString().padStart(2, "0")}
                </strong>
              </div>
              <span className="whitespace-nowrap text-[15px] font-medium text-[#6B7280]">
                {remaining} {remaining === 1 ? "run" : "runs"} left
              </span>
            </div>
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
