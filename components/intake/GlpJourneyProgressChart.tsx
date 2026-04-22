"use client";

import { useEffect, useId, useMemo, useState } from "react";
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
import { glpIntakeUi } from "@/lib/glp-intake-ui";

export type JourneyProgressPoint = { label: string; progress: number; month: number };

/**
 * Momentum chart — **no** tinted/plate behind the plot (white field only; brand only *in* the series).
 * Visual emphasis: natural curve, stronger end-point, calm grid (contrast = line, not background noise).
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
  const last = points[points.length - 1];
  const first = points[0];
  const lastIndex = points.length - 1;

  const plotH = compact ? "h-[200px] sm:h-[220px]" : "h-[280px] w-full sm:h-[300px]";
  const plotMin = compact ? 200 : 280;

  return (
    <div
      data-results-chart
      data-premium-momentum-chart
      className={`glp-intake-chart-card ${glpIntakeUi.intakeHeroShell} ${
        compact ? "px-3 pb-3 pt-4 sm:px-4" : "px-4 pb-6 pt-7 sm:px-7 sm:pb-7 sm:pt-8"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[1.75rem] bg-gradient-to-r from-transparent via-slate-300/80 to-transparent"
        aria-hidden
      />

      {!compact ? (
        <div className="relative z-[1] mb-6 space-y-2 px-1 text-center sm:mb-7 sm:space-y-2.5 sm:px-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Momentum snapshot (illustrative)
          </p>
          <p className="text-lg font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">
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
              <span
                className="h-2 w-2 rounded-full shadow-sm ring-2 ring-white"
                style={{ backgroundColor: brandFill }}
                aria-hidden
              />
              Modeled path
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-0.5 rounded-full bg-slate-200" aria-hidden />
              100% = stated goal
            </span>
          </div>
        </div>
      ) : null}

      {/* Plot well: white only — no brand wash / gradient plate behind the graph */}
      <div
        className={`relative z-[1] overflow-hidden rounded-[1.25rem] border border-slate-200/90 bg-white sm:rounded-[1.35rem] ${plotH}`}
        style={{ minHeight: plotMin, minWidth: 0, isolation: "isolate" }}
      >
        <ResponsiveContainer
          className="relative z-[1]"
          width="100%"
          height="100%"
          minHeight={plotMin}
          minWidth={0}
        >
          <AreaChart data={points} margin={{ top: 16, right: 12, left: 6, bottom: 10 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={brandFill} stopOpacity={0.58} />
                <stop offset="45%" stopColor={brandFill} stopOpacity={0.2} />
                <stop offset="100%" stopColor={brandFill} stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#f1f5f9" />
            <ReferenceLine
              y={100}
              stroke={brandFill}
              strokeOpacity={0.2}
              strokeDasharray="4 4"
              strokeWidth={1}
              ifOverflow="visible"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              height={48}
              tickMargin={8}
            >
              <Label position="bottom" offset={2} style={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}>
                Time (months from start)
              </Label>
            </XAxis>
            <YAxis
              domain={domain}
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              width={52}
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
                boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
                background: "#fff",
              }}
              formatter={(value: number) => [
                `${value}% of your stated goal (illustrative)`,
                "Modeled momentum",
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Area
              type="natural"
              dataKey="progress"
              stroke={brandFill}
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${gradId})`}
              isAnimationActive={animate}
              animationDuration={animate ? 1800 : 0}
              animationEasing="ease-in-out"
              activeDot={false}
              dot={(props) => {
                const { cx, cy, index } = props;
                if (cx == null || cy == null || index == null) return null;
                if (index === 0) {
                  return <circle cx={cx} cy={cy} r={3.5} fill={brandFill} stroke="#fff" strokeWidth={2} />;
                }
                if (index === lastIndex) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={8}
                      fill={brandFill}
                      stroke="#fff"
                      strokeWidth={3}
                      style={{ filter: `drop-shadow(0 4px 12px color-mix(in srgb, ${brandFill} 50%, transparent))` }}
                    />
                  );
                }
                return null;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {!compact ? (
        <p className="relative z-[1] mt-5 border-t border-slate-100/95 px-1 pt-5 text-center text-[11px] leading-relaxed text-slate-500 sm:px-2">
          Last checkpoint shown: {last?.label} at ~{last?.progress}% toward your stated goal (example only).
        </p>
      ) : null}
    </div>
  );
}
