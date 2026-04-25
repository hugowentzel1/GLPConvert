"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** Canonical accessibility statement: `/accessibility`. Preserves the full query string. */
function LegalAccessibilityRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const q = searchParams?.toString() ?? "";
    router.replace(q ? `/accessibility?${q}` : "/accessibility");
  }, [router, searchParams]);
  return <div className="min-h-[50vh] bg-slate-50" aria-label="Loading" />;
}

export default function LegalAccessibilityPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-slate-50" />}>
      <LegalAccessibilityRedirect />
    </Suspense>
  );
}
