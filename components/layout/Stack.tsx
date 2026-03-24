export function Stack({ className = "", ...props }) {
  return <div className={`flex flex-col gap-6 md:gap-8 ${className}`} {...props} />;
}