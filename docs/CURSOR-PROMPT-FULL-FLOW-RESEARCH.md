# Cursor Prompt — Sunspire Full Flow & Best Setup (Research-Based)

**Purpose:** One paste-ready Cursor prompt that reflects (1) full Sunspire context, (2) what normally happens next in solar after an estimate, (3) the best conversion setup (primary vs secondary CTAs, call vs email report), and (4) exact copy and constraints. All claims are tied to cited sources; do not hallucinate.

---

## 1. Sunspire context (product)

- **What Sunspire is:** White-label solar quote / lead-conversion SaaS. Solar companies (installers) buy it and put it on their site. Homeowners get a customized estimate/report. The **report page** is where value has already been delivered (they see system size, production, savings, etc.).
- **Goal:** Convert the homeowner into a **lead** so the **installer** can contact them and sell solar panels. The sale happens when the installer responds fast and runs their process (consultation → custom design → proposal → contract → install).
- **Technical flow:** Report page → primary CTA opens modal → user submits name, email, phone, consent → POST to `/api/lead` → lead is delivered to the installer (webhook/CRM). Installer should contact within minutes (speed-to-lead).

So the report page’s job is to **capture contact info and set the expectation of a call** so the installer can execute speed-to-lead and win the sale.

---

## 2. What normally happens next (industry flow) — sources

### Major installers (post-quote / post-estimate)

- **Sunrun** (sunrun.com/selector): User submits "Get a quote" form → Sunrun reaches out via the contact info provided (call and text, per consent). A **solar advisor** contacts to discuss, runs custom analysis (BrightPath), designs a customized system.  
  Source: Sunrun selector page, Sunrun support/FAQs.
- **SunPower** (us.sunpower.com/get-started, sunpowerestimate.com/contact-sunpower): User submits "Get a Quote" → SunPower/partners are authorized to contact by phone, text, automated call. A **solar advisor / solar educator** reaches out to discuss the project, provide a **free custom solar estimate**, explain options (panels, storage, financing), and educate. Consultative, not pressure.  
  Source: SunPower Get Started, Contact SunPower.
- **Tesla** (tesla.com/energy/design): Different model — self-serve design → order → financing → install. Most installers follow the Sunrun/SunPower pattern: **form → company contacts → consultation → design → proposal → install.**

So the standard flow is: **estimate/quote on screen or by form → installer contacts (call first) → consultation → custom design → proposal → contract → installation.** Not "review your estimate" in isolation — the **call** is the bridge to design and sale.

### Speed-to-lead (why the call wins)

- **78% of customers buy from the first business that responds** (not cheapest or most experienced).  
  Source: GetNextPhone (speed to lead), Forbes/HBR-style summaries.
- **Contact within 5 minutes** → conversion rate ~**8× higher** than at 30 minutes; contact within **1 minute** → ~**4×** more likely to qualify (Velocify/Inside Sales data).  
  Sources: GetNextPhone, Inside Sales (response time), Blazeo solar playbook.
- **60-second triple-touch** (solar/home improvement): (1) Auto-SMS with booking link, (2) Immediate call attempt, (3) Email with CTAs (e.g. Book Assessment, Text Bill, See Financing). First 1–5 minutes are decisive.  
  Source: Blazeo — Speed-to-Lead for Solar Contractors (blazeo.com/blog/speed-to-lead-for-solar-contractors-roi-playbook/).
- **Solar specifically:** Sub-5-minute response can **double installs** with same ad spend (contact rate from ~20–25% to ~40–50%).  
  Source: Blazeo.
- **Sunbase (solar CRM):** Conversion 8× greater in first five minutes; 78% buy from first responder; instant SMS/email + rapid sales follow-up.  
  Source: sunbasedata.com/blog/automating-follow-ups-nurturing-solar-leads-for-higher-conversions.
- **Solar Dynamite:** Only ~2% convert at first contact; ~80% by 5th–10th follow-up. Prompt response and multi-channel (text, email, call) are critical.  
  Source: solardynamite.com/general/solar-lead-follow-up-and-conversion/.

**Implication:** The report page should prioritize getting the homeowner to **request the call** (submit contact info) so the installer can trigger the 60-second triple-touch. The primary CTA = **request consultation / book your consultation**.

### Email report vs call

- **LeadCapture.io, Aurora Solar:** One clear primary CTA; frame the offer (e.g. "see if your home qualifies," "get your estimate"). Don’t dilute with multiple competing primary actions.  
  Sources: leadcapture.io (Solar Energy World, 9 conversion tweaks), aurorasolar.com (CTAs).
- **Solar quote delivery:** Some companies send quote by email in 3–5 days (e.g. Unbound Solar); others contact first then send detailed quote.  
  Source: Form/quote templates, Unbound Solar.
- **In Sunspire:** The homeowner **already has the estimate on screen**. So "email my report" is a convenience/secondary. The **sale** is won by the installer **calling first**. Best setup: **primary = request call (book consultation); secondary = Download PDF + Copy Share Link.** Optionally mention in modal or confirmation that they can "get a copy by email" to reduce anxiety, but the main ask = call.

### Modal / form best practices (call as next step)

- **Gravity Forms:** Set expectations: "What happens next?" Use clear language and a **reasonable timeline** (e.g. when they’ll be contacted).  
  Source: gravityforms.com/blog/expectations-lead-gen-contact-forms.
- **Blogs That Sell:** Make the CTA specific — what the call involves, how long, what they’ll get; reduce objections ("no pitch unless you ask").  
  Source: blogsthatsell.com/blog/programmatic/landing-page-copywriting-tips-for-consultants.
- **Prospeo / Wisepops:** "Book" or "Schedule" signals buyer control; short forms (3–5 fields); say what the call covers.  
  Sources: prospeo.io/s/book-a-demo, wisepops.com/blog/popup-best-practice.
- **Solar installers:** "One of our solar pros will contact you to schedule your free consultation" (Wayne’s Solar); "will call or email within 2 business days" (Full Spectrum Solar).  
  Sources: waynesolar.com/free-consultation, fullspectrumsolar.com/consultation-request.

---

## 3. Best full setup (recommended)

| Element | Recommendation | Why |
|--------|-----------------|-----|
| **Primary CTA** | Request the call: **"Book your consultation"** | Converts to lead; installer can do speed-to-lead (call/SMS/email in 60 sec). 78% buy from first responder. |
| **Modal** | Short form: name, email, phone (optional), consent. Body copy: [Company] will **call** you within 1–2 business days to **schedule** your free consultation — short call to answer questions, discuss your estimate, next steps. No obligation. | Sets expectation (call), timeline, and purpose; reduces friction. |
| **Secondary CTAs** | **Download PDF** + **Copy Share Link** (unchanged) | Keeps UX; no competing primary; they already have report on screen. |
| **"Email my report"?** | Do **not** make it a second primary CTA. Optional: in modal or success state, one line like "We can also email you a copy of this estimate." | One clear primary wins (Aurora, LeadCapture). Sale is won by call; email report is convenience. |
| **Sticky CTA** | Match primary: e.g. "Book your consultation" | Consistency. |

So: **one clear primary (book consultation → modal → submit to /api/lead) + same horizontal layout + vertical rhythm only on report card + modal copy optimized for "next step = call."**

---

## 4. Source list (URLs)

- Sunrun: https://www.sunrun.com/selector , https://www.sunrun.com/go-solar-center/solar-faq  
- SunPower: https://us.sunpower.com/get-started , https://sunpowerestimate.com/contact-sunpower  
- Blazeo (speed-to-lead solar): https://www.blazeo.com/blog/speed-to-lead-for-solar-contractors-roi-playbook/  
- GetNextPhone (speed to lead): https://www.getnextphone.com/blog/speed-to-lead  
- Sunbase (nurturing solar leads): https://www.sunbasedata.com/blog/automating-follow-ups-nurturing-solar-leads-for-higher-conversions  
- Solar Dynamite (follow-up): https://www.solardynamite.com/general/solar-lead-follow-up-and-conversion/  
- Aurora Solar (CTAs): https://aurorasolar.com/blog/make-the-leads-come-to-you-using-calls-to-action-to-maximize-clicks/  
- LeadCapture.io (Solar Energy World): https://leadcapture.io/blog/how-solar-energy-world-captures-qualified-solar-leads/  
- LeadCapture.io (9 tweaks): https://leadcapture.io/blog/how-to-get-solar-leads/  
- Gravity Forms (expectations): https://www.gravityforms.com/blog/expectations-lead-gen-contact-forms  
- Blogs That Sell (consultant CTAs): https://blogsthatsell.com/blog/programmatic/landing-page-copywriting-tips-for-consultants  
- Wayne’s Solar: https://www.waynesolar.com/free-consultation  
- Full Spectrum Solar: https://fullspectrumsolar.com/consultation-request  
- Prospeo (book a demo): https://prospeo.io/s/book-a-demo  
- Wisepops (popup best practices): https://wisepops.com/blog/popup-best-practice  

---

## 5. Cursor prompt (paste-ready)

Copy the block below into Cursor. It keeps the same layout constraint and execution workflow; the wording and "best setup" sections are driven by the research above.

```text
You are working on Sunspire, a production-grade white-label solar quote / lead-conversion SaaS. Installers use it on their sites; homeowners see a customized estimate on the report page. The goal is to convert them into leads so the installer can contact them (ideally within minutes) and sell solar panels.

CONTEXT — WHAT NORMALLY HAPPENS NEXT (SOURCES)

After a homeowner has an estimate, the industry flow is:
- Sunrun / SunPower: Form submit → company reaches out (call + text) → solar advisor consultation → custom design → proposal → contract → installation.
- Speed-to-lead: 78% buy from the first business that responds. Contact within 5 minutes ≈ 8× higher conversion than 30 min; within 1 min ≈ 4× more likely to qualify. Best practice: 60-second triple-touch (SMS + call + email). (Blazeo, GetNextPhone, Sunbase, Inside Sales.)
- So the report page’s job: capture contact info so the installer can call first. Primary conversion = request the call ("Book your consultation"), not "email my report." One clear primary CTA wins (Aurora Solar, LeadCapture.io).

BEST FULL SETUP (DO NOT HALLUCINATE)

- Primary CTA: "Book your consultation" → opens modal → name, email, phone, consent → submit → POST /api/lead. This delivers the lead for speed-to-lead.
- Secondary: "Download PDF" and "Copy Share Link" only. Do not add a competing primary like "Email my report" — the sale is won by the call.
- Modal: Set expectation that [Company] will CALL (and when), what the call is for (discuss estimate, next steps), and no obligation. Optional: one line that they can get a copy by email, but the main ask = call.

---

CRITICAL REPORT-PAGE LAYOUT CONSTRAINT

For the bottom consultation section on the report page:

DO NOT change ANY horizontal layout or horizontal spacing (width, max-width, left/right padding or margin, x-position, horizontal alignment, horizontal gap, card width, button/divider/secondary row placement).

You may ONLY change: margin-top, margin-bottom, padding-top, padding-bottom, vertical gap, min-height/height if needed, vertical alignment that does not affect horizontal geometry. Only improve vertical rhythm.

---

COPY TO IMPLEMENT

REPORT PAGE (bottom consultation section)

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

Body (set call expectation + timeline + purpose; use companyName prop for [Company Name], fallback "Your installer"):
Share your details below. [Company Name] will call you within 1–2 business days to schedule your free consultation—a short call to answer your questions, discuss your estimate, and go over next steps. No obligation.

Fields: First name *, Email *, Phone (optional)
Placeholders: Your first name | you@example.com | +1 (555) 000-0000

Consent:
I agree to be contacted by [Company Name] by phone, email, or text regarding my solar project and next steps.

Primary submit button:
Request consultation

Helper text:
Takes ~30 seconds. No obligation.

Secondary action:
Cancel

---

DESIGN GOALS

Report page card: Same horizontal layout. Improve vertical rhythm only (less dead space, CTA anchored, divider balanced, secondary row intentional, content-driven feel).

Modal: Clear hierarchy; clear "next step = call" with timeline and purpose; premium spacing; consistent vertical rhythm; short form.

---

EXECUTION PROCESS

1. Locate: report page consultation card, CTA button, divider, secondary row, modal, modal form spacing. Do not edit yet.
2. Plan: Which files change; which vertical spacing controls; which copy; confirm no horizontal layout change.
3. Before state: Run locally, open report page, capture screenshots of consultation section and modal.
4. Fix report page: Adjust only margin-top/bottom, padding-top/bottom, vertical gaps. Do not change widths or horizontal alignment.
5. Update copy: Report page and modal exactly as specified above.
6. Fix modal spacing: title→body 16px, body→first field 24px, field→field 16px, last field→consent 24px, consent→submit 24px, submit→helper 8px, helper→cancel 16px. Keep premium and compact.
7. Playwright: Verify report loads, new heading/CTA, horizontal layout unchanged, modal opens, modal title/body/submit updated, form works, no console errors.
8. Visual comparison: Card edges and CTA/divider/secondary row positions unchanged; improvements in vertical balance and modal clarity.
9. Responsive: Desktop, tablet, mobile; no horizontal layout change.
10. Output: List files changed, spacing values, copy changes, confirmation horizontal layout unchanged, any minor follow-ups.

---

QUALITY BAR

This UI may sit on a major installer’s site. It must feel credible, polished, and conversion-focused. Do not settle for "looks okay."
```

---

## 6. Optional: "Email my report" later

If the installer wants to test a second path (e.g. "Email my report" to capture email and send PDF), that can be a separate CTA or A/B test. The research says one clear primary CTA for the main conversion (request call); secondary actions (Download PDF, Copy link) stay as-is. Adding "Email my report" as a tertiary or in success state ("We’ll email you a copy too") is fine; do not make it compete with "Book your consultation" as primary.

---

## 7. E2E and Sticky CTA

- Update E2E tests that assert old button/modal copy to the new: "Book your consultation," "Book your free consultation," "Request consultation."
- If the report page uses a sticky CTA bar, set its label to "Book your consultation" so it matches the primary CTA.
