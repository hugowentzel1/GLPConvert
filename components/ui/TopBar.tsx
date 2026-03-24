"use client";

interface TopBarProps {
  message?: string;
}

export default function TopBar({
  message = "Demo version • Fully brandable in 24 hours.",
}: TopBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-[#F4F6F8] border-b border-[var(--border)] backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
