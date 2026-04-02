"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PRODUCT_NAME } from "@/lib/product-identity";

/**
 * Legacy embed path: forwards to branded intake (GLP product — no solar quote UI).
 */
export default function EmbedPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;

  useEffect(() => {
    const q = new URLSearchParams(searchParams?.toString() ?? "");
    if (slug) q.set("company", slug);
    q.set("embed", "1");
    router.replace(`/intake?${q.toString()}`);
  }, [slug, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-sm text-slate-600">
      Opening {PRODUCT_NAME} intake…
    </div>
  );
}
