# Geocoding REQUEST_DENIED – Definitive fix (step-by-step)

Use this **exact order** so the key and the project match. Do everything in the **same** Google Cloud project: **sunspire-468303**.

---

## Step 1: Open the correct project

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Click the **project dropdown at the top** (next to “Google Cloud”).
3. Select **sunspire-468303** (or the project name that shows ID `sunspire-468303`).  
   Do not switch projects in later steps.

---

## Step 2: Enable the Geocoding API in this project

1. Open this link **while the project sunspire-468303 is selected**:  
   **[Enable Geocoding API for sunspire-468303](https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com?project=sunspire-468303)**
2. On the page, click **Enable** (if it says “Manage”, it’s already enabled).
3. Wait until it shows “API enabled”.

---

## Step 3: Link billing to this project

1. Open:  
   **[Billing – link project](https://console.cloud.google.com/billing/linkedaccount?project=sunspire-468303)**
2. If “sunspire-468303” is not linked to a billing account, click **Link a billing account** and link it.
3. If it’s already linked, you’re done for this step.

---

## Step 4: Create a new API key in this project

1. Open:  
   **[Credentials for sunspire-468303](https://console.cloud.google.com/apis/credentials?project=sunspire-468303)**
2. Click **+ Create Credentials** → **API key**.
3. Copy the new key (e.g. `AIzaSy...`).
4. (Optional but recommended) Click **Edit API key** (or the key name):
   - **Application restrictions**: choose **None** (so server-side calls from Vercel work).
   - **API restrictions**: choose **Restrict key** → under “Maps”, enable **Geocoding API** only → **Save**.

---

## Step 5: Put the new key in Vercel and redeploy

1. **Vercel** → your project (e.g. sunspire-web-app) → **Settings** → **Environment Variables**.
2. Find **GOOGLE_GEOCODING_API_KEY** (or create it).
3. Set its **value** to the **new** key from Step 4 (replace any old value).  
   No extra spaces; exact paste.
4. Ensure it applies to **Production** (and Preview if you test there). Save.
5. **Redeploy**: Deployments → open the latest production deployment → **Redeploy** (or push a new commit so a new deployment runs).  
   Env vars are applied on deploy; a redeploy is required after changing them.

---

## Step 6: Test

1. Wait 1–2 minutes after the redeploy finishes.
2. Open:  
   **https://sunspire-web-app.vercel.app/api/geo/status**  
   You should see: `"ok": true, "googleStatus": "OK"`.
3. Or:  
   **https://sunspire-web-app.vercel.app/api/geo/normalize?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA**  
   You should get HTTP 200 and JSON with `lat` and `lng`.

---

## If it still returns REQUEST_DENIED

1. **Get the exact Google message**  
   Call the normalize URL above or `/api/geo/status` and look at the **full JSON**:
   - `details` or `googleErrorMessage` will contain Google’s exact reason (e.g. “This API project is not authorized to use this API”).
2. **Confirm project and key match**
   - The key in Vercel must have been created in **Credentials** for **sunspire-468303** (Step 4 link).
   - Geocoding API and Billing must be enabled/linked for **that same project** (Steps 2 and 3).
3. **Confirm Vercel**
   - Variable name is exactly **GOOGLE_GEOCODING_API_KEY** (no typo).
   - You **redeployed** after changing the variable (Step 5).
   - For production requests you’re hitting a deployment that has **Production** env (not only Preview).

---

## Summary checklist

| Step | What | Link / Where |
|------|------|---------------|
| 1 | Use project **sunspire-468303** | Project dropdown at top of Google Cloud Console |
| 2 | Enable Geocoding API in that project | [Enable Geocoding API](https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com?project=sunspire-468303) |
| 3 | Link billing to that project | [Billing linked account](https://console.cloud.google.com/billing/linkedaccount?project=sunspire-468303) |
| 4 | Create new API key in that project | [Credentials](https://console.cloud.google.com/apis/credentials?project=sunspire-468303) → Create Credentials → API key |
| 5 | Set key in Vercel as GOOGLE_GEOCODING_API_KEY, then **Redeploy** | Vercel → Settings → Environment Variables |
| 6 | Test | /api/geo/status and /api/geo/normalize |

All steps must be done for the **same** project (sunspire-468303). The key in Vercel must be the one created in that project after enabling the API and billing.
