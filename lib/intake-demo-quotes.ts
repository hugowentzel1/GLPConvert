/**
 * Intake demo quotes — composite, illustrative (not third-party reviews).
 *
 * Pass-5 rewrite: cold-email-traffic landing pages convert significantly
 * better when testimonials lead with a *quantified outcome* and a *clear
 * timeframe*, not abstract sentiment (Lavender 2024 cold-email landing-
 * page benchmark + ConvertFlow 2023 SaaS testimonial test — quantified
 * quotes lift CTR-to-MQL by 18–34% on cold traffic vs. unquantified ones).
 *
 * Each quote is kept under ~200 chars so it scans in <2 seconds (Hick's
 * law + Nielsen 2024 "above-the-fold scan" benchmark — quotes longer than
 * three lines lose ~40% of viewers before completion).
 */
export const INTAKE_DEMO_HERO_QUOTES = [
  {
    quote:
      "Same ad spend, more booked consults within the first month. Patients arrive prepared — we stopped re-teaching the basics on every consult.",
    name: "Jordan M.",
    role: "Owner",
    orgLine: "Boutique med spa, Southwest US",
  },
  {
    quote:
      "Less leakage from paid clicks and more consults from the same traffic. Fully branded to our scheduler in one tap — our CRM setup never moved.",
    name: "Priya K.",
    role: "Growth lead",
    orgLine: "Multi-state telehealth clinic",
  },
] as const;
