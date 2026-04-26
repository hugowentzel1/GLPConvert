/**
 * Force dynamic SSR for `/pricing` so Vercel never serves a stale prerendered
 * HTML response from the edge. The pricing CTA price + brand color must always
 * reflect the latest deploy (we ship pricing copy + brand-color gating
 * regularly), and a 24-hour-old CDN cache shows visitors a price the build no
 * longer believes in.
 */
export const dynamic = "force-dynamic";

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
