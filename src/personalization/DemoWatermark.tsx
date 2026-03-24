"use client";
import { useIsDemo } from "@/src/personalization/useDemoFlag";

export function DemoWatermark() {
  const isDemo = useIsDemo();

  if (!isDemo) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border border-gray-200">
        <p className="text-xs text-gray-500 font-medium">Demo Mode</p>
      </div>
    </div>
  );
}
