"use client";
import { useEffect } from "react";

export default function MethodologyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) document.body.setAttribute("data-modal-open", "true");
    return () => document.body.removeAttribute("data-modal-open");
  }, [open]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Methodology"
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Methodology</h3>
          <button onClick={onClose} aria-label="Close" className="text-sm text-neutral-600">✕</button>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] text-neutral-800">
          <li>NREL PVWatts® v8 for production</li>
          <li>Local utility rates & fees</li>
          <li>Export credit / net metering policy</li>
          <li>Installed cost per watt</li>
          <li>Annual degradation & O&amp;M</li>
          <li>Discount / inflation assumptions</li>
        </ul>
      </div>
    </div>
  );
}
