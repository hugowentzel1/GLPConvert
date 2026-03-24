"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  RocketLaunchIcon,
  KeyIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const [tenantData, setTenantData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const companyHandle = params?.companyHandle as string;
  const sessionId = searchParams?.get("session_id");

  useEffect(() => {
    // In a real app, you'd fetch the tenant data from your API
    // For now, we'll simulate it
    setTimeout(() => {
      setTenantData({
        companyHandle,
        apiKey: "demo-api-key-" + Math.random().toString(36).substr(2, 9),
        loginUrl: `${window.location.origin}/c/${companyHandle}`,
        captureUrl: `${window.location.origin}/v1/ingest/lead`,
      });
      setIsLoading(false);
    }, 1000);
  }, [companyHandle]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-600 font-semibold">
            Setting up your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Sunspire! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Your solar lead generation platform is ready to go.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Account Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <GlobeAltIcon className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="font-semibold text-gray-900">Company Handle</p>
                  <p className="text-gray-600 font-mono">{companyHandle}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <KeyIcon className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="font-semibold text-gray-900">API Key</p>
                  <p className="text-gray-600 font-mono text-sm break-all">
                    {tenantData?.apiKey}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <RocketLaunchIcon className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="font-semibold text-gray-900">Login URL</p>
                  <a
                    href={tenantData?.loginUrl}
                    className="text-orange-600 hover:text-orange-700 font-mono text-sm break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tenantData?.loginUrl}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <RocketLaunchIcon className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="font-semibold text-gray-900">Capture URL</p>
                  <p className="text-gray-600 font-mono text-sm break-all">
                    {tenantData?.captureUrl}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">What&apos;s Next?</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">1</span>
              </div>
              <p className="font-semibold">Customize Your Brand</p>
              <p className="text-orange-100 text-sm">
                Upload your logo and set brand colors
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">2</span>
              </div>
              <p className="font-semibold">Start Capturing Leads</p>
              <p className="text-orange-100 text-sm">
                Use your API key to integrate lead capture
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">3</span>
              </div>
              <p className="font-semibold">Scale Your Business</p>
              <p className="text-orange-100 text-sm">
                Generate unlimited solar leads
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <a
            href={tenantData?.loginUrl}
            className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-200"
          >
            <RocketLaunchIcon className="w-5 h-5 mr-2" />
            Go to Your Dashboard
          </a>
        </motion.div>
      </div>
    </div>
  );
}
