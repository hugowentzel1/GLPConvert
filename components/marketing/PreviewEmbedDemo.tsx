"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { normIntakeBrandHex } from "@/lib/glp-intake-query-branding";

/**
 * Live embed preview — shows the intake inside a **fake** clinic chrome so
 * cold-email buyers can answer "will this feel native on my site?" without
 * clicking away. Matches the PLG pattern ("show, don't tell") from ProfitWell /
 * OpenView 2025 B2B self-serve benchmarks.
 *
 * Query params mirror `/intake` where useful: `company`, `primary`, `demo`.
 */
export default function PreviewEmbedDemo() {
  const sp = useSearchParams();

  const iframeSrc = useMemo(() => {
    const s = sp ?? new URLSearchParams();
    const company = s.get("company")?.trim() || "Sunspire Weight Clinic";
    const primary =
      normIntakeBrandHex(s.get("primary")) ||
      normIntakeBrandHex(s.get("brandColor")) ||
      normIntakeBrandHex(s.get("brand")) ||
      "#146EF5";
    const demo = s.get("demo") === "0" ? "" : "1";
    const q = new URLSearchParams();
    q.set("company", company);
    q.set("primary", primary);
    if (demo) q.set("demo", demo);
    return `/intake?${q.toString()}`;
  }, [sp]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (d && d.type === "glpconvert:resize" && typeof d.height === "number") {
        const el = document.getElementById("glpconvert-preview-frame");
        if (el) (el as HTMLIFrameElement).style.height = `${Math.max(400, d.height)}px`;
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 pb-20" data-preview-embed-page>
      <div className="border-b border-slate-200 bg-white px-4 py-3 text-center text-sm text-slate-600 sm:text-left">
        <span className="font-semibold text-slate-900">Embedded preview</span>
        <span className="text-slate-500">
          {" "}
          — sample clinic page; your real header/footer would wrap this iframe.
        </span>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-200" aria-hidden />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Sample clinic</p>
              <p className="text-lg font-semibold text-slate-900">Northwind Weight &amp; Wellness</p>
            </div>
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Start your GLP-1 journey
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Illustrative hero — your site&apos;s copy and imagery stay yours. Below is your branded funnel in an
            iframe (same snippet from Settings after checkout).
          </p>
        </header>

        <iframe
          id="glpconvert-preview-frame"
          title="Branded intake funnel preview"
          src={iframeSrc}
          className="w-full min-h-[880px] rounded-2xl border-0 shadow-[0_8px_30px_rgba(15,23,42,0.12)]"
          loading="lazy"
          allow="clipboard-write"
        />

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-slate-500">
          General information only — not medical advice. This preview uses your demo parameters; patients never see
          &ldquo;preview&rdquo; chrome on a live embed.
        </p>
      </div>
    </div>
  );
}
