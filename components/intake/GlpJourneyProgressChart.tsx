"use client";

import { useCallback, useId, useMemo, type CSSProperties } from "react";
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
 * Round 33b — restore the L→R load-in animation but eliminate the actual
 * flicker sources.
 *
 * What stays (the visual moment the user wants back):
 *   - The whole `.recharts-area` group (fill polygon + line stroke + dots)
 *     reveals L→R together via a clip-path animation. After 400ms hold the
 *     clip-path animates from `inset(0 100% 0 0)` to `inset(0 0 0 0)` over
 *     ~3 seconds — the canonical Stripe Sigma / Linear Insights / Apple
 *     Numbers chart-load pattern.
 *   - Axis labels (numbers + month names) and gridlines paint instantly at
 *     t=0 because they live OUTSIDE `.recharts-area` in the SVG tree.
 *
 * What goes (the actual flicker sources):
 *   - The sheen + glow + brand-pulse `<Line>` overlays. Each was a copy of
 *     the line stroke with its OWN animated gradient stops (`<animate>`
 *     attribute on linearGradient stops). Running 3 animated gradients
 *     stacked on the same path during the L→R clip caused phase drift on
 *     the clip edge → axis text adjacent to the chart got de-prioritized
 *     during composite re-rasterization → the "numbers disappearing" flicker.
 *   - The dot pulse halos (two concentric `<animate>` SVG circles on the
 *     final dot). Animating SVG attributes adjacent to axis `<text>` was a
 *     known Safari/WebKit flicker source (Apple WebKit Mar 2026 notes).
 *   - The reveal-scan `<div>` with `mix-blend-mode: screen`. mix-blend-mode
 *     forces a new compositing layer and re-rasterizes everything below
 *     each frame; SVG axis text antialiasing flickered during the scan.
 *   - The lux-shimmer + sparkle-layer divs with `mix-blend-mode: soft-light`.
 *     Same compositing issue, smaller magnitude.
 *
 * Result: same load-in choreography (whole data layer L→R reveal) the user
 * wanted back, but only the clip-path animation is running — no animated
 * gradients, no mix-blend-mode, no dot SVG `<animate>`. The axis text never
 * gets re-rasterized → no flicker.
 *
 * Pattern source: Stripe Sigma chart-build 2024; Linear Insights time-series;
 * Apple Numbers chart default; Apple WebKit Mar 2026 perf notes (avoid
 * stacked animated gradients + mix-blend-mode over SVG <text>).
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
  const gid = useId().replace(/:/g, "");
  const gradId = `glpJourneyGrad-${gid}`;

  const domain = useMemo((): [number, number] => [0, 100], []);
  const lastIndex = points.length - 1;

  const areaDot = useCallback(
    (dotProps: { cx?: number; cy?: number; index?: number }) => {
      const { cx, cy, index } = dotProps;
      if (cx == null || cy == null || index == null) return null;
      const isLast = index === lastIndex;
      // Final-checkpoint dot is slightly larger and thicker — no animated halo
      // (animating SVG attributes adjacent to axis text was a flicker source).
      return (
        <circle
          key={`glp-d-${index}`}
          cx={cx}
          cy={cy}
          r={isLast ? 5 : 3.5}
          fill={brandFill}
          stroke="#fff"
          strokeWidth={isLast ? 2.5 : 2}
        />
      );
    },
    [brandFill, lastIndex],
  );

  const compact = variant === "compact";

  if (points.length < 2) return null;

  const first = points[0];
  const legendStartPair = first?.label === "Start" ? "Month 0" : (first?.label ?? "Month 0");

  const axisCaptionStyle: CSSProperties = {
    fontSize: 11,
    color: "#64748b",
    fontWeight: 600,
    fontFamily: "inherit",
    letterSpacing: 0,
    lineHeight: 1.25,
  };

  return (
    <div
      data-results-chart
      className={`glp-intake-chart-card relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white ring-1 ring-slate-900/[0.04] ${
        compact
          ? "px-3 pb-3 pt-4 shadow-sm sm:px-4"
          : "px-4 pb-5 pt-6 shadow-[0_2px_8px_rgba(15,23,42,0.05),0_12px_40px_-16px_rgba(15,23,42,0.12)] sm:px-6 sm:pb-6 sm:pt-7"
      }`}
    >
      <div
        className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-slate-200 to-transparent"
        aria-hidden
      />

      {!compact ? (
        <div className="mb-6 space-y-3 px-2 text-center sm:mb-7 sm:px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Modeled momentum
          </p>
          <h3 className="mx-auto max-w-md text-[1.35rem] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[1.55rem]">
            Your modeled path to the goal
          </h3>
          <p className="mx-auto max-w-md text-[13px] leading-relaxed text-slate-500 sm:text-sm">
            Each checkpoint is illustrative — your provider sets the real pace.
          </p>
          <div className="mt-4 flex w-full justify-center sm:mt-5">
            <div className="inline-flex max-w-full flex-col items-center gap-2 text-[11px] leading-relaxed text-slate-600 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-2">
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
        </div>
      ) : null}
      <div
        className={`${compact ? "" : "flex min-w-0 flex-col gap-2 md:flex-row md:items-stretch md:gap-1.5"}`}
      >
        {!compact ? (
          <>
            <div className="hidden w-7 shrink-0 self-stretch flex-col items-center justify-center px-0.5 md:flex md:w-8">
              <p
                className="text-center [writing-mode:vertical-rl]"
                style={{ ...axisCaptionStyle, transform: "translateX(-6px) rotate(180deg)" }}
                data-results-chart-y-label
              >
                Toward your stated goal
              </p>
            </div>
            <div className="flex justify-center px-1 md:hidden">
              <p
                className="max-w-[14rem] text-center"
                style={axisCaptionStyle}
                data-results-chart-y-label
              >
                Toward your stated goal
              </p>
            </div>
          </>
        ) : null}
        <div
          className={`relative min-w-0 flex-1 ${
            compact ? "h-[200px] w-full sm:h-[220px]" : "h-[244px] w-full sm:h-[268px]"
          }`}
          style={{ minHeight: compact ? 200 : 244, minWidth: 0 }}
        >
          <ResponsiveContainer
            className="relative h-full w-full"
            width="100%"
            height="100%"
            minHeight={compact ? 200 : 244}
            minWidth={0}
          >
            <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <defs>
                {/* Solid (non-animated) brand-tinted area gradient. No SVG <animate>
                    on stops — animated gradient stops were the flicker source. */}
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={brandFill} stopOpacity={0.55} />
                  <stop offset="45%" stopColor={brandFill} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={brandFill} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 6" vertical={false} stroke="rgba(15,23,42,0.05)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                height={28}
                tickMargin={6}
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
                cursor={{ stroke: "rgba(15,23,42,0.15)", strokeDasharray: "3 3" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const value = payload[0]?.value;
                  if (typeof value !== "number") return null;
                  return (
                    <div
                      style={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                        fontSize: 12,
                        boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
                        padding: "8px 10px",
                        lineHeight: 1.35,
                        color: "#0f172a",
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
                      <div style={{ color: "#475569" }}>
                        Modeled momentum:{" "}
                        <span style={{ color: brandFill, fontWeight: 600 }}>{value}%</span>{" "}
                        of stated goal (illustrative)
                      </div>
                    </div>
                  );
                }}
              />
              {/* Single Area: brand fill + line stroke + dots, all rendered inside
                  the same `.recharts-area` <g>. CSS clip-path animation on that
                  group reveals everything together L→R. No sheen/glow/pulse
                  Line overlays — those were a flicker source. */}
              <Area
                type="monotone"
                dataKey="progress"
                stroke={brandFill}
                strokeWidth={2.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={`url(#${gradId})`}
                isAnimationActive={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                dot={areaDot as never}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {!compact ? (
        <p
          className="mx-auto mt-2.5 mb-2 w-full text-center"
          style={axisCaptionStyle}
          data-results-chart-x-label
        >
          Time (months from start)
        </p>
      ) : null}
    </div>
  );
}
