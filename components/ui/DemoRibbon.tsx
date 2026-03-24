"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function DemoRibbon() {
  const [enabled, setEnabled] = useState(false);
  const [brand, setBrand] = useState<string>();
  const [logo, setLogo] = useState<string>();
  const [primary, setPrimary] = useState<string>("FFA63D"); // hex without #
  const [tenant, setTenant] = useState<string>("default");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const isDemo = p.get("demo");
    if (isDemo && isDemo !== "0" && isDemo !== "false") {
      setEnabled(true);
      setBrand(p.get("brand") || undefined);
      setLogo(p.get("logo") || undefined);
      setPrimary((p.get("primary") || "FFA63D").replace("#", ""));
      setTenant(p.get("tenant") || "default");
    } else {
      setEnabled(false);
    }
  }, []);

  const color = useMemo(() => `#${primary}`, [primary]);

  if (!enabled) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {}
  };

  // Build "carry-through" link to report page with branding + demo
  const carryParams = new URLSearchParams(window.location.search);
  carryParams.set("demo", "1");
  const reportHref = `/report?${carryParams.toString()}`;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100]">
      <div className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-white/50 bg-white/95 backdrop-blur shadow-[0_16px_60px_rgba(15,23,42,.12)]">
        {logo ? (
          <Image
            src={logo}
            alt="logo"
            width={32}
            height={32}
            unoptimized
            className="w-8 h-8 rounded-lg object-contain"
            sizes="100vw"
            style={{ height: "auto", width: "auto" }}
          />
        ) : null}
        <div className="text-sm">
          <div className="font-semibold">Demo Mode — White-Label Preview</div>
          <div className="text-xs text-slate-500">
            Pre-branded preview. Not a contract quote.
          </div>
        </div>
        <a
          href={reportHref}
          className="px-4 py-2 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 hover:from-orange-500 hover:via-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Put this on our site
        </a>
        <button onClick={copy} className="text-xs text-slate-600 underline">
          Copy demo link
        </button>
      </div>
    </div>
  );
}
