# Full E2E verification — homeowner + white-label lessee

**Purpose:** One narrative that covers **both** actors and ties **every** surface to **[`TEMPORARY-TO-DO-LIST.md`](./TEMPORARY-TO-DO-LIST.md) → Step 46** (items **1–53**) and **[Step 47](./TEMPORARY-TO-DO-LIST.md)** (cost dashboards **54–57**). Use this when you need to prove the **whole** product, not only individual URLs.

**Production base (examples below):** `https://sunspire-web-app.vercel.app`

---

## Related canonical docs

| Doc | What it covers |
|-----|----------------|
| **[`TEMPORARY-TO-DO-LIST.md`](./TEMPORARY-TO-DO-LIST.md)** (Step 46 at top) | Ordered click list **1 → 53** + optional cost **54 → 57** |
| **[`POST-BUY-DASHBOARD.md`](../POST-BUY-DASHBOARD.md)** | Post-Stripe redirect to **`/c/{handle}?session_id=…&demo=1`**, dashboard behavior, instant URL → `/paid` |
| **[`POST-PURCHASE-FLOW.md`](./POST-PURCHASE-FLOW.md)** | Checkout → webhook → provision → email → CRM (implementation detail; DB is Supabase in prod) |
| **[`HOW-SUNSPIRE-WORKS.md`](../HOW-SUNSPIRE-WORKS.md)** § *Customer Journey* | Long-form technical walkthrough |

---

## 1. Homeowner journey (end customer of an installer)

**Who:** Someone who lands on the **branded calculator / report** (demo or paid). Step 46 uses **meta**, **Apple**, **Google** as example company names; the same routes work for a real tenant handle (e.g. **testco**) for a **closed loop** (§3).

| Phase | What they do | Step 46 items | Notes |
|--------|----------------|----------------|--------|
| **Land / explore (demo)** | Branded home + demo mode | **1** | `demo=1` on `/` |
| **Paid hub (demo)** | See `/paid` as a prospect | **2–3** | Meta / Google + `demo=1` |
| **Land / explore (paid)** | Instant slug or `/paid` without demo | **4–7** | **4** = `/{company}` redirect (e.g. `/meta` → `/paid?company=meta`) |
| **Report** | Full estimate + savings UI | **8–11** | **8–9** DEMO report; **10–11** PAID report (shared test address in Step 46) |
| **Lead** | Book / request consultation → submit | **12** | Confirms **`POST /api/lead`** → Supabase **`leads`** → optional email + CRM webhook |

**Backend (not opened as URLs in Step 46):** `GET /api/estimate`, `GET /api/geo/normalize`, **`POST /api/lead`** (exercised by **12**). Stripe **`POST /api/stripe/webhook`** is verified via **Stripe Dashboard · 47** when you run a real checkout.

---

## 2. White-label lessee journey (Sunspire customer — installer / tenant)

**Who:** The business that **buys** Sunspire, configures CRM/embed, and reads leads.

| Phase | What they do | Step 46 items | Notes |
|--------|----------------|----------------|--------|
| **Discover Sunspire** | Marketing / pricing / signup | **22–27**, **45** | **26** signup, **23** pricing, etc. |
| **Purchase** | Complete **Stripe Checkout** | **46** (dashboard), **47** (webhooks) | Session created from app (e.g. `POST /api/stripe/create-checkout-session`); not a fixed public URL |
| **Land after payment** | Redirect to dashboard with session | Documented in **`POST-BUY-DASHBOARD.md`**: **`/c/{handle}?session_id={CHECKOUT_SESSION_ID}&demo=1`** | Same **UX** as **13** when opened with a real session |
| **Dashboard (preview QA)** | Full dashboard without real Stripe | **13–16** | **`/c/testco?demo=1`**, leads, success, cancel |
| **Dashboard (live bookmark)** | Return without `demo=1` | **17–18** | **Access required** without session/token is OK for this checklist |
| **Activation surface (legacy / test)** | `/activate?…` | **19** | May partial-load with fake `session_id`; real flow is **`/c/...`** per POST-BUY doc |
| **Docs + CRM** | Setup, API, embed, branding, CRM guides | **36–43** | HubSpot / Salesforce / legacy Airtable path name |
| **Internal Sunspire ops** | Not the tenant app | **44** | **`/admin/dashboard`** — different product surface |
| **Observe money + delivery** | Stripe, uptime, errors, DB, email, CI | **46–53** | **48–49** UptimeRobot + Sentry = monitoring |

**Optional ops billing:** Step 47 items **54–57** in the temp list.

---

## 3. Closed-loop E2E (one slug: **testco**)

Use this to prove **tenant → homeowner → lead → tenant sees lead** on production without relying only on meta/Apple.

1. **Buyer (preview):** Open **Step 46 · 13** — [`/c/testco?demo=1`](https://sunspire-web-app.vercel.app/c/testco?demo=1). Copy **Instant URL** / **Visit site** if the UI offers it, **or** open **[`/testco`](https://sunspire-web-app.vercel.app/testco)** (redirects to **`/paid?company=testco`** — same pattern as **4–7**).
2. **Homeowner report:** Open a report with the **same** company slug, e.g. DEMO [`/report?company=testco&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`](https://sunspire-web-app.vercel.app/report?company=testco&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test) (mirrors **8–9**), or PAID variant without `demo=1` (mirrors **10–11**).
3. **Lead:** On that report, perform **Step 46 · 12** (submit one test lead with consent).
4. **Buyer confirms:** Open **Step 46 · 14** — [`/c/testco/leads?demo=1`](https://sunspire-web-app.vercel.app/c/testco/leads?demo=1) and confirm the row appears (allow a short delay).

You still complete **Step 46 · 1–11** for the **meta / Apple / Google** matrix; §3 is an **additional** proof that branding + routing work for the **same handle** the tenant uses in **`/c/...`**.

---

## 4. One-page checklist (copy for sign-off)

- [ ] **Homeowner DEMO:** **1–3**, **8–9**, **12**
- [ ] **Homeowner PAID:** **4–7**, **10–11**, **12**
- [ ] **Buyer:** **13–18** (+ real Stripe path from **26**/**23** + **`POST-BUY-DASHBOARD`** redirect)
- [ ] **Closed loop:** §3 above (**testco**)
- [ ] **Rest of prod surface:** **19–45** as in Step 46
- [ ] **External:** **46–53**; optional cost **54–57**
- [ ] **Automation (optional):** `BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod`

---

**Anchor back:** Always keep **[`TEMPORARY-TO-DO-LIST.md`](./TEMPORARY-TO-DO-LIST.md)** Step 46 as the **authoritative ordered URL list**; this playbook explains **how those pieces form two full journeys** and one **end-to-end loop**.
