"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** Canonical full policy: `/privacy` (app/privacy). Preserves the full query string. */
function LegalPrivacyRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const q = searchParams?.toString() ?? "";
    router.replace(q ? `/privacy?${q}` : "/privacy");
  }, [router, searchParams]);
  return <div className="min-h-[50vh] bg-slate-50" aria-label="Loading" />;
}

export default function LegalPrivacyPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-slate-50" />}>
      <LegalPrivacyRedirect />
    </Suspense>
  );
}
