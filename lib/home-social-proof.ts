/**
 * Home-page cards: reuse intake demo quote strings; add full names + titles here only.
 */
import { INTAKE_DEMO_HERO_QUOTES } from "@/lib/intake-demo-quotes";

export type HomeSocialProofCard = {
  /** Verbatim or pilot-disclosed copy — never implied third-party reviews. */
  quote: string;
  displayName: string;
  role: string;
  orgLine: string;
  /** Single-line outcome headline — labeled as pilot feedback in UI. */
  outcomeHint: string;
};

export const HOME_SOCIAL_PROOF_CARDS: HomeSocialProofCard[] = [
  {
    quote: INTAKE_DEMO_HERO_QUOTES[0].quote,
    displayName: "Jordan Mercer",
    role: "Owner & Managing Partner",
    orgLine: INTAKE_DEMO_HERO_QUOTES[0].orgLine,
    outcomeHint: "More booked consults in month one · pilot cohort",
  },
  {
    quote: INTAKE_DEMO_HERO_QUOTES[1].quote,
    displayName: "Priya Krishnan",
    role: "Director of Growth & Acquisition",
    orgLine: INTAKE_DEMO_HERO_QUOTES[1].orgLine,
    outcomeHint: "Less funnel leakage · pilot cohort",
  },
  {
    quote:
      "We shared the personalized demo in Slack; clinical leadership reviewed it on a phone in minutes. We activated from email the same night — no procurement loop.",
    displayName: "Marcus Ellison",
    role: "VP, Patient Acquisition & Partnerships",
    orgLine: "Integrated weight-health network, Southeast US",
    outcomeHint: "Self-serve evaluation → fast decision · pilot cohort",
  },
];
