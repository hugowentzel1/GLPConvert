"use client";

import { useCallback, useState } from "react";

type Props = {
  brandName: string;
  countdown: { days: number; hours: number; minutes: number; seconds: number };
  runsLeft: number;
};

export default function DemoPreviewTopBar({ brandName, countdown, runsLeft }: Props) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(() => {
    if (typeof window === "undefined") return;
    void navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div className="sticky top-0 z-40 border-b border-sky-200/80 bg-sky-50/95 px-3 py-2.5 text-center text-xs text-sky-950 shadow-sm backdrop-blur-sm sm:px-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row sm:text-left">
        <p className="font-medium">
          <span className="text-sky-800/90">
            Preview for {brandName} — your logo & colors on the intake
          </span>
          <span className="mx-2 hidden text-sky-300 sm:inline" aria-hidden>
            ·
          </span>
          <span className="block sm:inline">
            Expires in {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
          </span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-white/90 px-3 py-1 font-semibold text-sky-900 shadow-sm ring-1 ring-sky-200/80">
            {runsLeft} preview run{runsLeft === 1 ? "" : "s"} left
          </span>
          <button
            type="button"
            onClick={onCopy}
            className="rounded-full bg-sky-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-800"
          >
            {copied ? "Copied link" : "Copy demo link"}
          </button>
        </div>
      </div>
    </div>
  );
}
