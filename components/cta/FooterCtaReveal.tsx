"use client";
import { useEffect, useState } from "react";
import { useCookieBannerOffset } from "../hooks/useCookieBannerOffset";

export default function FooterCtaReveal() {
  const { offsetBottomPx } = useCookieBannerOffset();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = (window.scrollY + window.innerHeight) / (doc.scrollHeight || document.body.scrollHeight);
      const stickyUp = !document.querySelector('[data-testid="sticky-cta"]');
      setShow(scrolled > 0.82 && stickyUp);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleStripeCheckout = async () => {
    try {
      // Collect tracking parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const company = urlParams.get('company');
      const utm_source = urlParams.get('utm_source');
      const utm_campaign = urlParams.get('utm_campaign');
      
      // Start checkout
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'starter',
          token,
          company,
          utm_source,
          utm_campaign
        })
      });
      
      if (!response.ok) throw new Error('Checkout failed');
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Unable to start checkout. Please try again.');
    }
  };

  if (!show) return null;
  return (
    <div data-testid="footer-cta"
         className="fixed inset-x-0 z-30 mx-auto w-[92%] max-w-[720px] rounded-2xl border border-neutral-200 bg-white/90 p-4 shadow-lg backdrop-blur"
         style={{ bottom: 16 + offsetBottomPx }}>
      <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <p className="text-center text-[14px] text-neutral-800 md:text-left">
          Ready to launch branded quotes on your domain?
        </p>
        <button className="w-full inline-flex items-center justify-center rounded-xl bg-[#2F80ED] px-4 py-3 text-[14px] font-semibold text-white md:w-auto"
                onClick={handleStripeCheckout}>
          <span className="mr-3">⚡</span>
          <span>Launch Your Branded Version Now</span>
        </button>
      </div>
    </div>
  );
}