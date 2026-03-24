"use client";

import { ReactNode } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

interface BrandProviderProps {
  children: ReactNode;
}

export default function BrandProvider({ children }: BrandProviderProps) {
  const brandTakeover = useBrandTakeover();

  // This provider doesn't need to do anything special for now
  // It just wraps the children and provides the brand context
  return <>{children}</>;
}
