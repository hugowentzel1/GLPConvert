# 🔧 Environment Variables Checklist

## Required for Production

### Core App

```bash
NEXT_PUBLIC_APP_URL=https://sunspire-web-app.vercel.app
NODE_ENV=production
```

### Airtable Integration

```bash
AIRTABLE_API_KEY=key_xxx                    # From Airtable Account Settings
AIRTABLE_BASE_ID=app_xxx                    # From Airtable base URL
```

### Stripe Integration

```bash
STRIPE_LIVE_SECRET_KEY=sk_live_xxx          # From Stripe Dashboard > API Keys
STRIPE_WEBHOOK_SECRET=whsec_xxx             # From Stripe Dashboard > Webhooks
STRIPE_PRICE_SETUP_399=price_xxx            # Create in Stripe Dashboard
STRIPE_PRICE_MONTHLY_99=price_xxx           # Create in Stripe Dashboard
```

### Vercel Domain API

```bash
VERCEL_TOKEN=xxx                            # From Vercel Account Settings
VERCEL_PROJECT_ID=xxx                       # From Vercel project settings
```

### External APIs

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxx         # From Google Cloud Console
NREL_API_KEY=xxx                            # From NREL Developer Network
EIA_API_KEY=xxx                             # From EIA API registration
```

### Optional

```bash
ADMIN_TOKEN=xxx                             # For admin functions
ALLOW_EMBED=1                               # If enabling iframe embedding
```

## Verification Commands

### Test Airtable Connection

```bash
curl -H "Authorization: Bearer $AIRTABLE_API_KEY" \
  "https://api.airtable.com/v0/$AIRTABLE_BASE_ID/Tenants?maxRecords=1"
```

### Test Stripe Connection

```bash
stripe balance retrieve --api-key $STRIPE_LIVE_SECRET_KEY
```

### Test Vercel API

```bash
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v1/projects/$VERCEL_PROJECT_ID"
```

## Airtable Schema Requirements

### Tenants Table

- `Company Handle` (Single line text)
- `Status` (Single select: "demo", "paid", "cancelled")
- `API Key` (Single line text)
- `Owner Email` (Email)
- `Domain` (Single line text)
- `Created` (Date)

### Leads Table

- `Name` (Single line text)
- `Email` (Email)
- `Address` (Long text)
- `Company Handle` (Single line text)
- `Created` (Date)
- `Phone` (Phone number, optional)

### Users Table

- `Email` (Email)
- `Name` (Single line text)
- `Company Handle` (Single line text)
- `Role` (Single select: "owner", "admin", "user")

### Links Table

- `Company Handle` (Single line text)
- `Domain` (Single line text)
- `Status` (Single select: "pending", "live", "failed")
- `Created` (Date)
