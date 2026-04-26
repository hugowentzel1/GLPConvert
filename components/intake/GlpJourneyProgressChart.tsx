"use client";

import { useCallback, useEffect, useId, useMemo, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
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
  const glowId = `glpJourneyGlow-${gid}`;
  const sheenId = `glpJourneySheen-${gid}`;
  const lineGradId = `glpJourneyLine-${gid}`;
  /** Brand-tinted "data pulse" gradient — a fast-traveling brand-color streak that runs across the line on a 3.6s loop. New post-mount premium touch. */
  const pulseId = `glpJourneyPulse-${gid}`;

  /** Defer the chart paint until after mount so users never see a "lonely gray line" before the area animates in. */
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setRevealed(true), 60);
    return () => window.clearTimeout(id);
  }, []);

  /**
   * Defer all decorative passes (glow line, white sheen, brand pulse) until *after* the area
   * animation completes. Without this, the non-animated overlays (`isAnimationActive=false`)
   * paint instantly while the area is still drawing in, creating a visible "static line on the
   * right" flash that looked unfinished. Aux layers also gate the new "brand pulse" pass.
   */
  const [auxRevealed, setAuxRevealed] = useState(false);
  useEffect(() => {
    if (!revealed) return;
    if (!animate) {
      setAuxRevealed(true);
      return;
    }
    const id = window.setTimeout(() => setAuxRevealed(true), 2500);
    return () => window.clearTimeout(id);
  }, [revealed, animate]);

  const domain = useMemo((): [number, number] => [0, 100], []);

  const lastIndex = points.length - 1;
  const areaDot = useCallback(
    (dotProps: { cx?: number; cy?: number; index?: number }) => {
      const { cx, cy, index } = dotProps;
      if (cx == null || cy == null || index == null) return null;
      const isLast = index === lastIndex;
      if (!isLast) {
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
      }
      /**
       * Final-checkpoint "expensive" halo: two concentric pulses + a crisp fill. Pure SVG
       * `<animate>` so it works without JS and respects `prefers-reduced-motion` (the outer
       * wrapper gates with `animate`, which follows the media query set in the effect below).
       */
      return (
        <g key={`glp-d-${index}`}>
          {animate ? (
            <>
              <circle cx={cx} cy={cy} r={6} fill={brandFill} opacity={0.18}>
                <animate attributeName="r" values="6;16;6" dur="2.4s" repeatCount="indefinite" />
                <animate
                  attributeName="opacity"
                  values="0.35;0;0.35"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx={cx} cy={cy} r={4} fill={brandFill} opacity={0.28}>
                <animate attributeName="r" values="4;10;4" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                <animate
                  attributeName="opacity"
                  values="0.45;0;0.45"
                  dur="2.4s"
                  begin="0.8s"
                  repeatCount="indefinite"
                />
              </circle>
            </>
          ) : null}
          <circle cx={cx} cy={cy} r={5} fill={brandFill} stroke="#fff" strokeWidth={2.5} />
        </g>
      );
    },
    [brandFill, lastIndex, animate],
  );

  if (points.length < 2) return null;

  const compact = variant === "compact";
  const last = points[points.length - 1];
  const first = points[0];
  /**
   * "Final-checkpoint" payoff chip — counts up from 0 → last.progress once the
   * area animation completes, then settles. Inspired by Stripe Climate's annual
   * commitment counter and Linear Insights' "current state" chip: a short, calm
   * payoff that rewards the user for watching the chart draw, communicates the
   * model's destination, and adds perceived precision without competing with
   * the existing line motion.
   */
  const [counterValue, setCounterValue] = useState(0);
  useEffect(() => {
    if (compact) return;
    if (!auxRevealed) {
      setCounterValue(0);
      return;
    }
    if (!animate) {
      setCounterValue(last?.progress ?? 0);
      return;
    }
    const target = last?.progress ?? 0;
    const startedAt = performance.now();
    const duration = 1100;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCounterValue(Math.round(target * eased));
      if (t < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [auxRevealed, animate, last?.progress, compact]);
  const legendStartPair = first?.label === "Start" ? "Month 0" : (first?.label ?? "Month 0");

  /**
   * Both axis captions ("Toward your stated goal" / "Time (months from start)") now render
   * through the *same* HTML path with the *same* `axisCaptionStyle`, so they're visually
   * identical (SVG `<Label>` and HTML text don't share font metrics, which was making the
   * Y caption read larger than the X one).
   */
  const axisCaptionStyle: CSSProperties = {
    fontSize: 11,
    color: "#64748b",
    fontWeight: 600,
    fontFamily: "inherit",
    letterSpacing: 0,
    lineHeight: 1.25,
  };

  return (
    <motion.div
      data-results-chart
      initial={animate && !compact ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`glp-intake-chart-card relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white ring-1 ring-slate-900/[0.04] ${
        compact
          ? "px-3 pb-3 pt-4 shadow-sm sm:px-4"
          : "px-4 pb-5 pt-6 shadow-[0_2px_8px_rgba(15,23,42,0.05),0_12px_40px_-16px_rgba(15,23,42,0.12)] sm:px-6 sm:pb-6 sm:pt-7"
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
          {/**
           * Legend pills are explicitly centered as a single inline-flex group with a tight
           * gap so they read as one cluster — not three items spread to the card edges.
           */}
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
        className={`${compact ? "" : "flex min-w-0 flex-col gap-3 md:flex-row md:items-stretch md:gap-0"}`}
      >
        {!compact ? (
          <>
            {/* Desktop vertical Y caption.
             *
             * The chart card has `sm:px-6` (24px) horizontal padding. Without
             * adjustment, the rotated caption sits ~36px from the card's left
             * edge — visually too much dead air. We pull the caption container
             * left with a negative margin (`md:-ml-3 lg:-ml-4`) so the caption
             * starts ~8–12px from the card edge. The *right* margin on the
             * rotated text (`mr-3` = 12px) preserves breathing room between the
             * caption and the chart, matching the X caption's symmetric vertical
             * padding (mt-3 / mb-3) below. Result: tight on the card edge,
             * generous next to the chart — same numeric gutter as the X axis.
             */}
            <div className="hidden shrink-0 self-stretch flex-col items-center justify-center md:-ml-3 md:flex lg:-ml-4">
              <p
                className="ml-0 mr-3 text-center [writing-mode:vertical-rl] rotate-180"
                style={axisCaptionStyle}
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
            className={`pointer-events-none absolute right-2 top-2 z-30 inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/95 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.04] backdrop-blur-sm transition-all duration-500 ease-out sm:right-3 sm:top-3 ${
              auxRevealed ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
            }`}
            style={{ color: brandFill }}
            aria-hidden
            data-results-chart-final-chip
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: brandFill }}
              aria-hidden
            />
            <span className="text-slate-500 font-medium">Modeled checkpoint</span>
            <span style={{ color: brandFill }}>{counterValue}%</span>
          </div>
        ) : null}
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
                {/* Soft brand-tinted glow under the line, like a luminous neon edge. */}
                <filter id={glowId} x="-10%" y="-30%" width="120%" height="160%">
                  <feGaussianBlur stdDeviation="3.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Brand-tinted "sheen" gradient that travels across the line on a 5.6s loop — only when motion is allowed. */}
                <linearGradient id={lineGradId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={brandFill} stopOpacity={0.85} />
                  <stop offset="50%" stopColor={brandFill} stopOpacity={1} />
                  <stop offset="100%" stopColor={brandFill} stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0">
                    {animate ? (
                      <animate attributeName="offset" values="-0.4;1.0" dur="5.6s" repeatCount="indefinite" />
                    ) : null}
                  </stop>
                  <stop offset="0.05" stopColor="#ffffff" stopOpacity="0.85">
                    {animate ? (
                      <animate attributeName="offset" values="-0.35;1.05" dur="5.6s" repeatCount="indefinite" />
                    ) : null}
                  </stop>
                  <stop offset="0.1" stopColor="#ffffff" stopOpacity="0">
                    {animate ? (
                      <animate attributeName="offset" values="-0.3;1.1" dur="5.6s" repeatCount="indefinite" />
                    ) : null}
                  </stop>
                </linearGradient>
                {/* Brand-tinted "data pulse" gradient — fast, narrow, repeating; offset by 1.8s vs. the white sheen so the two passes never collide. */}
                <linearGradient id={pulseId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={brandFill} stopOpacity="0">
                    {animate ? (
                      <animate attributeName="offset" values="-0.3;1.0" dur="3.6s" begin="1.8s" repeatCount="indefinite" />
                    ) : null}
                  </stop>
                  <stop offset="0.04" stopColor={brandFill} stopOpacity="0.95">
                    {animate ? (
                      <animate attributeName="offset" values="-0.26;1.04" dur="3.6s" begin="1.8s" repeatCount="indefinite" />
                    ) : null}
                  </stop>
                  <stop offset="0.08" stopColor={brandFill} stopOpacity="0">
                    {animate ? (
                      <animate attributeName="offset" values="-0.22;1.08" dur="3.6s" begin="1.8s" repeatCount="indefinite" />
                    ) : null}
                  </stop>
                </linearGradient>
              </defs>
              {/* Very subtle grid — almost invisible until the eye fixates. No solo dashed reference line. */}
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
              {/* X-axis caption is rendered as HTML below the chart so it visually matches the rotated Y caption pixel-for-pixel. */}
              <YAxis
                domain={domain}
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                width={40}
              />
              {/**
               * Custom tooltip content avoids the duplicate-row problem caused by overlay series
               * (glow + sheen + brand-pulse all share `dataKey="progress"`). We pick the first
               * payload row and render exactly one summary line.
               */}
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
              {revealed && auxRevealed && !compact ? (
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke={brandFill}
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity={0.16}
                  dot={false}
                  isAnimationActive={false}
                  filter={`url(#${glowId})`}
                  name="glow"
                />
              ) : null}
              {revealed ? (
                <Area
                  type="monotone"
                  dataKey="progress"
                  stroke={brandFill}
                  strokeWidth={2.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill={`url(#${gradId})`}
                  isAnimationActive={animate}
                  animationDuration={animate ? 2400 : 0}
                  animationEasing="ease-in-out"
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                  dot={areaDot as never}
                />
              ) : null}
              {/* Premium sheen overlay — a thin white highlight that slides across the line on a 5.6s loop. Gated until area finishes drawing in to avoid the static "tail" flash. */}
              {revealed && auxRevealed && animate && !compact ? (
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke={`url(#${sheenId})`}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={false}
                  isAnimationActive={false}
                  name="sheen"
                />
              ) : null}
              {/**
               * NEW: brand-tinted "data pulse" layer — a fast, brand-color streak that runs
               * left-to-right across the line on a 3.6s loop after the area has finished
               * drawing. Reads as a "live data" / momentum signal layered on top of the white
               * sheen, without competing with it (different timing + color).
               */}
              {revealed && auxRevealed && animate && !compact ? (
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke={`url(#${pulseId})`}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={false}
                  isAnimationActive={false}
                  name="pulse"
                />
              ) : null}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
      {!compact ? (
        <p
          className="mx-auto mt-3 mb-3 w-full text-center"
          style={axisCaptionStyle}
          data-results-chart-x-label
        >
          Time (months from start)
        </p>
      ) : null}
      {!compact ? (
        <p className="border-t border-slate-100 px-1 pt-3 text-center text-[11px] leading-relaxed text-slate-500 sm:px-2">
          Last checkpoint shown: {last?.label} at ~{last?.progress}% toward your stated goal (example only).
        </p>
      ) : null}
    </motion.div>
  );
}
