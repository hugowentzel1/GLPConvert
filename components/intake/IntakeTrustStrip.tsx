"use client";

import type { ReactElement, ReactNode } from "react";
import { glpIntakeUi } from "@/lib/glp-intake-ui";

/**
 * Patient-intake trust strip — Sunspire-style **tint** (`color-mix` 15% + white) + `--brand-600` icons.
 * Grid layout: four tiles side-by-side on `md+`, 2×2 on narrow viewports.
 */
function LockIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
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
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Forward / handoff to clinic — @heroicons/react/24/solid ArrowRightCircleIcon */
function ArrowRightCircleIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Booking / consult readiness — @heroicons/react/24/solid CalendarDaysIcon */
function CalendarDaysIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
      <path
        fillRule="evenodd"
        d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const pillStyle = {
  backgroundColor: "color-mix(in srgb, var(--brand-primary, #475569) 15%, white 85%)",
  color: "var(--brand-600, #475569)",
} as const;

function TrustBadgeGrid({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="mx-auto flex h-full min-h-[7.5rem] w-full max-w-[11rem] flex-col items-center justify-center gap-2.5 self-stretch py-1 text-center sm:min-h-[6.5rem]">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={pillStyle}
      >
        {icon}
      </div>
      <p className="w-full text-balance text-center text-[11px] font-semibold leading-snug tracking-tight text-slate-800 sm:text-xs">
        {text}
      </p>
    </div>
  );
}

const ITEMS: { text: string; Icon: () => ReactElement }[] = [
  { text: "Encrypted in transit", Icon: LockIcon },
  { text: "HIPAA-ready posture", Icon: ShieldIcon },
  { text: "Routes to your clinic", Icon: ArrowRightCircleIcon },
  /** Conversion-oriented: sets expectation of booking without claiming medical outcomes. */
  { text: "Clarity before you book", Icon: CalendarDaysIcon },
];

export default function IntakeTrustStrip() {
  return (
    <div
      data-intake-trust
      data-testid="intake-trust-strip"
      className="mx-auto mb-8 w-full max-w-4xl border-b border-slate-200 pb-8"
      aria-label="Trust and privacy signals"
    >
      <div className={`${glpIntakeUi.intakeHeroShell} bg-white/95 px-4 py-5 backdrop-blur-[2px] sm:px-6 sm:py-6`}>
        <div className="mx-auto grid w-full max-w-4xl grid-cols-2 content-center items-stretch justify-items-stretch gap-x-4 gap-y-6 sm:items-center md:grid-cols-4 md:gap-x-3 md:gap-y-0">
          {ITEMS.map(({ text, Icon }) => (
            <TrustBadgeGrid key={text} icon={<Icon />} text={text} />
          ))}
        </div>
      </div>
    </div>
  );
}
