export function Button({ className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center h-12 px-7 rounded-xl font-semibold text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm ${className}`}
      {...props}
    />
  );
}