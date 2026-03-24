"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  locked?: boolean;
  onUnlock?: () => void;
  unlockLabel?: string;
  className?: string;
  children: React.ReactNode;
};

export default function BlurGate({
  locked,
  onUnlock,
  unlockLabel = "Unlock Full Report",
  className = "",
  children,
}: Props) {
  return (
    <div className={cn("relative", className)}>
      {/* Only the inner content gets blurred */}
      <div
        className={
          locked ? "pointer-events-none select-none blur-[8px] opacity-95" : ""
        }
      >
        {children}
      </div>

      {locked && (
        <button
          type="button"
          onClick={onUnlock}
          className="unlock-pill absolute left-1/2 -translate-x-1/2 bottom-6 z-20 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[color:var(--brand)] px-4 py-2 text-white font-semibold shadow-md hover:shadow-lg hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <span role="img" aria-label="locked">
            🔒
          </span>
          <span>{unlockLabel}</span>
          <span aria-hidden>→</span>
        </button>
      )}
    </div>
  );
}
