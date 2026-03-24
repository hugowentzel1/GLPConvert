"use client";
import React from "react";
import { motion } from "framer-motion";

interface AssumptionsProps {
  itcPercentage: number;
  costPerWatt: number;
  degradationRate: number;
  oandmPerKWYear: number;
  electricityRateIncrease: number;
  discountRate: number;
}

export default function Assumptions({
  itcPercentage,
  costPerWatt,
  degradationRate,
  oandmPerKWYear,
  electricityRateIncrease,
  discountRate,
}: AssumptionsProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Calculation Assumptions
      </h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-600">Federal Tax Credit (ITC)</span>
          <span className="font-bold text-gray-900">
            {(itcPercentage * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-600">Cost per Watt</span>
          <span className="font-bold text-gray-900">${costPerWatt}</span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-600">Panel Degradation</span>
          <span className="font-bold text-gray-900">
            {(degradationRate * 100).toFixed(1)}%/year
          </span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-600">O&M Cost</span>
          <span className="font-bold text-gray-900">
            ${oandmPerKWYear}/kW/year
          </span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-600">Rate Increase</span>
          <span className="font-bold text-gray-900">
            {(electricityRateIncrease * 100).toFixed(1)}%/year
          </span>
        </div>
        <div className="flex justify-between items-center py-4">
          <span className="text-gray-600">Discount Rate</span>
          <span className="font-bold text-gray-900">
            {(discountRate * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
