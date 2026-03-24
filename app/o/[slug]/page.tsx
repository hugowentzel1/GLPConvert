export const dynamic = "force-dynamic"; // ensures runtime execution (no static HTML)
export const revalidate = 0; // belt & suspenders

import { redirect } from "next/navigation";

export default function OutreachSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const raw = params?.slug || "demo";
  const company = raw.split("-")[0]; // acme-xyz123 -> acme
  redirect(`/?company=${encodeURIComponent(company)}&demo=1`);
}
