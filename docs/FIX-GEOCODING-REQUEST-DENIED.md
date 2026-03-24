# Fix Geocoding REQUEST_DENIED (key already in Vercel + unrestricted)

If **API key 1** is unrestricted and **GOOGLE_GEOCODING_API_KEY** is set in Vercel but you still get **REQUEST_DENIED**, the key’s **Google Cloud project** is almost certainly missing one of these, or the key is from the wrong project:

---

## 0. Key must be from the SAME project that has Geocoding + Billing (most common)

Google Cloud has **projects**. The API key is tied to **one project**. Geocoding and Billing are enabled **per project**. If “API key 1” was created in **Project A** but you enabled Geocoding + Billing in **Project B** (e.g. sunspire-468303), Google will still return REQUEST_DENIED.

**Fix:**

1. In **Google Cloud Console**, use the **project dropdown at the top** and select **sunspire-468303** (the project where you enabled Geocoding API and Billing).
2. Go to **APIs & Services** → **Credentials**.
3. Click **+ Create Credentials** → **API key**. A new key is created **in this project**.
4. (Optional) Click “Edit API key” → set **Application restriction** = None, **API restriction** = “Restrict key” → enable only **Geocoding API** → Save.
5. Copy the new key. In **Vercel** → Project → Settings → Environment Variables → edit **GOOGLE_GEOCODING_API_KEY** → paste this new key (replace the old one) → Save → **Redeploy**.
6. Test: `https://sunspire-web-app.vercel.app/api/geo/status` → expect `"ok": true, "googleStatus": "OK"`.

---

## 1. Enable the Geocoding API for the project

The key can be unrestricted and still get REQUEST_DENIED if the **Geocoding API** is not enabled for that project.

1. In **Google Cloud Console**, make sure the project that owns **API key 1** is selected (top project dropdown).
2. Go to **APIs & Services** → **Library** (or “Enable APIs and Services”).
3. Search for **“Geocoding API”**.
4. Open **Geocoding API** and click **Enable**.
5. If it says “Manage” instead of “Enable”, it’s already enabled; skip to step 2 below.

---

## 2. Enable Billing on the project

Geocoding (and other Maps APIs) require **billing to be enabled** on the project, even for free-tier usage. REQUEST_DENIED is the usual response when billing is not enabled.

1. In **Google Cloud Console**, same project selected.
2. Go to **Billing** (left menu or search “Billing”).
3. If the project is not linked to a billing account, **Link a billing account** (or create one and then link).
4. Finish the flow (you get a $200/month Maps credit; you won’t be charged for normal Geocoding usage within that).

---

## 3. Redeploy and test

- In Vercel: trigger a **Redeploy** of the latest production deployment (so the same env is used; optional but good to be sure).
- Open:  
  `https://sunspire-web-app.vercel.app/api/geo/status`  
  You should see: `"ok": true, "googleStatus": "OK"`.
- Or call:  
  `https://sunspire-web-app.vercel.app/api/geo/normalize?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA`  
  You should get 200 and `lat`/`lng` in the JSON.

---

## Summary

| Check | Where |
|-------|--------|
| Geocoding API enabled | APIs & Services → Library → “Geocoding API” → Enable |
| Billing enabled | Billing → Link billing account to the project that owns API key 1 |

Both must be done for the **same project** that contains **API key 1**. After that, REQUEST_DENIED from Geocoding should stop.
