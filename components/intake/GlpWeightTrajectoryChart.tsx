"use client";

import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type WeightChartPoint = { label: string; weight: number; month: number };

export default function GlpWeightTrajectoryChart({
  points,
  brandFill,
  goalWeight,
  variant = "default",
}: {
  points: WeightChartPoint[];
  brandFill: string;
  goalWeight: number;
  variant?: "default" | "compact";
}) {
  const gid = useId().replace(/:/g, "");
  const gradId = `glpWtGrad-${gid}`;

  const domain = useMemo(() => {
    const weights = points.map((p) => p.weight);
    const min = Math.min(goalWeight, ...weights);
    const max = Math.max(...weights);
    const pad = Math.max(4, Math.round((max - min) * 0.08));
    return [Math.floor(min - pad), Math.ceil(max + pad)] as [number, number];
  }, [points, goalWeight]);

  if (points.length < 2) return null;

  const compact = variant === "compact";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80 ring-1 ring-slate-900/[0.04] ${
        compact ? "px-2 pb-2 pt-3 shadow-sm sm:px-3" : "px-2 pb-2 pt-4 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.12)] sm:px-4 sm:pt-5"
      }`}
    >
      {!compact ? (
        <>
          <p className="mb-1 px-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Illustrative weight trend
          </p>
          <p className="mb-3 px-2 text-center text-xs text-slate-500">
            Not a medical forecast — your provider sets pace and targets.
          </p>
        </>
      ) : null}
      <div className={compact ? "h-[200px] w-full sm:h-[220px]" : "h-[260px] w-full sm:h-[300px]"}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={brandFill} stopOpacity={0.45} />
                <stop offset="55%" stopColor={brandFill} stopOpacity={0.12} />
                <stop offset="100%" stopColor={brandFill} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={domain}
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
              width={36}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              }}
              formatter={(value: number) => [`${value} lbs`, "Est. weight"]}
              labelFormatter={(label) => label}
            />
            <ReferenceLine y={goalWeight} stroke="#94a3b8" strokeDasharray="5 5" />
            <Area
              type="monotone"
              dataKey="weight"
              stroke={brandFill}
              strokeWidth={2.5}
              fill={`url(#${gradId})`}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              dot={{ r: 3.5, strokeWidth: 2, stroke: "#fff", fill: brandFill }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
