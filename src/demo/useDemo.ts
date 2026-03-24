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

export type DemoParams = {
  domain: string | null;
  city: string | null;
  rep: string | null;
  runs: number;
  blur: boolean;
  expireDays: number;
  pilot: boolean;
};

export function useDemoParams(): DemoParams {
  const [params, setParams] = useState<DemoParams>({
    domain: null,
    city: null,
    rep: null,
    runs: 2,
    blur: true,
    expireDays: 7,
    pilot: false,
  });
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const runs = Math.max(0, parseInt(sp.get("runs") || "2", 10) || 2);
    const blurRaw = sp.get("blur");
    const expire = Math.max(1, parseInt(sp.get("expire") || "7", 10) || 7);
    setParams({
      domain: sp.get("domain"),
      city: sp.get("city"),
      rep: sp.get("rep"),
      runs,
      blur: blurRaw ? blurRaw === "1" : runs > 0,
      expireDays: expire,
      pilot: sp.get("pilot") === "1",
    });
  }, []);
  return params;
}

// LocalStorage-scoped per-link demo quota
const KEY = "sunspire_demo_quota_v1";
export function useDemoQuota(allowed: number) {
  const [remaining, setRemaining] = useState<number>(allowed);
  useEffect(() => {
    const link = typeof window !== "undefined" ? window.location.href : "link";
    const raw = localStorage.getItem(KEY);
    const obj = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    if (!(link in obj)) obj[link] = allowed;
    setRemaining(obj[link]);
    localStorage.setItem(KEY, JSON.stringify(obj));
  }, [allowed]);

  const consume = () => {
    const link = window.location.href;
    const raw = localStorage.getItem(KEY);
    const obj = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    obj[link] = Math.max(0, (obj[link] ?? allowed) - 1);
    localStorage.setItem(KEY, JSON.stringify(obj));
    setRemaining(obj[link]);
  };
  return { remaining, consume };
}
