"use client";

interface KpiTileProps {
  label: string;
  value: string;
  emoji?: string;
}

export default function KpiTile({ label, value, emoji }: KpiTileProps) {
  return (
    <div className="card p-6 text-center">
      {emoji && <div className="text-3xl mb-3">{emoji}</div>}
      <div className="text-3xl font-extrabold text-[var(--ink)]">{value}</div>
      <div className="p mt-1">{label}</div>
    </div>
  );
}
