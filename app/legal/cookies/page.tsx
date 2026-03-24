'use client';

import Footer from '@/components/Footer';
import PaidFooter from '@/components/PaidFooter';
import { useIsDemo } from '@/src/lib/isDemo';

export default function CookiesPage() {
  const isDemo = useIsDemo();
  
  const handleOpenPreferences = () => {
    if (typeof window !== 'undefined') {
      if ((window as any).__cmp) {
        (window as any).__cmp('open');
      } else if ((window as any).__tcfapi) {
        (window as any).__tcfapi('displayConsentUi', 2, () => {});
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center md:text-left">Cookie Preferences</h1>
          <p className="text-lg text-gray-600 mb-6">
            Manage your cookie and tracking preferences.
          </p>
          <button
            onClick={handleOpenPreferences}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Cookie Preferences
          </button>
          <p className="text-gray-600 mt-6">
            You can adjust your cookie settings at any time using the button above.
          </p>
        </div>
      </main>
      {isDemo ? <Footer /> : <PaidFooter />}
    </div>
  );
}

