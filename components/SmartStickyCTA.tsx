'use client';

import React, { useEffect, useRef } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

/**
 * Smart Sticky CTA Component
 * 
 * Implements the "Sunspire Mobile Gold Standard" behavior:
 * - Reveals only after hero CTA leaves + user scrolls 400px
 * - Hides when inline CTA is ≥30% visible (to avoid competition)
 * - Hides on form focus/open keyboard (mobile)
 * - Never overlaps cookie banner
 * - Disabled on Report page by default (opt-in via data-allow-report-sticky="1")
 */
export default function SmartStickyCTA({ onClick }: { onClick?: () => void }) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const brand = useBrandTakeover();

  useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;

    const btn = sticky.querySelector('button');
    if (!btn) return;

    // 1) Reveal sticky only after hero CTA leaves + user scrolls 400px
    const minScrollForSticky = 400;
    let heroGone = false;

    const hero = document.querySelector('.hero') || document.body;
    const heroObserver = new IntersectionObserver(entries => {
      const entry = entries[0];
      heroGone = entry && entry.isIntersecting === false;
      updateSticky();
    }, { threshold: 0.01 });
    heroObserver.observe(hero);

    // 2) Hide sticky when any inline CTA is ≥30% visible (to avoid competition)
    const inlineCTAs = Array.from(document.querySelectorAll('.inline-cta'));
    let inlineVisible = false;

    const io = new IntersectionObserver(entries => {
      inlineVisible = entries.some(e => e.isIntersecting && e.intersectionRatio >= 0.3);
      updateSticky();
    }, { threshold: [0.3] });

    inlineCTAs.forEach(el => io.observe(el));

    // 3) Hide sticky on form focus / open keyboard (mobile)
    ['focusin', 'focusout'].forEach(evt => {
      document.addEventListener(evt, updateSticky, true);
    });

    // 4) Cookie banner handling: do not show until dismissed
    const cookiesVisible = () => document.body.classList.contains('cookies-visible');

    // 5) Report page rule: disable sticky unless explicitly enabled via data-attr
    const onReportPage = !!document.querySelector('[data-page="report"]');
    const stickyAllowed = !onReportPage || document.body.dataset.allowReportSticky === '1';

    function updateSticky() {
      const scrolledEnough = window.scrollY > minScrollForSticky;
      const formFocused = document.activeElement && (
        document.activeElement.tagName === 'INPUT' || 
        document.activeElement.tagName === 'TEXTAREA' || 
        document.activeElement.tagName === 'SELECT'
      );

      const shouldShow = stickyAllowed && heroGone && scrolledEnough && !inlineVisible && !formFocused && !cookiesVisible();

      if (sticky) {
        sticky.classList.toggle('sticky-cta--visible', shouldShow);
      }
    }

    window.addEventListener('scroll', updateSticky, { passive: true });
    document.addEventListener('DOMContentLoaded', updateSticky);

    // Initial check
    updateSticky();

    return () => {
      heroObserver.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', updateSticky);
      document.removeEventListener('DOMContentLoaded', updateSticky);
      ['focusin', 'focusout'].forEach(evt => {
        document.removeEventListener(evt, updateSticky, true);
      });
    };
  }, []);

  return (
    <div 
      ref={stickyRef}
      id="stickyCta" 
      className="sticky-cta !hidden md:!block"
    >
      <button 
        className="sticky-cta__button"
        style={{ background: brand?.primary || 'var(--brand-600)' }}
        onClick={onClick}
        data-cta="primary"
        data-cta-button
      >
        <span className="icon-rocket mr-3" aria-hidden="true">⚡</span>
        <span>Launch Your Branded Version Now</span>
      </button>
    </div>
  );
}