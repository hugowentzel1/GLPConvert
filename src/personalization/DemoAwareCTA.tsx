"use client";
import { useState } from "react";
import { useIsDemo } from "@/src/personalization/useDemoFlag";
import { usePersonalizationCtx } from "@/src/personalization/PersonalizationContext";
import { DemoFormModal } from "./DemoFormModal";

export function DemoAwareCTA() {
  const isDemo = useIsDemo();
  const { brand } = usePersonalizationCtx();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {isDemo ? (
        <div className="flex flex-col gap-3 items-center text-center">
          <div className="flex gap-3">
            <button
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-md border border-orange-600"
              onClick={() => setIsModalOpen(true)}
            >
              ⚡ Launch Your Branded Version Now
            </button>
            <button
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
            >
              Copy demo link
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Pre-branded preview for {brand ?? "Your Company"}. Not a contract
            quote.
          </p>
        </div>
      ) : (
        <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
          ⚡ Launch Your Branded Version Now
        </button>
      )}

      <DemoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
