export default function GoogleAttribution() {
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
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
      <span>Mapping & location data © Google</span>
    </div>
  );
}
