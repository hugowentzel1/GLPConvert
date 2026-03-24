"use client";
import { useEffect, useState, useMemo } from "react";

export function useIsDemo() {
  const [isDemo, set] = useState(false);
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    set(sp.get("demo") === "1" || sp.get("demo") === "true");
  }, []);
  return isDemo;
}

export function useDemoParams() {
  const [params, setParams] = useState<{
    domain: string | null;
    city: string | null;
    rep: string | null;
    runs: number;
    blur: boolean;
  }>({ domain: null, city: null, rep: null, runs: 0, blur: true });

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const runs = Math.max(0, parseInt(sp.get("runs") || "0", 10) || 0);
    const blurFlag = sp.get("blur");
    setParams({
      domain: sp.get("domain"),
      city: sp.get("city"),
      rep: sp.get("rep"),
      runs,
      blur: blurFlag ? blurFlag === "1" : runs > 0, // default blur when test runs allowed
    });
  }, []);

  return params;
}

// Simple quota keyed to the exact demoLink
const KEY = "sunspire_demo_quota";
export function useDemoQuota(allowed: number) {
  const [remaining, setRemaining] = useState<number>(allowed);
  useEffect(() => {
    const link = typeof window !== "undefined" ? window.location.href : "link";
    const raw = localStorage.getItem(KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    if (!(link in map)) map[link] = allowed;
    setRemaining(map[link]);
    localStorage.setItem(KEY, JSON.stringify(map));
  }, [allowed]);

  const consume = () => {
    const link = window.location.href;
    const raw = localStorage.getItem(KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[link] = Math.max(0, (map[link] ?? allowed) - 1);
    localStorage.setItem(KEY, JSON.stringify(map));
    setRemaining(map[link]);
  };
  return { remaining, consume };
}
