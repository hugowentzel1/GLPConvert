"use client";

export type CarePackagePublic = {
  title: string;
  priceLabel: string | null;
  items: string[];
};

/**
 * Care-package tiles on intake step 2 — extracted so the funnel can render
 * it immediately after the chart (CRO: "wow" chart → concrete offer →
 * journey milestones → detail).
 */
export default function IntakeStep2CarePackageStrip({
  company,
  brandFill,
  packages,
}: {
  company: string;
  brandFill: string;
  packages: CarePackagePublic[] | null | undefined;
}) {
  const configured = Array.isArray(packages) && packages.length > 0;

  return (
    <div
      className="w-full mt-6 sm:mt-7"
      data-results-care-package
      data-care-package-source={configured ? "configured" : "placeholder"}
    >
      {configured ? (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Care packages · {company}
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-3.5" data-results-care-package-real>
            {(packages ?? []).slice(0, 3).map((pkg, idx) => (
              <li
                key={`${pkg.title}-${idx}`}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4"
              >
                <span
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ring-2 ring-white"
                  style={{ backgroundColor: brandFill }}
                  aria-hidden
                >
                  {idx + 1}
                </span>
                <p className="text-[13px] font-semibold leading-snug text-slate-900">{pkg.title}</p>
                {pkg.priceLabel ? (
                  <p className="text-[12px] font-semibold leading-snug" style={{ color: brandFill }}>
                    {pkg.priceLabel}
                  </p>
                ) : null}
                {pkg.items.length > 0 ? (
                  <ul className="mt-1 space-y-1.5 text-[11.5px] leading-snug text-slate-600">
                    {pkg.items.slice(0, 3).map((it, j) => (
                      <li key={j} className="flex items-start gap-1.5">
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="mt-0.5 h-3 w-3 shrink-0"
                          style={{ color: brandFill }}
                          aria-hidden
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.07 7.142a1 1 0 0 1-1.42.006l-3.93-3.93a1 1 0 1 1 1.414-1.414l3.215 3.214 6.37-6.426a1 1 0 0 1 1.415-.006Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Pricing and inclusions set by <span className="font-medium text-slate-700">{company}</span>. General
            information only — not a quote.
          </p>
        </>
      ) : (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Sample care package · configured by {company}
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-3.5">
            {(
              [
                {
                  label: "Provider review",
                  desc: "Licensed clinician reviews your goals + history.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104A48.55 48.55 0 0 1 12 3c.752 0 1.498.034 2.25.104M9.75 3.104A48.55 48.55 0 0 0 7.5 3.5M14.25 3.104v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5M14.25 3.104a48.41 48.41 0 0 1 2.25.395M19 14.5l-1.65 4.95a1.5 1.5 0 0 1-1.422 1.05H8.072a1.5 1.5 0 0 1-1.422-1.05L5 14.5M19 14.5H5"
                    />
                  ),
                },
                {
                  label: "Personalized plan",
                  desc: "Protocol + check-ins from your provider.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                    />
                  ),
                },
                {
                  label: "Medication, if prescribed",
                  desc: "Coordination with your clinic, your pharmacy.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
                    />
                  ),
                },
              ] as const
            ).map((tile) => (
              <li
                key={tile.label}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4"
              >
                <span
                  className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm ring-2 ring-white"
                  style={{ backgroundColor: brandFill }}
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={1.85}
                    className="h-4 w-4"
                  >
                    {tile.icon}
                  </svg>
                </span>
                <p className="text-[13px] font-semibold leading-snug text-slate-900">{tile.label}</p>
                <p className="text-xs leading-relaxed text-slate-600">{tile.desc}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Preview only — your actual package, pricing, and inclusions are set by{" "}
            <span className="font-medium text-slate-700">{company}</span>. Not a quote.
          </p>
        </>
      )}
    </div>
  );
}
