import { Suspense } from "react";
import NotFoundContent from "@/components/NotFoundContent";

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Page Not Found</h2>
            <p className="text-gray-600">The page you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  );
}
