/**
 * Force dynamic SSR for `/pricing` so Vercel never serves a stale prerendered
 * HTML response from the edge. The pricing CTA price + brand color must always
 * reflect the latest deploy (we ship pricing copy + brand-color gating
 * regularly), and a 24-hour-old CDN cache shows visitors a price the build no
 * longer believes in.
 *
 * `revalidate = 0` is paired with `dynamic = "force-dynamic"` to invalidate
 * any pre-existing CDN entry whose prerender key was pinned at an earlier
 * deploy — the previous /pricing entry held an `age: 87900` cache for ~24h
 * even after sibling routes (/support, /partners, /docs/embed) refreshed.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
