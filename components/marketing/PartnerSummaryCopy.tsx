"use client";

import { useCallback, useEffect, useState } from "react";
import { PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

type Props = {
  brandName: string;
};

export default function PartnerSummaryCopy({ brandName }: Props) {
  const [copied, setCopied] = useState(false);
  const [demoUrl, setDemoUrl] = useState("");
  useEffect(() => {
    setDemoUrl(typeof window !== "undefined" ? window.location.href : "");
  }, []);

  const onCopy = useCallback(() => {
    const text = [
      `${brandName} — ${PRODUCT_NAME} evaluation`,
      "",
      "Pricing: $99/mo + $399 setup (setup fee refunded if we miss the 24h go-live window). Taxes calculated at checkout (Stripe).",
      "",
      `Demo link: ${demoUrl || "(open this page in your browser to copy the full URL)"}`,
      "",
      `Questions: ${SUPPORT_EMAIL}`,
    ].join("\n");

    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    });
  }, [brandName, demoUrl]);

  return (
    <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
      <button
        type="button"
        onClick={onCopy}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        data-testid="partner-summary-copy"
      >
        {copied ? "Copied summary" : "Copy summary for your partner / COO"}
      </button>
    </div>
  );
}
