"use client";
import React from "react";
import { motion } from "framer-motion";
import LockedOverlay from "@/components/LockedOverlay";
import { shouldBlurBlock, teaseCurrency } from "@/src/demo/redaction";

interface FinancialProps {
  paybackYear: number;
  npv25Year: number;
  roiPct: number;
  utilityRate: number;
}

export default function Financial({
  paybackYear,
  npv25Year,
  roiPct,
  utilityRate,
}: FinancialProps) {
  const content = (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Financial Analysis
      </h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-600">Payback Period</span>
          <span className="font-bold text-gray-900">{paybackYear} years</span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-600">25-Year NPV</span>
          <span className="font-bold text-gray-900">
            {teaseCurrency(npv25Year)}
          </span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-600">ROI</span>
          <span className="font-bold text-gray-900">
            ~{Math.round(roiPct * 0.9)}-{Math.round(roiPct * 1.1)}%
          </span>
        </div>
        <div className="flex justify-between items-center py-4">
          <span className="text-gray-600">Electricity Rate</span>
          <span className="font-bold text-gray-900">${utilityRate}/kWh</span>
        </div>
      </div>
    </div>
  );

  if (shouldBlurBlock("financial")) {
    return (
      <div className="relative locked-blur">
        {content}
        <LockedOverlay
          onUnlock={() =>
            document.dispatchEvent(new CustomEvent("openInstall"))
          }
        />
      </div>
    );
  }

  return content;
}
