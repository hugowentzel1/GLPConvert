"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type JourneyProgressPoint = { label: string; progress: number; month: number };

/**
 * Upward curve: illustrative % of progress toward the patient’s stated weight goal over time.
 * Clear labels — not a guarantee; provider sets pace.
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
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white via-white to-slate-50/90 ring-1 ring-slate-900/[0.05] ${
        compact
          ? "px-3 pb-3 pt-4 shadow-sm sm:px-4"
          : "px-4 pb-4 pt-6 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.14)] sm:px-5 sm:pt-7"
      }`}
    >
      {!compact ? (
        <div className="mb-4 space-y-2 px-1 text-center sm:px-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Momentum snapshot (illustrative)
          </p>
          <p className="text-sm font-medium leading-snug text-slate-800">
            How clarity and progress toward your stated goal can build month over month — not medical advice, not a
            promise.
          </p>
          <p className="text-xs leading-relaxed text-slate-500">
            Vertical = modeled share of your stated goal. Horizontal = months from start.
          </p>
        </div>
      ) : null}
      <div className={compact ? "h-[200px] w-full sm:h-[220px]" : "h-[280px] w-full sm:h-[300px]"}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 12, right: 12, left: 4, bottom: 28 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={brandFill} stopOpacity={0.48} />
                <stop offset="55%" stopColor={brandFill} stopOpacity={0.14} />
                <stop offset="100%" stopColor={brandFill} stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              height={48}
              tickMargin={8}
            >
              <Label
                position="bottom"
                offset={4}
                style={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
              >
                Time on path (illustrative)
              </Label>
            </XAxis>
            <YAxis
              domain={domain}
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              width={44}
            >
              <Label
                angle={-90}
                position="insideLeft"
                style={{ fontSize: 11, fill: "#64748b", fontWeight: 500, textAnchor: "middle" }}
              >
                Toward your goal
              </Label>
            </YAxis>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
              }}
              formatter={(value: number) => [
                `${value}% toward your stated goal (illustrative)`,
                "Momentum",
              ]}
              labelFormatter={(label) => `${label}`}
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
