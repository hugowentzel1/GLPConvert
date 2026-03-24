"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface CashflowData {
  year: number;
  production: number;
  savings: number;
  cumulativeSavings: number;
  netCashflow: number;
}

interface EstimateChartProps {
  cashflowData: CashflowData[];
  netCostAfterITC: number;
  className?: string;
  brandColor?: string;
  onViewMethodology?: () => void;
}

export default function EstimateChart({
  cashflowData,
  netCostAfterITC,
  className = "",
  brandColor = "#10b981", // Default green
  onViewMethodology,
}: EstimateChartProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get color name from hex
  const getColorName = (hex: string): string => {
    const colorMap: Record<string, string> = {
      '#10b981': 'green',
      '#E50914': 'red',
      '#CC0000': 'red',
      '#D21F3C': 'red',
      '#D71E28': 'red',
      '#FF0000': 'red',
      '#0071E3': 'blue',
      '#1877F2': 'blue',
      '#4285F4': 'blue',
      '#00A4EF': 'blue',
      '#0A66C2': 'blue',
      '#117ACA': 'blue',
      '#006AFF': 'blue',
      '#1DA1F2': 'blue',
      '#1DB954': 'green',
      '#FF9900': 'orange',
      '#FFA63D': 'orange',
    };
    
    const normalized = hex.toUpperCase();
    return colorMap[normalized] || 'colored';
  };

  const colorName = getColorName(brandColor);

  useEffect(() => {
    // Lazy load the chart
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Validate data
  if (!cashflowData || cashflowData.length === 0) {
    return (
      <div
        className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 ${className}`}
      >
        <div className="text-center py-8">
          <p className="text-gray-500">No chart data available</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Simplify data for better understanding - show every 5 years
  const simplifiedData = cashflowData
    .filter(
      (item, index) =>
        index === 0 ||
        (index + 1) % 5 === 0 ||
        index === cashflowData.length - 1,
    )
    .map((item) => ({
      year: item.year,
      totalSavings: item.cumulativeSavings,
      totalSavingsFormatted: `$${Math.round(item.cumulativeSavings / 1000)}k`,
      annualSavings: item.savings,
      annualSavingsFormatted: `$${Math.round(item.savings / 1000)}k`,
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">Year {label}</p>
          <p className="text-sm text-green-600 font-semibold">
            Total Savings: {data.totalSavingsFormatted}
          </p>
          <p className="text-sm text-gray-600">
            Annual Savings: {data.annualSavingsFormatted}
          </p>
        </div>
      );
    }
    return null;
  };

  // Find payback year for visual indicator
  const paybackYear =
    cashflowData.findIndex((item) => item.netCashflow >= 0) + 1;

  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 ${className}`}
    >
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Your Solar Savings Over Time
            </h3>
            <p className="text-gray-600 text-sm">
              Simple view of how your solar investment pays off over 25 years
            </p>
          </div>
          {onViewMethodology && (
            <button
              onClick={onViewMethodology}
              className="text-sm text-[var(--brand-600)] hover:text-[var(--brand-700)] transition-colors underline whitespace-nowrap self-start mt-1"
            >
              View Methodology
            </button>
          )}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={simplifiedData}
            margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="year"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Years",
                position: "insideBottom",
                offset: -5,
                style: { textAnchor: "middle" },
              }}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
              label={{
                value: "Total Savings",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Total savings area - single clean line */}
            <Area
              type="monotone"
              dataKey="totalSavings"
              stroke="var(--brand)"
              strokeWidth={3}
              fill="url(#savingsGradient)"
              fillOpacity={0.4}
              dot={{ fill: "var(--brand)", strokeWidth: 2, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced metric cards with brand color gradients and shadows */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div
          className="text-center p-4 rounded-lg border shadow-lg relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, var(--brand)15, var(--brand)25, var(--brand)15)`,
            borderColor: "var(--brand)",
            boxShadow:
              "0 10px 25px -5px var(--brand)20, 0 4px 6px -2px var(--brand)10",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
          <div className="text-xl font-bold relative z-10 text-gray-900">
            ${Math.round(netCostAfterITC / 1000)}k
          </div>
          <div className="text-xs text-gray-600 relative z-10">Investment</div>
        </div>
        <div
          className="text-center p-4 rounded-lg border shadow-lg relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, var(--brand)15, var(--brand)30, var(--brand)15)`,
            borderColor: "var(--brand)",
            boxShadow:
              "0 10px 25px -5px var(--brand)20, 0 4px 6px -2px var(--brand)10",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
          <div className="text-xl font-bold relative z-10 text-gray-900">
            {paybackYear} years
          </div>
          <div className="text-xs text-gray-600 relative z-10">
            Payback Time
          </div>
        </div>
        <div
          className="text-center p-4 rounded-lg border shadow-lg relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, var(--brand)15, var(--brand)25, var(--brand)15)`,
            borderColor: "var(--brand)",
            boxShadow:
              "0 10px 25px -5px var(--brand)20, 0 4px 6px -2px var(--brand)10",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
          <div className="text-xl font-bold relative z-10 text-gray-900">
            ${Math.round(cashflowData[24]?.cumulativeSavings / 1000)}k
          </div>
          <div className="text-xs text-gray-600 relative z-10">
            25-Year Savings
          </div>
        </div>
      </div>

      {/* Simple explanation */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">How to read this:</span> The {colorName}
          {" "}area shows your total savings growing over time. After {paybackYear}{" "}
          years, you&apos;ll have saved enough to cover your initial investment.
          By year 25, you&apos;ll have saved $
          {Math.round(cashflowData[24]?.cumulativeSavings / 1000)}k total.
        </p>
      </div>

      {/* SVG definitions for gradients */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--brand)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
