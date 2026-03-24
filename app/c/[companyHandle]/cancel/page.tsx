"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { XCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function CancelPage() {
  const params = useParams();
  const companyHandle = params?.companyHandle as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <XCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-8">
          No worries! Your payment wasn&apos;t processed and you haven&apos;t
          been charged. You can try again anytime.
        </p>

        <div className="space-y-4">
          <Link
            href={`/c/${companyHandle}`}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Try Again
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Questions? Contact us at{" "}
            <a
              href="mailto:support@sunspire.com"
              className="text-orange-600 hover:text-orange-700"
            >
              support@sunspire.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
