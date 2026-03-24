'use client';

import { motion } from 'framer-motion';

interface StickySidebarProps {
  brand: string;
  onUpgradeClick: () => void;
  onFeaturesClick: () => void;
}

export default function StickySidebar({ brand, onUpgradeClick, onFeaturesClick }: StickySidebarProps) {
  return (
    <div className="hidden lg:block fixed right-8 z-40" style={{ top: '50vh', transform: 'translateY(-50%)' }}>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        data-testid="report-sidebar"
      >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 max-w-sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700 font-medium">
              This demo is already branded for <span className="font-bold">{brand}</span>. Upgrade now to keep it live.
            </p>
          </div>
          
          <div className="text-xs text-gray-500">
            77 installers · 12,384 quotes · Avg quote 42s · 99.7% uptime
          </div>
          
          {/* Proof bullets */}
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span>More leads</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span>Faster quotes</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span>Branded instantly</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 text-xs text-gray-400 py-2">
            <span>SOC2</span>
            <span>GDPR</span>
            <span>NREL PVWatts®</span>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onUpgradeClick}
              className="w-full btn-primary text-sm py-3 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              data-testid="report-cta"
            >
              Launch my branded tool
            </button>
            
            <button
              onClick={onFeaturesClick}
              className="w-full text-sm text-[var(--brand-primary)] hover:underline"
            >
              See white-label features
            </button>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
}
