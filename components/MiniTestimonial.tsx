"use client";

import React from 'react';

interface MiniTestimonialProps {
  text: string;
}

export default function MiniTestimonial({ text }: MiniTestimonialProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
      <span className="text-blue-600">⚡</span>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  );
}
