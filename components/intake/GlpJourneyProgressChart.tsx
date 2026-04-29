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
 * Y-axis caption ("Toward your stated goal") visual centering — the rotated
 * text now occupies a fixed-width column (`w-10`/`w-12`) flanked by
 * symmetrical horizontal padding. We removed the previous "negative left
 * margin + asymmetric right padding" hack which left the caption hugging
 * the card edge with a yawning gap on the chart side. Symmetric column
 * means the caption sits *exactly between* the card edge and the plot
 * area — matching the X-axis caption's vertical rhythm and removing the
 * "weird floating label" tension the buyer flagged. (Material 3 chart
 * spec: "axis labels share equal margins from the chart and the
 * surrounding container.")
 */

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
   * Reveal-scan runs once per browser tab session only — repeat step-2 visits
   * in the same session skip it (pass 8 clutter reduction; Tufte data-ink).
   */
  const [showRevealScan, setShowRevealScan] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("glp_intake_chart_reveal_scan");
      setShowRevealScan(!seen);
      if (!seen) sessionStorage.setItem("glp_intake_chart_reveal_scan", "1");
    } catch {
      setShowRevealScan(true);
    }
  }, []);

  /** Animated % ticker — syncs to the 2.4s area draw (Stripe / data-viz “count-up” payoff without extra chart layers). */
  const targetProgressPct = points.length >= 2 ? (points[points.length - 1]?.progress ?? 0) : 0;
  const [displayPct, setDisplayPct] = useState(0);
  useEffect(() => {
    if (points.length < 2) return;
    if (!revealed || !animate) {
      setDisplayPct(targetProgressPct);
      return;
    }
    setDisplayPct(0);
    const dur = 2400;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const eased = t * t * (3 - 2 * t);
      setDisplayPct(Math.round(eased * targetProgressPct));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed, targetProgressPct, animate, points.length]);

  /**
   * Decorative passes (glow halo, brand-color "sheen", brand "data pulse") now
   * paint at the *same instant* as the area, so the line already carries its
   * full final boldness, brand color saturation, and stroke thickness from
   * frame one. Apple Keynote / Linear changelog / Stripe Dashboard reveals all
   * paint the FINAL stroke weight from frame 1 and let the *left-to-right
   * sweep* be the animation, not the styling. Buyer feedback: previously the
   * line looked "thin / bare" for ~2.5s then thickened — a "loading flash"
   * that hurt the premium feel. The static overlays sit *under* the
   * area-fill mask so the right-side "tail" reads as part of the modeled path
   * (correct visualization-design read) rather than as a glitch.
   */
  const auxRevealed = revealed;

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

  const compact = variant === "compact";
  /**
   * Removed the always-visible "Modeled checkpoint X%" floating chip. The
   * tooltip now owns that information on hover (one source of truth) and the
   * line's terminal "halo dot" still anchors the visual eye there. The chip
   * was duplicating the final point and competing with the headline number
   * in the Investment summary tile right below the chart, which made the
   * card feel busy/scattered — flagged by the buyer as "weird shading".
   * (Edward Tufte "data-ink ratio"; NN/g 2024 dashboard chart guidance:
   * "remove repeating values that already appear in the surrounding
   * summary tiles or tooltip.")
   */

  if (points.length < 2) return null;

  const last = points[points.length - 1];
  const first = points[0];
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
        className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-slate-200 to-transparent"
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
        className={`${compact ? "" : "flex min-w-0 flex-col gap-2 md:flex-row md:items-stretch md:gap-1.5"}`}
      >
        {!compact ? (
          <>
            {/* Desktop vertical Y caption — fixed-width column flanked by
             * symmetric padding so the rotated text sits *exactly between* the
             * card edge and the plot area. (Material 3 chart axis spec.) Pass 2:
             * tightened to `w-8` so the caption sits closer to the chart's
             * percent ticks, removing the prior "floating in space" feel and
             * matching the X caption's vertical breathing room (mt-2.5/mb-2). */}
            <div className="hidden w-7 shrink-0 self-stretch flex-col items-center justify-center px-0.5 md:flex md:w-8">
              <p
                className="text-center [writing-mode:vertical-rl] rotate-180"
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
            compact ? "h-[200px] w-full sm:h-[220px]" : "h-[244px] w-full sm:h-[268px]"
          }`}
          style={{ minHeight: compact ? 200 : 244, minWidth: 0, isolation: "isolate" }}
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
        {/**
         * NEW signature premium moment — a brand-tinted vertical "scan line" that
         * sweeps left→right across the chart exactly once when the area starts
         * drawing in. The Apple Keynote chart-reveal / Linear changelog / Vercel
         * Analytics first-load pattern: a single, one-shot reveal sweep that
         * communicates "we just computed this for you" without adding another
         * looping animation that would compete with the brand pulse / sheen /
         * sparkle layers.
         *
         * - Triggered at `revealed` (mount + 60ms) so it lands while the area
         *   is drawing in (2.4s), giving the appearance of "the line is being
         *   painted by the scan".
         * - Pure CSS animation with `animation-iteration-count: 1` — fires
         *   exactly once, then the layer becomes invisible (no perpetual
         *   distraction).
         * - Brand-color stop with `mix-blend-mode: screen` so it brightens
         *   over the existing line without obscuring data.
         * - Honors `prefers-reduced-motion: reduce` (CSS media query keeps
         *   the layer fully transparent).
         */}
        {!compact && revealed && showRevealScan === true ? (
          <div
            className="glp-intake-chart-reveal-scan pointer-events-none absolute inset-0 z-[19] overflow-hidden rounded-xl sm:rounded-2xl"
            style={{ ["--glp-scan-color" as string]: brandFill }}
            aria-hidden
            data-results-chart-scan
          />
        ) : null}
        <div className="relative z-10 h-full w-full rounded-xl sm:rounded-2xl">
          <ResponsiveContainer
            className="relative h-full w-full"
            width="100%"
            height="100%"
            minHeight={compact ? 200 : 244}
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
          className="mx-auto mt-2.5 mb-2 w-full text-center"
          style={axisCaptionStyle}
          data-results-chart-x-label
        >
          Time (months from start)
        </p>
      ) : null}
      {!compact ? (
        <p className="mt-3 border-t border-slate-200 px-1 pt-3 text-center text-[11px] leading-relaxed text-slate-500 sm:px-2">
          Last checkpoint shown: {last?.label} at <span className="tabular-nums" data-results-chart-live-pct>~{points.length >= 2 ? displayPct : 0}%</span> toward your stated goal (example only).
        </p>
      ) : null}
    </motion.div>
  );
}
