"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type JourneyProgressPoint = { label: string; progress: number; month: number };

/**
 * Illustrative curve: modeled % progress toward the patient’s stated weight goal over time.
 * Visual hierarchy follows dashboard chart patterns (Stripe Atlas / Amplitude): title → subtitle → axis labels → legend.
 *
 * Markup, copy, and Recharts tree match `8f6c1760b282c6547dfd1bb7caa387972669aa53`; this file adds
 * framer-motion entrance, skeleton crossfade, and slightly tuned draw (motion-safe).
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
  const [plotReady, setPlotReady] = useState(false);

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
  const last = points[points.length - 1];
  const first = points[0];

  useEffect(() => {
    setPlotReady(false);
    const t = window.setTimeout(() => setPlotReady(true), animate ? 380 : 0);
    return () => window.clearTimeout(t);
  }, [points, brandFill, animate, compact]);

  return (
    <motion.div
      data-results-chart
      initial={animate ? { opacity: 0, y: 14 } : undefined}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
              Start · {first?.label ?? "Month 0"}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: brandFill }} aria-hidden />
              Modeled path
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-0.5 rounded-full bg-slate-200" aria-hidden />
              100% = stated goal
            </span>
          </div>
        </div>
      ) : null}
      <div
        className={`relative ${compact ? "h-[200px] w-full sm:h-[220px]" : "h-[240px] w-full sm:h-[260px]"}`}
        style={{ minHeight: compact ? 200 : 240, minWidth: 0, isolation: "isolate" }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded-xl sm:rounded-2xl"
          aria-hidden
        >
          <div className="glp-intake-chart-shimmer absolute inset-0" />
        </div>
        <motion.div
          className="absolute inset-0 z-[4] rounded-xl bg-gradient-to-b from-slate-100/95 to-white sm:rounded-2xl"
          initial={false}
          animate={{ opacity: plotReady ? 0 : 1 }}
          transition={{ duration: animate ? 0.5 : 0, ease: "easeOut" }}
          style={{ pointerEvents: plotReady ? "none" : "auto" }}
          aria-hidden
        />
        <ResponsiveContainer
          className="relative z-[3]"
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
            <Area
              type="monotone"
              dataKey="progress"
              stroke={brandFill}
              strokeWidth={2.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${gradId})`}
              isAnimationActive={plotReady && animate}
              animationDuration={animate ? 2800 : 0}
              animationEasing="ease-out"
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              dot={{ r: 3.5, strokeWidth: 2, stroke: "#fff", fill: brandFill }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {!compact ? (
        <p className="mt-4 border-t border-slate-100 px-1 text-center text-[11px] leading-relaxed text-slate-500 sm:px-2">
          Last checkpoint shown: {last?.label} at ~{last?.progress}% toward your stated goal (example only).
        </p>
      ) : null}
    </motion.div>
  );
}
