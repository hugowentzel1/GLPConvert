# GLPConvert intake question bank (v1)

Canonical question set for GLP-1 intake in a compliance-safe format.

## Rules

- Use structured options first, free text last.
- Do not ask for diagnosis text in v1.
- Do not claim eligibility in prompts.
- Keep questions plain-language and low-friction.

## Intake blocks

## 1) Intent and timeline

- `goal` (required): What are you mainly hoping to explore?
  - sustainable weight management
  - metabolic health / energy
  - not sure yet
- `timeline` (required): How soon are you looking to speak with the clinic?
  - asap
  - within 2 weeks
  - just exploring

## 2) Program context

- `prior_programs` (optional): Have you tried a structured program before?
  - no
  - lifestyle/coaching
  - prescription in the past
  - prefer not to say
- `budget_band` (optional): Which monthly range feels realistic?
  - under 150
  - 150-300
  - 300-500
  - prefer not to say

## 3) Logistics

- `contact_pref` (required): Preferred contact method?
  - phone
  - email
  - text
- `best_time` (optional): Best time to reach you?
  - morning
  - afternoon
  - evening

## 4) Consent

- `consent_terms` (required boolean): I understand this tool is educational and booking-oriented, not medical advice.
- `consent_contact` (required boolean): I consent to be contacted about my inquiry.
- `consent_marketing` (optional boolean): I consent to marketing updates.

## Result language template

- Header: "Suggested next step"
- Body: "Based on your answers, many patients explore **[program]**."
- Clinical boundary: "A licensed provider will determine final eligibility."
- Price line: "Typical range: **$X-$Y**. Final pricing confirmed by clinic."

