"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type JourneyProgressPoint = { label: string; progress: number; month: number };

/**
 * Upward “journey momentum” curve: % of illustrative progress toward the stated goal over time.
 * Psychologically optimistic vs. a falling weight line — still educational, not a guarantee.
 */
export default function GlpJourneyProgressChart({
  points,
  brandFill,
  variant = "default",
}: {
  points: JourneyProgressPoint[];
  brandFill: string;
  variant?: "default" | "compact";
}) {
  const [animate, setAnimate] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAnimate(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const gid = useId().replace(/:/g, "");
  const gradId = `glpJourneyGrad-${gid}`;

  const domain = useMemo((): [number, number] => [0, 100], []);

  if (points.length < 2) return null;

  const compact = variant === "compact";

  return (
    <div
      data-results-chart
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80 ring-1 ring-slate-900/[0.04] ${
        compact ? "px-2 pb-2 pt-3 shadow-sm sm:px-3" : "px-2 pb-2 pt-4 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.12)] sm:px-4 sm:pt-5"
      }`}
    >
      {!compact ? (
        <>
          <p className="mb-1 px-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Journey momentum (illustrative)
          </p>
          <p className="mb-3 px-2 text-center text-xs text-slate-500">
            Progress toward your stated goal over time — not a guarantee. Your provider sets pace and targets.
          </p>
        </>
      ) : null}
      <div className={compact ? "h-[200px] w-full sm:h-[220px]" : "h-[260px] w-full sm:h-[300px]"}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, left: -8, bottom: 4 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={brandFill} stopOpacity={0.5} />
                <stop offset="50%" stopColor={brandFill} stopOpacity={0.15} />
                <stop offset="100%" stopColor={brandFill} stopOpacity={0.03} />
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
              tickFormatter={(v) => `${v}%`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              }}
              formatter={(value: number) => [`${value}%`, "Illustrative progress"]}
              labelFormatter={(label) => label}
            />
            <Area
              type="monotone"
              dataKey="progress"
              stroke={brandFill}
              strokeWidth={2.5}
              fill={`url(#${gradId})`}
              isAnimationActive={animate}
              animationDuration={animate ? 900 : 0}
              animationEasing="ease-out"
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              dot={{ r: 3.5, strokeWidth: 2, stroke: "#fff", fill: brandFill }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
