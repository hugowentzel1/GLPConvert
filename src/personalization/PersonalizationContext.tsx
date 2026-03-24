"use client";

import React, { createContext, useContext } from "react";
import { usePersonalization, type Personalization } from "./usePersonalization";

const Ctx = createContext<Personalization>({
  brand: null,
  primary: "#FFA63D",
  logo: null,
  isPersonalized: false,
});

export function PersonalizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const p = usePersonalization();
  return <Ctx.Provider value={p}>{children}</Ctx.Provider>;
}

export function usePersonalizationCtx() {
  return useContext(Ctx);
}
