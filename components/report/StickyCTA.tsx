"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface StickyCTAProps {
  brandColor?: string;
  searchParams?: string;
}

export default function StickyCTA({ brandColor = "#FF6B35", searchParams = "" }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after user scrolls past first viewport
      const scrolled = window.scrollY > window.innerHeight * 0.5;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = async () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_book_consultation_sticky', {
        event_category: 'engagement',
        event_label: 'report_page_sticky'
      });
    }
    
    // Start Stripe checkout instead of going to contact
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="sticky-cta md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-50"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          data-testid="sticky-cta"
        >
          <div className="px-4 py-3 flex gap-2">
            <a
              href="#"
              onClick={handleClick}
              className="flex-1 px-4 py-3 text-white rounded-xl font-semibold text-sm text-center hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              style={{ backgroundColor: brandColor }}
              role="button"
              aria-label="Book a Consultation"
            >
              📅 Book a Consultation
            </a>
            <a
              href="tel:+14041234567"
              className="px-4 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all duration-200 border-2 border-gray-300 flex items-center justify-center"
              role="button"
              aria-label="Call Specialist"
            >
              📞
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

