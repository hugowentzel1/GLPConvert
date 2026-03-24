"use client";
import { useState } from "react";
import { useIsDemo } from "@/src/personalization/useDemoFlag";
import { usePersonalizationCtx } from "@/src/personalization/PersonalizationContext";

export function DemoAwareAddressInput() {
  const isDemo = useIsDemo();
  const { brand } = usePersonalizationCtx();
  const [address, setAddress] = useState("");
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      setShowDemoModal(true);
    } else {
      // Normal address submission logic
      console.log("Submit address:", address);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Enter Your Property Address
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {isDemo
            ? `Try an address in ${brand ?? "Your Company"}'s service area...`
            : "Get a comprehensive solar analysis tailored to your specific location."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={
              isDemo
                ? `Start typing an address in ${brand ?? "Your Company"}'s area...`
                : "Start typing your property address..."
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={isDemo}
          />

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDemo}
          >
            {isDemo
              ? "Demo Mode - Address Disabled"
              : "Generate Solar Report"}
          </button>
        </form>

        {isDemo && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            Demo mode: Address submission is disabled. Contact us to get your
            own live install.
          </p>
        )}
      </div>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-3">
              Get Your Own Live Install
            </h3>
            <p className="text-gray-600 mb-4">
              This is a demo preview. To get your own branded solar intelligence
              platform with full functionality, contact our team.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDemoModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  // TODO: Open the full demo form modal
                  console.log("Open full demo form");
                }}
                className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
