"use client";

import { useState } from "react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalModal({ isOpen, onClose }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms" | "cookies">(
    "privacy",
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Legal Information
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "privacy"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "terms"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab("cookies")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "cookies"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Cookie Policy
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Privacy Policy
              </h3>
              <p className="text-gray-600">
                We respect your privacy and are committed to protecting your
                personal data. This privacy policy explains how we collect, use,
                and safeguard your information.
              </p>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  Information We Collect
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Contact information (name, email, phone)</li>
                  <li>Property address and location data</li>
                  <li>Solar analysis preferences and results</li>
                  <li>Website usage and analytics data</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  How We Use Your Information
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Provide solar analysis and estimates</li>
                  <li>Connect you with solar installers</li>
                  <li>Improve our services and user experience</li>
                  <li>Send relevant updates and communications</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Terms of Service
              </h3>
              <p className="text-gray-600">
                By using our solar intelligence platform, you agree to these
                terms of service.
              </p>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  Service Description
                </h4>
                <p className="text-gray-600">
                  We provide solar analysis tools, estimates, and installer
                  connections. Our estimates are based on industry-standard
                  models and available data.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  User Responsibilities
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Provide accurate information</li>
                  <li>Use the service for lawful purposes</li>
                  <li>Respect intellectual property rights</li>
                  <li>Maintain account security</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Limitations</h4>
                <p className="text-gray-600">
                  Estimates are informational only and not binding quotes.
                  Actual results may vary based on site conditions and
                  installation quality.
                </p>
              </div>
            </div>
          )}

          {activeTab === "cookies" && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Cookie Policy
              </h3>
              <p className="text-gray-600">
                We use cookies and similar technologies to enhance your
                experience and analyze usage.
              </p>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Types of Cookies</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    <strong>Essential:</strong> Required for basic functionality
                  </li>
                  <li>
                    <strong>Analytics:</strong> Help us understand how you use
                    our service
                  </li>
                  <li>
                    <strong>Preference:</strong> Remember your settings and
                    choices
                  </li>
                  <li>
                    <strong>Marketing:</strong> Provide relevant content and
                    offers
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Managing Cookies</h4>
                <p className="text-gray-600">
                  You can control cookies through your browser settings. Note
                  that disabling certain cookies may affect functionality.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">
            For full terms and privacy policy, please contact us for licensing
            information.
          </p>
          <button
            onClick={onClose}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
