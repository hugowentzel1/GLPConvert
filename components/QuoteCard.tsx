"use client";

import React from 'react';

interface QuoteCardProps {
  quote: string;
  proof: string;
  attribution: string;
}

export default function QuoteCard({ quote, proof, attribution }: QuoteCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-200">
      <div className="mb-3">
        <p className="text-lg font-semibold text-gray-900">{quote}</p>
      </div>
      <p className="text-sm text-gray-700 mb-3">{proof}</p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">{attribution}</p>
        <span className="text-xs text-green-600 font-medium">✓ Verified</span>
      </div>
    </div>
  );
}
