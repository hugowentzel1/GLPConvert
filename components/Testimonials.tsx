import * as React from "react";
import AvatarInitials from "./AvatarInitials";

type Quote = {
  quote: string;
  name: string;
  role: string;
  orgLine: string;
  verified?: boolean;
};

/** Composite-style quotes for buyer social proof — not verified clinical outcomes. */
const QUOTES: Quote[] = [
  {
    quote:
      "Our ‘interested in GLP-1s’ clicks used to die on a generic form. Patients now self-educate on process and pricing before they book — fewer no-shows, less price shock.",
    name: "Jordan M.",
    role: "Owner",
    orgLine: "Boutique med spa, Southwest US",
    verified: true,
  },
  {
    quote:
      "We white-label the intake on a dedicated lander and embed it on our site. Same flow everywhere; leads land in HubSpot with readiness tags — easy pilot to justify.",
    name: "Priya K.",
    role: "Growth lead",
    orgLine: "Multi-state telehealth clinic",
    verified: true,
  },
  {
    quote:
      "Buyers open the personalized demo link and immediately see what it would look like on their own domain. Demo-to-checkout was the whole pitch — we didn’t need a deck.",
    name: "Chris L.",
    role: "Founder",
    orgLine: "B2B SaaS (agency resale partner)",
    verified: true,
  },
  {
    quote:
      "Patients aren’t asking ‘what is semaglutide’ in the first five minutes anymore — they’ve already scanned the path overview before they book. Consults feel more serious and prepared.",
    name: "Taylor S.",
    role: "Clinical ops",
    orgLine: "Regional weight-loss program",
    verified: true,
  },
];

export default function Testimonials() {
  return (
    <section
      aria-label="Customer testimonials"
      className="mx-auto max-w-6xl mt-8 grid gap-6 sm:grid-cols-2"
      data-testid="demo-testimonials"
    >
      <p className="sm:col-span-2 text-center text-xs text-slate-500">
        Illustrative clinic-operator perspectives for positioning — not guaranteed results or endorsements.
      </p>
      {QUOTES.map((q) => (
        <article
          key={q.quote.slice(0, 32)}
          className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
          data-testid="testimonial-card"
        >
          <blockquote>
            <p className="text-slate-900 text-[17px] leading-snug mb-4 max-w-[62ch]">
              &ldquo;{q.quote}&rdquo;
            </p>
          </blockquote>

          <figcaption className="flex flex-col items-center text-center gap-2.5">
            <div className="flex items-center justify-center gap-3 w-full">
              <AvatarInitials name={q.name} size={40} variant="duo" />
              <div className="text-slate-900 font-semibold leading-5 flex items-center">{q.name}</div>
            </div>
            <div className="text-slate-500 text-sm flex items-center gap-2 flex-wrap justify-center">
              <span>{q.role}</span>
              <span aria-hidden="true">•</span>
              <span>{q.orgLine}</span>
              {q.verified && (
                <>
                  <span aria-hidden="true">•</span>
                  <span
                    data-testid="verified-pill"
                    title="Composite quote for marketing — not a third-party verification"
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                  >
                    <span className="text-slate-500" aria-hidden="true">
                      ✓
                    </span>
                    Illustrative
                  </span>
                </>
              )}
            </div>
          </figcaption>
        </article>
      ))}
    </section>
  );
}
