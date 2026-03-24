export default function DemoBadge() {
  return (
    <div className="fixed bottom-4 right-4 pointer-events-none z-40">
      <div className="glass rounded-full px-3 py-1 text-xs text-[var(--muted)] font-medium">
        Demo Preview • Not Public
      </div>
    </div>
  );
}
