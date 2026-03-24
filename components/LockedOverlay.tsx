import React from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import UnlockPill from "@/src/components/ui/UnlockPill";

export default function LockedOverlay({
  onUnlock,
  label = "Unlock Full Report",
  className = "",
}: {
  onUnlock: () => void;
  label?: string;
  className?: string;
}) {
  const b = useBrandTakeover();

  return (
    <div
      className={`absolute inset-0 pointer-events-none rounded-2xl z-20 ${className}`}
      aria-hidden="true"
    >
      {/* soft veil to remove inner borders/ghost boxes */}
      <div className="absolute inset-0 bg-white/55 backdrop-blur-md rounded-2xl" />
      {/* the CTA - consistent height and spacing */}
      <div className="pointer-events-auto absolute left-1/2 bottom-6 transform -translate-x-1/2 z-30">
        <UnlockPill label={label} onClick={onUnlock} />
      </div>
    </div>
  );
}
