"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type JourneyProgressPoint = { label: string; progress: number; month: number };

/**
 * Illustrative % progress over time. Chart renders in full; a neutral, non-tinted “glass”
 * shimmer layer sits on top (CSS — no staged partial reveal, no Lottie).
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

  const areaDot = useCallback(
    (dotProps: { cx?: number; cy?: number; index?: number }) => {
      const { cx, cy, index } = dotProps;
      if (cx == null || cy == null || index == null) return null;
      return (
        <circle
          key={`glp-d-${index}`}
          cx={cx}
          cy={cy}
          r={3.5}
          fill={brandFill}
          stroke="#fff"
          strokeWidth={2}
        />
      );
    },
    [brandFill],
  );

  if (points.length < 2) return null;

  const compact = variant === "compact";
  const last = points[points.length - 1];
  const first = points[0];
  const legendStartPair = first?.label === "Start" ? "Month 0" : (first?.label ?? "Month 0");

  return (
    <motion.div
      data-results-chart
      initial={animate && !compact ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`glp-intake-chart-card relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white via-white to-slate-50/90 ring-1 ring-slate-900/[0.04] ${
        compact
          ? "px-3 pb-3 pt-4 shadow-sm sm:px-4"
          : "px-4 pb-5 pt-6 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.12)] sm:px-6 sm:pb-6 sm:pt-7"
      }`}
    >
      <div
        className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-slate-300/80 to-transparent"
        aria-hidden
      />

      {!compact ? (
        <div className="mb-6 space-y-2 px-2 text-center sm:mb-7 sm:space-y-2.5 sm:px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Momentum snapshot (illustrative)
          </p>
          <p className="text-lg font-semibold leading-snug tracking-tight text-slate-900 sm:text-xl">
            How progress toward your stated goal can build over time
          </p>
          <p className="mx-auto max-w-lg text-sm font-normal leading-relaxed text-slate-600 sm:text-[15px] sm:leading-relaxed">
            Each point is a modeled checkpoint — not a promise. Vertical axis: share of your goal; horizontal: months
            from start. Your provider sets the real pace.
          </p>
          <div className="mx-auto mt-4 flex max-w-md flex-col items-center gap-2.5 text-[11px] leading-relaxed text-slate-600 sm:mt-5 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
              Start · {legendStartPair}
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full shadow-sm ring-2 ring-white"
                style={{ backgroundColor: brandFill }}
                aria-hidden
              />
              Modeled path
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-0.5 w-2 rounded-full bg-slate-200" aria-hidden />
              100% = stated goal
            </span>
          </div>
        </div>
      ) : null}
      <div
        className={`relative ${
          compact ? "h-[200px] w-full sm:h-[220px]" : "h-[240px] w-full sm:h-[260px]"
        }`}
        style={{ minHeight: compact ? 200 : 240, minWidth: 0, isolation: "isolate" }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl sm:rounded-2xl [mask-image:linear-gradient(180deg,black_0%,black_88%,transparent_100%)]"
          aria-hidden
        >
          <div className="glp-intake-chart-lux-shimmer h-full w-full" />
        </div>
        {!compact ? (
          <div
            className="glp-intake-chart-sparkle-layer pointer-events-none absolute inset-0 z-[18] overflow-hidden rounded-xl sm:rounded-2xl [mask-image:linear-gradient(180deg,black_0%,black_90%,transparent_100%)]"
            aria-hidden
          />
        ) : null}
        <div className="relative z-10 h-full w-full rounded-xl sm:rounded-2xl">
          <ResponsiveContainer
            className="relative h-full w-full"
            width="100%"
            height="100%"
            minHeight={compact ? 200 : 240}
            minWidth={0}
          >
            <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={brandFill} stopOpacity={0.55} />
                  <stop offset="45%" stopColor={brandFill} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={brandFill} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#e2e8f0" />
              <ReferenceLine
                y={100}
                stroke="#cbd5e1"
                strokeDasharray="5 5"
                strokeWidth={1}
                ifOverflow="visible"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                height={44}
                tickMargin={6}
              >
                <Label
                  position="bottom"
                  offset={0}
                  style={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                >
                  Time (months from start)
                </Label>
              </XAxis>
              <YAxis
                domain={domain}
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                width={48}
              >
                <Label
                  angle={-90}
                  position="insideLeft"
                  dx={-12}
                  style={{ fontSize: 11, fill: "#64748b", fontWeight: 600, textAnchor: "middle" }}
                >
                  Toward your stated goal
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
                  `${value}% of your stated goal (illustrative)`,
                  "Modeled momentum",
                ]}
                labelFormatter={(label) => `${label}`}
              />
              {!compact ? (
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke={brandFill}
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity={0.1}
                  dot={false}
                  isAnimationActive={animate}
                  animationDuration={animate ? 2000 : 0}
                  animationEasing="ease-in-out"
                  name="glow"
                />
              ) : null}
              <Area
                type="monotone"
                dataKey="progress"
                stroke={brandFill}
                strokeWidth={2.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={`url(#${gradId})`}
                isAnimationActive={animate}
                animationDuration={animate ? 2000 : 0}
                animationEasing="ease-in-out"
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                dot={areaDot as never}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {!compact ? (
        <p className="mt-4 border-t border-slate-100 px-1 text-center text-[11px] leading-relaxed text-slate-500 sm:px-2">
          Last checkpoint shown: {last?.label} at ~{last?.progress}% toward your stated goal (example only).
        </p>
      ) : null}
    </motion.div>
  );
}
