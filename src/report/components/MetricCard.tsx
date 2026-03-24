"use client";
import React from "react";
import { motion } from "framer-motion";
import LockedOverlay from "@/components/LockedOverlay";
import { teaseCurrency } from "@/src/demo/redaction";
import { IconBadge } from "@/components/ui/IconBadge";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  unit,
  description,
  tooltip,
  icon,
  className = "",
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
          {tooltip && (
            <div className="group relative ml-1">
              <svg
                className="w-4 h-4 text-gray-400 cursor-help"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </h3>
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {unit && <span className="ml-1 text-lg text-gray-500">{unit}</span>}
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      )}
    </motion.div>
  );
}
