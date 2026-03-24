export default function QuoteGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
      {children}
    </div>
  );
}

