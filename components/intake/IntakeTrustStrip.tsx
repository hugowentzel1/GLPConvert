"use client";

import type { CSSProperties } from "react";

/**
 * Patient-intake trust strip — visual pattern aligned with `components/trust/TrustRow.tsx`
 * (Sunspire-style icon pills + label). Copy is clinic-safe: security, compliance posture,
 * routing, and educational framing — no vendor review stars on the patient path.
 */
function LockIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        fillRule="evenodd"
        d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        fillRule="evenodd"
        d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.061 5.304 3.75 3.75 0 004.574-.555l1.897-1.897a.75.75 0 111.06-1.06l-1.898 1.898a5.25 5.25 0 01-7.404-7.404l4.5-4.5a5.25 5.25 0 017.404 7.404l-1.649 1.649a.75.75 0 11-1.06-1.06l1.649-1.649a3.75 3.75 0 00-5.304-5.304l-4.5 4.5a3.75 3.75 0 005.304 5.304l1.898-1.898a.75.75 0 111.06 1.06l-1.898 1.898a5.25 5.25 0 01-7.404-7.404l4.5-4.5a5.25 5.25 0 017.404 7.404z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const pillStyle: CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--glp-brand-fill, #475569) 14%, white 86%)",
  color: "var(--glp-brand-fill, #475569)",
};

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex max-w-[100%] items-center gap-2 sm:gap-2.5">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full [&>svg]:shrink-0"
        style={pillStyle}
      >
        {icon}
      </div>
      <span className="text-left text-[12px] font-semibold leading-snug tracking-tight text-slate-800 sm:text-[13px]">
        {text}
      </span>
    </span>
  );
}

export default function IntakeTrustStrip() {
  return (
    <div
      data-intake-trust
      data-testid="intake-trust-strip"
      className="mx-auto mb-10 w-full max-w-2xl"
      aria-label="Trust and privacy signals"
    >
      {/* md+: single wrapped row — matches marketing TrustRow rhythm */}
      <div className="mx-auto hidden flex-wrap items-center justify-center gap-x-3 gap-y-3 rounded-2xl border border-slate-200/60 bg-white/85 px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:px-6 md:flex md:gap-4">
        <TrustBadge icon={<LockIcon />} text="Encrypted connection" />
        <span className="hidden text-slate-300 sm:inline" aria-hidden>
          •
        </span>
        <TrustBadge icon={<ShieldIcon />} text="HIPAA-ready posture" />
        <span className="hidden text-slate-300 sm:inline" aria-hidden>
          •
        </span>
        <TrustBadge icon={<LinkIcon />} text="Routed to your clinic" />
        <span className="hidden text-slate-300 sm:inline" aria-hidden>
          •
        </span>
        <TrustBadge icon={<DocumentIcon />} text="Educational only — not medical advice" />
      </div>

      {/* Mobile: stacked rows so nothing feels cramped */}
      <div className="flex flex-col items-stretch gap-2.5 rounded-2xl border border-slate-200/60 bg-white/85 px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-sm md:hidden">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5">
          <TrustBadge icon={<LockIcon />} text="Encrypted connection" />
          <span className="text-slate-300" aria-hidden>
            •
          </span>
          <TrustBadge icon={<ShieldIcon />} text="HIPAA-ready posture" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5">
          <TrustBadge icon={<LinkIcon />} text="Routed to your clinic" />
          <span className="text-slate-300" aria-hidden>
            •
          </span>
          <TrustBadge icon={<DocumentIcon />} text="Educational only — not medical advice" />
        </div>
      </div>
    </div>
  );
}
