"use client";

import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

export function IconBadge({ children }: { children: React.ReactNode }) {
  const b = useBrandTakeover();

  // Use white to company color gradients for better visual appeal
  const gradientStyle =
    b.enabled && b.primary
      ? {
          background: `linear-gradient(135deg, #ffffff, ${b.primary})`,
        }
      : {
          background: "linear-gradient(135deg, #ffffff, #d97706)",
        };

  return (
    <div
      className="text-white rounded-2xl w-12 h-12 grid place-items-center shadow-[0_8px_30px_rgba(0,0,0,.12)]"
      style={gradientStyle}
    >
      {children}
    </div>
  );
}
