"use client";
import { useEffect, useState } from "react";

export function useABVariant(): "A" | "B" {
  const [variant, setVariant] = useState<"A" | "B">("A");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Allow URL param override
    const urlParams = new URLSearchParams(window.location.search);
    const abOverride = urlParams.get("ab");
    if (abOverride === "A" || abOverride === "B") {
      setVariant(abOverride);
      return;
    }

    // Deterministic hash of domain + brand + URL
    const url = window.location.href;
    const brand = urlParams.get("brand") || "";
    const domain = urlParams.get("domain") || "";

    const hashString = `${domain}${brand}${url}`;
    let hash = 0;
    for (let i = 0; i < hashString.length; i++) {
      const char = hashString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Assign A or B based on hash
    setVariant(hash % 2 === 0 ? "A" : "B");
  }, []);

  return variant;
}
