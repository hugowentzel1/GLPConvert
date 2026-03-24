/** @deprecated Solar-era badge — prefer compliance disclaimer copy in LegalFooter */
export default function PVWattsBadge() {
  return (
    <div className="flex items-center text-xs text-gray-500">
      <svg
        className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      <span>Educational & booking only — not medical advice</span>
    </div>
  );
}
