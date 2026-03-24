export function Section({ className = "", ...props }) {
  return <section className={`pt-10 pb-8 md:pt-16 md:pb-14 ${className}`} {...props} />;
}