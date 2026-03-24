'use client';

import { useState, useEffect, useRef } from 'react';

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/**
 * Animated counter that counts up once when in viewport
 * Respects prefers-reduced-motion
 */
export function Counter({ value, suffix = '', duration = 800, className = '' }: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Check for reduced motion
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          
          if (prefersReducedMotion) {
            // No animation, just set final value
            setCount(value);
            setHasAnimated(true);
            return;
          }

          // Animate count up
          const startTime = Date.now();
          const endTime = startTime + duration;

          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            
            // Easing function (ease-out)
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));

            if (now < endTime) {
              requestAnimationFrame(animate);
            } else {
              setCount(value);
              setHasAnimated(true);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref} className={className} aria-live="polite">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

