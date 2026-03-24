"use client";
import { useEffect, useState } from "react";

export function useIsDemo() {
  const [isDemo, set] = useState(false);
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    set(sp.get("demo") === "1" || sp.get("demo") === "true");
  }, []);
  return isDemo;
}
