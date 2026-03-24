"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Branding } from "@/src/lib/branding";

const BrandCtx = createContext<Branding | null>(null);
export const useBrand = () => {
  const b = useContext(BrandCtx);
  if (!b) throw new Error("Branding context missing");
  return b;
};

export default function BrandingProvider({
  branding,
  children,
}: {
  branding: Branding;
  children: React.ReactNode;
}) {
  const style = useMemo(
    () => ({
      ["--brand" as any]: branding.brandColor,
      ["--brand-contrast" as any]: "#ffffff",
    }),
    [branding.brandColor],
  );

  return (
    <div style={style as React.CSSProperties}>
      <BrandCtx.Provider value={branding}>{children}</BrandCtx.Provider>
    </div>
  );
}
