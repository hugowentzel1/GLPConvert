"use client";

import React, { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    handleScroll(); // Initial call
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      data-testid="reading-progress"
      className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
      style={{ 
        width: `${progress}%`,
        transition: 'width 0.2s ease-out'
      }}
    />
  );
}
