# Cursor Prompt — Sunspire Consultation CTA (Book Your Consultation + Call-Optimized Modal)

**Paste the block below directly into Cursor.**

The report page keeps **"Book your consultation"** as the CTA. The **modal copy** is research-driven to fit the next step being a **call** between the business and the customer: set expectations, timeline, and what the call is for.

**Sources for modal (call as next step):**
- **Gravity Forms** — Setting Clear Expectations with Lead Gen Forms: "What happens next?" is the key question; use clear language and a **reasonable timeline** so users know when they’ll be contacted.  
  https://www.gravityforms.com/blog/expectations-lead-gen-contact-forms/
- **Blogs That Sell** — Consultant landing pages: Make the CTA **specific** (what the call involves, how long, what they’ll get); remove objections (e.g. "No pitch unless you ask").  
  https://blogsthatsell.com/blog/programmatic/landing-page-copywriting-tips-for-consultants
- **Prospeo / Wisepops** — Book-a-call modals: "Book" or "Schedule" signals **buyer control**; keep forms short (3–5 fields); tell visitors what the call covers.  
  https://prospeo.io/s/book-a-demo | https://wisepops.com/blog/popup-best-practice
- **Solar installers (Wayne’s Solar, Full Spectrum Solar):** "One of our solar pros will **contact you to schedule** your free consultation"; "will **call or email within 2 business days**."  
  https://www.waynesolar.com/free-consultation/ | https://fullspectrumsolar.com/consultation-request
- **QuickColdCalls / RevenueHero:** Specific CTAs ("Schedule a 15-minute strategy call") and clear **what happens next** after submit (e.g. "we’ll call you") outperform vague "Let’s connect."

---

## Paste from here ↓

```text
You are working on Sunspire, a production-grade white-label solar quote / lead-conversion SaaS used by solar installers to convert homeowners after they receive a solar estimate/report.

Treat this as enterprise production UI work.

MISSION

Improve two things with extremely high precision:

1. the paid report-page consultation section at the bottom of the report page
2. the consultation modal opened from that section

There are two problems to solve:

A. the section is still not vertically balanced
B. the next step is unclear and not conversion-optimized for a homeowner considering purchasing solar panels

The **report page** keeps a "Book your consultation" framing. The **modal** must make it clear that the next step is a **call** between the business and the customer, with expectations and timeline set so the popup converts.

---

CRITICAL REPORT-PAGE LAYOUT CONSTRAINT

For the bottom consultation section on the report page:

DO NOT change ANY horizontal layout or horizontal spacing.

That means absolutely do not change:

- width
- max-width
- left/right padding
- left/right margin
- x-position of any element
- horizontal alignment
- horizontal gap between buttons
- horizontal structure
- card width
- inner content width
- button horizontal placement
- divider horizontal placement
- secondary button row horizontal placement

You may ONLY change:

- margin-top
- margin-bottom
- padding-top
- padding-bottom
- vertical gap
- min-height / height if needed
- vertical alignment if it does not affect horizontal geometry

Think of the section as having its **x-axis frozen**.

Only improve the **y-axis (vertical rhythm)**.

---

MODAL COPY — RESEARCH (CALL AS NEXT STEP)

The next step is a **call** between the installer and the homeowner. Modal copy must:

1. **Set expectations:** Say clearly that the company will **call** (or reach out) to schedule the consultation. (Gravity Forms, solar examples: Wayne's Solar, Full Spectrum.)
2. **Give a timeline:** e.g. "within 1–2 business days" so users know when to expect contact. (Gravity Forms: "Give a reasonable timeline.")
3. **Say what the call is for:** Answer questions, discuss the estimate, go over next steps—so it doesn’t feel vague. (Blogs That Sell: "Tell them exactly what the call involves.")
4. **Reduce friction:** Short form, clear CTA button ("Request consultation" / "Book my call"), no-obligation language. (Prospeo, Wisepops.)

Avoid vague phrasing like "We’ll be in touch soon" or "Someone will contact you." Be specific: who contacts, how (call/email), and when.

---

COPY TO IMPLEMENT

REPORT PAGE

Heading:

Next step: book your consultation

Supporting paragraph:

You have your estimate. A quick call with your installer lets you discuss system fit, equipment options, incentives, and next steps. No obligation.

Primary CTA button:

Book your consultation

ARIA label:

Book your consultation

Keep secondary buttons unchanged:

Download PDF
Copy Share Link

---

MODAL

Title:

Book your free consultation

Body (must set call expectations + timeline + what the call is for):

Share your details below. [Company Name] will call you within 1–2 business days to schedule your free consultation—a short call to answer your questions, discuss your estimate, and go over next steps. No obligation.

Use the companyName prop for [Company Name]; if missing, use "Your installer" or "The team."

Fields:

First name *
Email *
Phone (optional)

Placeholders:

Your first name
you@example.com
+1 (555) 000-0000

Consent:

I agree to be contacted by [Company Name] by phone, email, or text regarding my solar project and next steps.

Primary CTA:

Request consultation

Helper text:

Takes ~30 seconds. No obligation.

Secondary action:

Cancel

---

DESIGN GOALS

REPORT PAGE CARD

Current problems:

- too much dead vertical space
- CTA still feels floating
- divider spacing off
- secondary row too low
- card not vertically centered

Required outcome:

- same exact horizontal layout
- improved vertical rhythm
- CTA vertically anchored
- divider balanced
- secondary row positioned intentionally
- card feels content-driven

MODAL

Current problems:

- spacing inconsistent
- next step unclear
- form rhythm uneven

Required outcome:

- clear hierarchy
- clear explanation that the next step is a call (with timeline and purpose)
- premium spacing
- clean form layout
- consistent vertical rhythm

---

EXECUTION PROCESS

STEP 1 — LOCATE COMPONENTS

Find the exact files/components controlling:

- paid report page consultation card
- CTA button
- divider
- secondary action row
- modal component
- modal form spacing

Do not edit anything yet.

---

STEP 2 — WRITE IMPLEMENTATION PLAN

Before editing:

Write a short plan explaining:

- which files will change
- which vertical spacing controls the layout
- which copy strings will change
- confirmation that horizontal layout will remain unchanged

---

STEP 3 — CAPTURE BEFORE STATE

Run locally.

Open report page.

Capture screenshots of:

- consultation section
- modal

---

STEP 4 — FIX REPORT PAGE VERTICAL RHYTHM

Adjust only:

- margin-top
- margin-bottom
- padding-top
- padding-bottom
- vertical gaps

Do NOT change:

- widths
- horizontal padding
- horizontal alignment
- button x-position
- divider width
- row alignment

Goal:

- less dead space
- CTA vertically centered
- divider spacing balanced
- secondary row aligned visually

---

STEP 5 — UPDATE COPY

Replace report page and modal copy exactly as specified above.

---

STEP 6 — FIX MODAL SPACING

Target spacing:

title → body = 16px
body → first field = 24px
field → field = 16px
last field → consent = 24px
consent → submit = 24px
submit → helper = 8px
helper → cancel = 16px

Keep modal visually premium and compact.

---

STEP 7 — PLAYWRIGHT VERIFICATION

Use Playwright to verify:

1. report page loads
2. new heading appears
3. CTA text updated ("Book your consultation")
4. horizontal layout unchanged
5. modal opens
6. modal title updated ("Book your free consultation")
7. modal body updated (call, timeline, purpose)
8. submit button text updated ("Request consultation")
9. form works
10. no console errors
11. spacing improved

---

STEP 8 — VISUAL COMPARISON

Compare before vs after screenshots.

Confirm:

- card edges unchanged
- CTA horizontal position unchanged
- divider width unchanged
- secondary row alignment unchanged

Confirm improvements:

- card less empty
- CTA anchored
- modal clearer (call as next step, timeline)
- hierarchy improved

---

STEP 9 — RESPONSIVE CHECK

Test:

desktop
tablet
mobile

Do not alter horizontal layout.

---

STEP 10 — OUTPUT

Provide:

1. files changed
2. spacing values changed
3. copy changes made
4. confirmation horizontal layout unchanged
5. any minor improvements still recommended

---

QUALITY BAR

Assume this UI will be embedded on the website of a major installer like Sunrun.

It must feel credible, polished, and conversion-focused.

Do not settle for "looks okay."
```

---

## Paste to here ↑

---

**Sticky CTA (report page):** If the report page uses a sticky bar with a label like "Book a Free Consultation," keep it aligned—e.g. **"Book your consultation"**—so the whole page is consistent.

**E2E tests:** After implementing, update any tests that assert old modal/button copy (e.g. "Schedule a free consultation," "Request consultation," "Get your custom design") to the new copy: "Book your consultation," "Book your free consultation," "Request consultation."
