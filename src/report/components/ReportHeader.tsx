"use client";
import React from "react";
import { motion } from "framer-motion";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import HeroBrand from "@/src/brand/HeroBrand";
import { IconBadge } from "@/components/ui/IconBadge";

interface ReportHeaderProps {
  address: string;
  generatedAt: Date;
  dataSourceNote: string;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  };
}

export default function ReportHeader({
  address,
  generatedAt,
  dataSourceNote,
  countdown,
}: ReportHeaderProps) {
  const b = useBrandTakeover();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="text-center space-y-6"
    >
      {/* Urgency Strip - Removed demo banner */}
      {/* <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.1, duration: 0.8 }} 
        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
        style={{
          backgroundColor: '#DC2626',
          borderColor: '#DC2626',
          color: '#FFFFFF'
        }}
      >
        <span className="mr-2">⏰</span>
        Exclusive preview — expires in {countdown.days}:{countdown.hours.toString().padStart(2, '0')}:{countdown.minutes.toString().padStart(2, '0')}:{countdown.seconds.toString().padStart(2, '0')}
      </motion.div> */}

      {/* Logo and Brand */}
      <div className="flex justify-center mb-6">
        {b.enabled ? (
          <HeroBrand />
        ) : (
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <IconBadge>☀️</IconBadge>
          </motion.div>
        )}
      </div>

      {/* Title and Subtitle */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900">
          Solar Intelligence Report
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Comprehensive analysis for your property at {address}
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>Data Source: {dataSourceNote}</span>
          <span>•</span>
          <span>Generated on {generatedAt.toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
