export default function InfoCallout({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="chart-callout"
         className="mt-3 md:mt-4 rounded-xl border-l-4 border-blue-500/70 bg-blue-50/60 p-3 md:p-4 text-[13px] leading-5 text-neutral-700"
         role="note">
      {children}
    </div>
  );
}

