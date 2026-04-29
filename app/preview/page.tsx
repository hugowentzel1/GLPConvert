import { Suspense } from "react";
import type { Metadata } from "next";
import PreviewEmbedDemo from "@/components/marketing/PreviewEmbedDemo";
import { PRODUCT_NAME } from "@/lib/product-identity";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Embedded preview — ${PRODUCT_NAME}`,
  description: "See how the branded intake appears inside a sample clinic page.",
};

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">Loading preview…</div>
      }
    >
      <PreviewEmbedDemo />
    </Suspense>
  );
}
