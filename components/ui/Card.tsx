export function Card({ className = "", ...props }) {
  return <div className={`rounded-2xl border border-neutral-200/80 bg-white p-6 md:p-8 shadow-sm ${className}`} {...props} />;
}