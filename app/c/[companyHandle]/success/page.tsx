"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircleIcon,
  RocketLaunchIcon,
  KeyIcon,
  GlobeAltIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { PRODUCT_NAME, SUPPORT_EMAIL } from "@/lib/product-identity";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const reduceMotion = useReducedMotion();
  const [tenantData, setTenantData] = useState<{
    companyHandle: string;
    apiKey: string;
    loginUrl: string;
    captureUrl: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const companyHandle = params?.companyHandle as string;
  const sessionId = searchParams?.get("session_id");

  const t = reduceMotion ? { duration: 0 } : { duration: 0.5 };

  useEffect(() => {
    setTimeout(() => {
      setTenantData({
        companyHandle,
        apiKey: "demo-api-key-" + Math.random().toString(36).substring(2, 11),
        loginUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/c/${companyHandle}`,
        captureUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/v1/ingest/lead`,
      });
      setIsLoading(false);
    }, 800);
  }, [companyHandle]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-14 h-14 border-4 border-slate-300 border-t-slate-700 rounded-full mx-auto mb-4 motion-reduce:animate-none animate-spin"
            aria-hidden
          />
          <p className="text-slate-700 font-medium">Confirming your subscription…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t}
          className="text-center mb-10"
        >
          <CheckCircleIcon className="w-16 h-16 text-emerald-600 mx-auto mb-4" aria-hidden />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            You&apos;re in — {PRODUCT_NAME} for {companyHandle}
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Payment succeeded{sessionId ? " (Stripe session recorded)" : ""}. Here is what happens in the{" "}
            <strong className="font-semibold text-slate-800">next 24 hours</strong> and how your team gets live.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...t, delay: reduceMotion ? 0 : 0.08 }}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8 mb-8 text-left"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Next 24 hours</h2>
          <ol className="space-y-4 list-decimal list-inside text-slate-700">
            <li>
              <span className="font-medium text-slate-900">Onboarding email</span> — embed snippet, hosted link, and
              lead routing checklist sent to the address on your Stripe receipt (or{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-900 underline underline-offset-2">
                {SUPPORT_EMAIL}
              </a>
              ).
            </li>
            <li>
              <span className="font-medium text-slate-900">Brand &amp; handle</span> — your clinic slug{" "}
              <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">{companyHandle}</code> is reserved; finish
              logo and colors in the tenant dashboard when the link in email is live.
            </li>
            <li>
              <span className="font-medium text-slate-900">Leads</span> — patient completions can flow to email and your
              webhook/CRM endpoints as configured; not an EMR replacement.
            </li>
          </ol>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...t, delay: reduceMotion ? 0 : 0.12 }}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Tenant credentials (preview)</h2>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <GlobeAltIcon className="w-6 h-6 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Clinic hub URL</p>
                  <a
                    href={tenantData?.loginUrl}
                    className="text-slate-700 hover:text-slate-900 text-sm font-mono break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tenantData?.loginUrl}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <KeyIcon className="w-6 h-6 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">API key (rotate in dashboard)</p>
                  <p className="text-slate-600 font-mono text-sm break-all">{tenantData?.apiKey}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <EnvelopeIcon className="w-6 h-6 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Lead ingest URL</p>
                  <p className="text-slate-600 font-mono text-sm break-all">{tenantData?.captureUrl}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RocketLaunchIcon className="w-6 h-6 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Support</p>
                  <p className="text-slate-600 text-sm">
                    Questions before the onboarding email lands?{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-slate-900 underline underline-offset-2">
                      {SUPPORT_EMAIL}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...t, delay: reduceMotion ? 0 : 0.16 }}
          className="text-center"
        >
          <Link
            href={tenantData?.loginUrl || "#"}
            className="inline-flex items-center px-8 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <RocketLaunchIcon className="w-5 h-5 mr-2" />
            Open clinic hub
          </Link>
          <p className="mt-6 text-sm text-slate-500">
            {PRODUCT_NAME} provides educational intake and booking-oriented handoff; licensed clinicians determine
            eligibility and care.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
