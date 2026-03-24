# Production checklist (owner)

## What to actually use

**Click through live prod in order (simple):**  
→ **[`docs/TEMPORARY-TO-DO-LIST.md`](./TEMPORARY-TO-DO-LIST.md)** — **Step 46** + **Step 47** under the title (**1–53** + **54–57**; homeowner DEMO/PAID + **white-label buyer** `/c/…` legend; full duplicate in §11).

**End-to-end story** (both actors + **testco** closed loop): **[`docs/FULL-E2E-VERIFICATION-PLAYBOOK.md`](./FULL-E2E-VERIFICATION-PLAYBOOK.md)**

---

## Optional: automated tests (terminal)

From the repo:

```bash
cd /path/to/sunspire-clean
export ADMIN_TOKEN="your-token"   # optional — skips fewer tests
BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod
```

Watch Chromium (faster slow-mo):

```bash
BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod:headed
```

Screenshots after gate spec: folder **`test-results/prod-gate-visual/`** (gitignored).

---

## Then

- **Ops:** [MAINTENANCE-GUIDE.md](../MAINTENANCE-GUIDE.md)  
- **Growth:** [TO-DO-LIST.md](../TO-DO-LIST.md)  
- **Long migration history:** [TEMPORARY-TO-DO-LIST.md](./TEMPORARY-TO-DO-LIST.md) — not required for daily checks
