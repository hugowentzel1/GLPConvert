"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/** Modeled % progress toward stated weight goal; optional band = illustrative uncertainty from monthly range inputs. */
export type JourneyProgressPoint = {
  label: string;
  progress: number;
  month: number;
  progressLow?: number;
  progressHigh?: number;
};

type ChartContext = "intake" | "report";
/** Patient chart vs clinic previewing what patients see (demo). */
export type ChartAudience = "patient" | "demo";

function ChartTooltip({
  active,
  payload,
  label,
  brandFill,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string; dataKey?: string }>;
  label?: string | number;
  brandFill: string;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  const v = typeof row?.value === "number" ? row.value : Number(row?.value);
  if (Number.isNaN(v)) return null;
  const labelText = label === undefined || label === null ? "" : String(label);
  return (
    <div
      className="rounded-xl border border-slate-200/95 bg-white/98 px-3.5 py-2.5 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.18)] backdrop-blur-sm"
      style={{ borderLeftWidth: 3, borderLeftColor: brandFill }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{labelText}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">{v}% toward stated goal</p>
      <p className="mt-1 text-[10px] leading-snug text-slate-500">Illustrative model — not a medical forecast.</p>
    </div>
  );
}

/**
 * Illustrative journey curve + optional uncertainty band.
 * Demo audience: copy speaks to clinic buyers previewing the patient UI.
 */
export default function GlpJourneyProgressChart({
  points,
  brandFill,
  variant = "default",
  size = "default",
  context = "intake",
  audience = "patient",
  statsRow,
  /** Buyer demo: taller plot, thicker line, calmer grid — flagship “sales” chart. */
  showcase = false,
  /** Parent provides outer shell (e.g. step 2) — drop duplicate border/shadow. */
  embedded = false,
}: {
  points: JourneyProgressPoint[];
  brandFill: string;
  variant?: "default" | "compact";
  /** Hero = taller plot + stronger hierarchy (intake step 2 flagship). */
  size?: "default" | "hero";
  context?: ChartContext;
  audience?: ChartAudience;
  statsRow?: { label: string; value: string }[];
  showcase?: boolean;
  embedded?: boolean;
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
  const gradId = `glpJourneyLineGrad-${gid}`;

  const domain = useMemo((): [number, number] => [0, 100], []);

  const chartData = useMemo(() => {
    return points.map((p) => {
      const lo = p.progressLow ?? p.progress;
      const hi = p.progressHigh ?? p.progress;
      return {
        ...p,
        bandBase: lo,
        bandHeight: Math.max(0, hi - lo),
      };
    });
  }, [points]);

  if (points.length < 2) return null;

  const compact = variant === "compact";
  const isHero = size === "hero";
  const useShowcase = Boolean(showcase && isHero && !compact);
  const last = points[points.length - 1];
  const first = points[0];
  const hasBand = points.some(
    (p) =>
      typeof p.progressLow === "number" &&
      typeof p.progressHigh === "number" &&
      (p.progressHigh ?? 0) > (p.progressLow ?? 0),
  );

  const footNote =
    context === "report"
      ? "Illustrative checkpoint model for discussion — not a clinical forecast or guarantee."
      : "General information only — your licensed provider sets targets and pace.";

  const eyebrow =
    audience === "demo"
      ? useShowcase
        ? "Where clicks become consults"
        : "Patient-facing preview"
      : "Your trajectory";
  const title =
    audience === "demo"
      ? useShowcase
        ? "Illustrative momentum toward their stated goal"
        : "Illustrative progress toward their stated goal"
      : "How progress toward your stated goal can build over time";
  const explainer =
    audience === "demo"
      ? useShowcase
        ? "One living curve plus a range band—shaped by the same questions you’ll ask on your site. Education only."
        : "Shown to leads as education only — not a promise. Shaded band reflects input range."
      : "Vertical axis: percent of your stated goal. Horizontal: months from start. Illustrative—not a clinical forecast.";

  const shellClass = embedded
    ? "border-0 bg-transparent shadow-none ring-0"
    : "border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/40 to-white shadow-[0_20px_50px_-18px_rgba(15,23,42,0.16),inset_0_1px_0_0_rgba(255,255,255,0.9)] ring-1 ring-slate-900/[0.06]";

  return (
    <div
      data-results-chart
      className={`glp-intake-chart-card relative w-full overflow-hidden rounded-2xl ${shellClass} ${
        compact
          ? "px-3 pb-3 pt-4 shadow-sm sm:px-4"
          : "px-4 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-7"
      }`}
    >
      {!embedded ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/80 to-transparent opacity-90"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-slate-300/70 to-transparent"
            aria-hidden
          />
        </>
      ) : null}

      {!compact ? (
        <div className="relative mb-5 space-y-3 px-1 text-center sm:mb-6 sm:px-2">
          <p
            className={`mx-auto max-w-xl rounded-lg border border-slate-200/95 bg-slate-50/90 text-center font-semibold leading-snug text-slate-700 ring-1 ring-slate-900/[0.04] ${
              useShowcase ? "px-3 py-1.5 text-[10px] sm:text-[11px]" : "px-3 py-2 text-[11px] sm:text-xs"
            }`}
            data-chart-model-banner
          >
            Illustrative model from inputs—not a medical forecast or guarantee.
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500" data-chart-eyebrow>
            {eyebrow}
          </p>
          <h3
            className={`font-semibold leading-snug tracking-tight text-slate-900 ${isHero ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}
          >
            {title}
          </h3>
          {statsRow && statsRow.length > 0 ? (
            <div className="mx-auto mt-4 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3">
              {statsRow.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-slate-200/85 bg-white/95 px-2 py-2.5 text-center shadow-sm ring-1 ring-slate-900/[0.03] transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:px-3 sm:py-3"
                  style={{ borderLeftWidth: 3, borderLeftColor: brandFill }}
                >
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px]">{s.label}</p>
                  <p className="mt-1 text-sm font-bold tabular-nums tracking-tight text-slate-900 sm:text-base">{s.value}</p>
                </div>
              ))}
            </div>
          ) : null}
          <p className="mx-auto max-w-lg text-sm font-normal leading-relaxed text-slate-600 sm:text-[15px]">
            <span className="font-medium text-slate-800">Illustrative only.</span> {explainer}{" "}
            {hasBand && audience === "patient"
              ? "Shaded band: modeled range from your inputs — not individual medical advice."
              : null}
          </p>
          <div className="mx-auto mt-3 flex max-w-md flex-col items-center gap-2 text-[11px] leading-relaxed text-slate-600 sm:mt-4 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
              Start · {first?.label ?? "Month 0"}
            </span>
            {hasBand ? (
              <span className="inline-flex items-center gap-2">
                <span
                  className="h-3 w-4 rounded-sm shadow-sm ring-1 ring-white"
                  style={{ backgroundColor: `${brandFill}28` }}
                  aria-hidden
                />
                Range
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: brandFill }} aria-hidden />
              Midpoint path
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-0.5 rounded-full bg-slate-200" aria-hidden />
              100% = goal
            </span>
          </div>
        </div>
      ) : null}
      <div
        className={`relative ${
          compact
            ? "h-[200px] w-full sm:h-[220px]"
            : isHero
              ? useShowcase
                ? "h-[360px] w-full sm:h-[420px]"
                : "h-[300px] w-full sm:h-[340px]"
              : "h-[248px] w-full sm:h-[268px]"
        }`}
        style={{
          minHeight: compact ? 200 : isHero ? (useShowcase ? 360 : 300) : 248,
          minWidth: 0,
          isolation: "isolate",
          ...(useShowcase && !compact
            ? {
                background: `radial-gradient(ellipse 85% 70% at 50% 115%, color-mix(in srgb, ${brandFill} 18%, transparent), transparent 55%), linear-gradient(180deg, rgba(248,250,252,0.9) 0%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0) 100%)`,
              }
            : isHero && !compact
              ? {
                  background:
                    "linear-gradient(180deg, rgba(248,250,252,0.65) 0%, rgba(255,255,255,0) 55%)",
                }
              : {}),
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded-xl sm:rounded-2xl ring-1 ring-inset ring-slate-900/[0.04]"
          aria-hidden
        >
          <div
            className={`glp-intake-chart-shimmer absolute inset-0 ${useShowcase ? "opacity-[0.08]" : "opacity-50"}`}
          />
        </div>
        <ResponsiveContainer
          className="relative z-[3]"
          width="100%"
          height="100%"
          minHeight={compact ? 200 : isHero ? (useShowcase ? 360 : 300) : 248}
          minWidth={0}
        >
          <ComposedChart
            data={chartData}
            margin={{
              top: useShowcase ? 22 : 14,
              right: compact ? 6 : useShowcase ? 18 : 12,
              left: compact ? 4 : useShowcase ? 8 : 8,
              bottom: compact ? 8 : useShowcase ? 22 : 14,
            }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={brandFill} stopOpacity={useShowcase ? 0.58 : 0.4} />
                <stop offset="55%" stopColor={brandFill} stopOpacity={useShowcase ? 0.2 : 0.12} />
                <stop offset="100%" stopColor={brandFill} stopOpacity={useShowcase ? 0.04 : 0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray={useShowcase ? "2 10" : "3 6"}
              vertical={false}
              stroke={useShowcase ? "#f1f5f9" : "#e2e8f0"}
            />
            <ReferenceLine y={50} stroke="#e8ecf1" strokeDasharray="4 6" strokeWidth={1} ifOverflow="visible" />
            <ReferenceLine
              y={100}
              stroke={brandFill}
              strokeOpacity={useShowcase ? 0.35 : 0.22}
              strokeDasharray="6 4"
              strokeWidth={useShowcase ? 1.5 : 1}
              ifOverflow="visible"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: useShowcase ? 11 : 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              height={compact ? 36 : 44}
              tickMargin={6}
            >
              {!compact ? (
                <Label position="bottom" offset={0} style={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}>
                  Time (months from start)
                </Label>
              ) : null}
            </XAxis>
            <YAxis
              domain={domain}
              tick={{ fontSize: useShowcase ? 11 : 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              width={compact ? 44 : 52}
              ticks={[0, 25, 50, 75, 100]}
            >
              {!compact ? (
                <Label
                  angle={-90}
                  position="insideLeft"
                  style={{ fontSize: 11, fill: "#64748b", fontWeight: 600, textAnchor: "middle" }}
                >
                  Progress toward goal (%)
                </Label>
              ) : null}
            </YAxis>
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltip active={active} payload={payload} label={label} brandFill={brandFill} />
              )}
              cursor={{ stroke: `${brandFill}55`, strokeWidth: 1 }}
            />
            {hasBand ? (
              <>
                <Area
                  type="monotone"
                  dataKey="bandBase"
                  stackId="range"
                  stroke="none"
                  fill="transparent"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="bandHeight"
                  stackId="range"
                  stroke="none"
                  fill={brandFill}
                  fillOpacity={useShowcase ? 0.24 : 0.16}
                  isAnimationActive={false}
                />
              </>
            ) : null}
            <Area
              type="natural"
              dataKey="progress"
              name="progress"
              stroke={brandFill}
              strokeWidth={compact ? 2.25 : useShowcase ? 5 : isHero ? 3.25 : 2.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${gradId})`}
              isAnimationActive={animate}
              animationDuration={animate ? (useShowcase ? 2000 : 2600) : 0}
              animationEasing="ease-out"
              activeDot={{ r: useShowcase ? 9 : 6, strokeWidth: 2, stroke: "#fff", fill: brandFill }}
              dot={(dotProps) => {
                const { cx, cy, index } = dotProps as {
                  cx?: number;
                  cy?: number;
                  index?: number;
                };
                if (cx == null || cy == null) return <g />;
                const isLast = index === chartData.length - 1;
                const isFirst = index === 0;
                if (useShowcase && !compact && !isFirst && !isLast) return <g />;
                const r = compact ? 3 : useShowcase && isLast ? 8 : useShowcase ? 4 : isHero ? 3.5 : 3.5;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={brandFill}
                    stroke="#fff"
                    strokeWidth={isLast && useShowcase ? 3 : 2}
                    style={
                      useShowcase && isLast
                        ? { filter: `drop-shadow(0 3px 14px ${brandFill}88)` }
                        : undefined
                    }
                  />
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {!compact ? (
        <div className="relative mt-4 space-y-2 border-t border-slate-100/90 px-1 text-center sm:px-2">
          <p className="text-[11px] leading-relaxed text-slate-500">
            Last checkpoint: {last?.label} · ~{last?.progress}% toward stated goal (example only).
          </p>
          {audience === "demo" && useShowcase ? (
            <p
              className="mx-auto max-w-lg text-[11px] leading-relaxed text-slate-600 sm:text-xs"
              data-chart-confidence-line
            >
              Most patients with similar goals follow a path within this range when consistent — education only, not a
              promise.
            </p>
          ) : null}
          <p className="text-[10px] font-medium leading-relaxed text-slate-500">{footNote}</p>
        </div>
      ) : null}
    </div>
  );
}
