type Item = { label: string; value: string };

export default function AssumptionsTray({ items }: { items: Item[] }) {
  return (
    <section data-testid="assumptions-tray" aria-labelledby="assumptions-title"
             className="mt-8 md:mt-10">
      <h3 id="assumptions-title" className="mb-3 md:mb-4 text-[15px] font-semibold text-neutral-900">
        Key Assumptions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4">
        {items.map((it) => (
          <div key={it.label}
               className="min-h-[68px] rounded-xl border border-neutral-200 bg-white/70 backdrop-blur p-3">
            <div className="text-[12px] text-neutral-500">{it.label}</div>
            <div className="text-[14px] font-semibold text-neutral-900">{it.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
