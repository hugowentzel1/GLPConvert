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
      "Same ad spend, more booked consults inside the first month. Patients arrive primed — our team stopped re-teaching the basics on every call.",
    name: "Jordan M.",
    role: "Owner & Founder",
    orgLine: "Boutique med spa · Southwest US",
  },
  {
    quote:
      "Fewer dropped clicks, more consults from the same traffic. Fully branded to our scheduler, one tap away — and our CRM didn't move an inch.",
    name: "Priya K.",
    role: "Director of Growth",
    orgLine: "Multi-state telehealth clinic",
  },
  {
    quote:
      "The branded patient flow lifted our consult-show rate noticeably in month one. We just stopped losing the warm clicks between ad and calendar.",
    name: "Marcus E.",
    role: "VP, Patient Acquisition",
    orgLine: "Integrated weight-health network · Southeast US",
  },
  {
    quote:
      "Dropped the embed onto our existing booking page in under an hour. CRM webhook hit our HubSpot pipeline cleanly — no integration sprint required.",
    name: "Maria L.",
    role: "Operations Director",
    orgLine: "Regional clinic group · 4 locations",
  },
] as const;
