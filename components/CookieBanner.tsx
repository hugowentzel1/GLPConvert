"use client";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Always show for testing, or if not accepted
    setOpen(true);
  }, []);

  if (!open) return null;

  const accept = () => {
    localStorage.setItem("cookieAccepted", "1");
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-50"
      data-e2e="cookie-banner"
    >
      <div className="w-full px-4 py-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-t border-black/10 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-700 text-sm">
            We use cookies to analyze usage and improve your experience.
          </p>
          <div className="flex gap-2 sm:shrink-0">
            <button className="px-4 py-2 rounded-full text-sm ring-1 ring-slate-300 text-slate-700 bg-white hover:bg-slate-50">
              Manage
            </button>
            <button
              className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-[var(--brandColor,#2563eb)] hover:brightness-95"
              onClick={accept}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
