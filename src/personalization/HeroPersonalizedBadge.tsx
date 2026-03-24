"use client";
import { usePersonalizationCtx } from "@/src/personalization/PersonalizationContext";
import Image from "next/image";

export function HeroPersonalizedBadge() {
  const { brand, primary, logo } = usePersonalizationCtx();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {logo && <Image src={logo} alt="Logo" width={28} height={28} />}
      <span style={{ fontWeight: 700, color: primary }}>
        {brand ?? "Your Company"}
      </span>
    </div>
  );
}
