"use client";
import React from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { track } from "./track";
import UnlockPill from "@/src/components/ui/UnlockPill";

export default function BlurMask({
  children,
  cta = "Unlock Full Report",
  id,
  buttonPosition = "center", // "center" | "top-right" | "bottom"
}: {
  children: React.ReactNode;
  cta?: string;
  id?: string;
  buttonPosition?: "center" | "top-right" | "bottom";
}) {
  const b = useBrandTakeover();

  if (!b.enabled) return <>{children}</>;

  const handleBlurClick = () => {
    track("unlock_clicked", { placement: "blur", id });
    document.dispatchEvent(new CustomEvent("openInstall"));
  };

  const getButtonPosition = () => {
    switch (buttonPosition) {
      case "top-right":
        return "absolute right-3 top-3 z-10";
      case "bottom":
        return "absolute left-1/2 -translate-x-1/2 bottom-4 z-10";
      default: // center
        return "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10";
    }
  };

  return (
    <div className="relative">
      <div className="gate__content">{children}</div>
      <div className={getButtonPosition()}>
        <UnlockPill
          label={cta}
          onClick={handleBlurClick}
          aria-label="Preview — details hidden. Activate to unlock full report."
        />
      </div>
    </div>
  );
}
