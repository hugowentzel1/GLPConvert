"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import LockedOverlay from "@/components/LockedOverlay";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

interface SavingsChartProps {
  series: Array<{
    year: number;
    production: number;
    savings: number;
    cumulativeSavings: number;
    netCashflow: number;
  }>;
  blur?: boolean;
}

export default function SavingsChart({
  series,
  blur = false,
}: SavingsChartProps) {
  const b = useBrandTakeover();
  const [viewMode, setViewMode] = useState<"yearly" | "cumulative">("yearly");

  // Simplify data for better understanding - show every 5 years
  const simplifiedData = series.filter(
    (_, index) => index % 5 === 0 || index === series.length - 1,
  );

  const maxValue = Math.max(
    ...simplifiedData.map((d) =>
      viewMode === "yearly" ? d.savings : d.cumulativeSavings,
    ),
  );

  const chartContent = (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Savings Over Time</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("yearly")}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              viewMode === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Yearly
          </button>
          <button
            onClick={() => setViewMode("cumulative")}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              viewMode === "cumulative"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Cumulative
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {simplifiedData.map((item, index) => {
          const value =
            viewMode === "yearly" ? item.savings : item.cumulativeSavings;
          const percentage = (value / maxValue) * 100;

          return (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="w-20 text-sm font-medium text-gray-600">
                Year {item.year}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ 
                    background: `linear-gradient(to right, ${b.primary || '#10B981'}, ${b.primary || '#059669'})`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
              <div className="w-28 text-right text-sm font-semibold text-gray-900">
                ${value.toLocaleString()}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        {viewMode === "yearly"
          ? "Shows savings for each individual year"
          : "Shows total accumulated savings over time"}
      </div>
    </div>
  );

  if (blur) {
    return (
      <div className="relative locked-blur">
        {chartContent}
        <LockedOverlay
          onUnlock={() =>
            document.dispatchEvent(new CustomEvent("openInstall"))
          }
        />
      </div>
    );
  }

  return chartContent;
}
