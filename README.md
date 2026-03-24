# Sunspire Backend API

Full backend implementation for the Sunspire solar intelligence platform, built with Next.js App Router.

## Features

- **Multi-tenant architecture** with automatic tenant resolution
- **Lead tracking and management** via Airtable
- **Solar production calculations** using NREL PVWatts v8
- **Utility rate lookups** via EIA API
- **Financial modeling** with payback, NPV, and IRR calculations
- **White-label lead ingestion** with rate limiting
- **JWT authentication** and API key management

## Environment Variables

Create a `.env.local` file with the following required variables:

```bash
# Required
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NREL_API_KEY=your_nrel_api_key
EIA_API_KEY=your_eia_api_key
ADMIN_TOKEN=your_admin_secret_token

# Optional (with defaults)
DEFAULT_RATE_ESCALATION=0.025
DEFAULT_OANDM_ESCALATION=0.03
DISCOUNT_RATE=0.08
OANDM_PER_KW_YEAR=15
DEFAULT_DEGRADATION_PCT=0.5
DEFAULT_LOSSES_PCT=14
DEFAULT_COST_PER_WATT=3.5
```

## API Endpoints

### 1. Tracking APIs

#### POST `/api/track/view`

Track when someone views your demo.

**Headers:** None required (tenant resolved automatically)

**Body:**

```json
{
  "email": "user@example.com",
  "campaignId": "summer2024",
  "address": {
    "formattedAddress": "123 Main St, Phoenix, AZ 85001",
    "street": "123 Main St",
    "city": "Phoenix",
    "state": "AZ",
    "postalCode": "85001",
    "country": "US",
    "placeId": "ChIJ...",
    "lat": 33.4484,
    "lng": -112.074
  }
}
```

**Response:**

```json
{
  "success": true,
  "tenant": "acme",
  "tracked": true
}
```

#### POST `/api/track/cta-click`

Track when someone clicks a CTA button.

**Headers:** None required (tenant resolved automatically)

**Body:** Same as view tracking

**Response:** Same as view tracking

### 2. Webhook APIs

#### POST `/api/webhooks/sample-request`

Process sample report requests.

**Headers:** None required (tenant resolved automatically)

**Body:**

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "company": "ACME Corp",
  "campaignId": "summer2024",
  "address": {
    "formattedAddress": "123 Main St, Phoenix, AZ 85001",
    "street": "123 Main St",
    "city": "Phoenix",
    "state": "AZ",
    "postalCode": "85001",
    "country": "US",
    "placeId": "ChIJ...",
    "lat": 33.4484,
    "lng": -112.074
  }
}
```

**Response:**

```json
{
  "success": true,
  "tenant": "acme",
  "leadId": "rec123456789",
  "message": "Sample request processed successfully"
}
```

#### POST `/api/webhooks/unsubscribe`

Process unsubscribe requests.

**Headers:** None required (tenant resolved automatically)

**Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "tenant": "acme",
  "leadId": "rec123456789",
  "message": "Successfully unsubscribed"
}
```

### 3. White-Label Lead Ingestion

#### POST `/v1/ingest/lead`

White-label lead capture for external integrations.

**Headers:**

```
x-api-key: your_tenant_api_key
```

**Body:**

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "company": "ACME Corp",
  "address": {
    "formattedAddress": "123 Main St, Phoenix, AZ 85001",
    "street": "123 Main St",
    "city": "Phoenix",
    "state": "AZ",
    "postalCode": "85001",
    "country": "US",
    "placeId": "ChIJ...",
    "lat": 33.4484,
    "lng": -112.074
  },
  "utm": {
    "source": "google",
    "medium": "cpc",
    "campaign": "summer2024",
    "term": "solar panels",
    "content": "banner1"
  }
}
```

**Response:**

```json
{
  "ok": true,
  "leadId": "rec123456789",
  "tenant": "acme"
}
```

**Rate Limiting:** 60 requests per minute per API key

### 4. Admin APIs

#### POST `/api/admin/create-tenant`

Create new tenant accounts (admin only).

**Headers:**

```
x-admin-token: your_admin_token
```

**Body:**

```json
{
  "companyHandle": "acme",
  "plan": "Pro",
  "brandColors": "#FF6B35,#2E86AB",
  "logoURL": "https://acme.com/logo.png",
  "domainUrl": "https://acme.com"
}
```

**Response:**

```json
{
  "tenantId": "rec123456789",
  "apiKey": "generated_32_char_api_key",
  "loginUrl": "https://app.sunspire.com/acme",
  "captureUrl": "https://acme.com/v1/ingest/lead"
}
```

### 5. Quote Calculation

#### POST `/api/calc/quote`

Calculate solar quotes (requires JWT authentication).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Body:**

```json
{
  "lat": 33.4484,
  "lng": -112.074,
  "dc_kw": 5.0,
  "tilt": 20,
  "azimuth": 180,
  "module_type": 0,
  "array_type": 0,
  "losses_pct": 14,
  "cost_per_watt": 3.5
}
```

**Response:**

```json
{
  "ac_annual": 8500,
  "ac_monthly": [650, 720, 800, ...],
  "payback_year": 7.2,
  "savings_25yr": 45000,
  "npv": 25000,
  "irr": 0.15,
  "utility_rate": 0.18,
  "system_size_kw": 5.0,
  "location": {
    "lat": 33.4484,
    "lng": -112.0740
  }
}
```

### 6. Health Check

#### GET `/api/health`

Check system health and environment variables.

**Response:**

```json
{
  "ok": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "env": {
    "AIRTABLE_API_KEY": "!!",
    "AIRTABLE_BASE_ID": "!!",
    "GOOGLE_MAPS": "!!",
    "NREL": "!!",
    "EIA": "!!",
    "ADMIN_TOKEN": "!!"
  },
  "defaults": {
    "DEFAULT_RATE_ESCALATION": 0.025,
    "DEFAULT_OANDM_ESCALATION": 0.03,
    "DISCOUNT_RATE": 0.08,
    "OANDM_PER_KW_YEAR": 15,
    "DEFAULT_DEGRADATION_PCT": 0.5,
    "DEFAULT_LOSSES_PCT": 14,
    "DEFAULT_COST_PER_WATT": 3.5
  }
}
```

## Tenant Resolution

The system automatically resolves tenants using these methods (in order):

1. **Host subdomain:** `acme.sunspire.app` → tenant "acme"
2. **Path prefix:** `/c/acme/...` → tenant "acme"
3. **API key header:** `x-api-key: <key>` → lookup in Tenants table
4. **JWT token:** `Authorization: Bearer <jwt>` → extract tenantId

## Airtable Schema

### Leads Table

- Name, Email, Company, Tenant, Demo URL, Campaign ID
- Status, Notes, Last Activity
- Street, City, State, Postal Code, Country
- Formatted Address, Place ID, Latitude, Longitude
- Utility Rate ($/kWh)

### Tenants Table

- Company Handle, Plan, Domain / Login URL
- Brand Colors, Logo URL, CRM Keys
- API Key, Capture URL, Users

### Users Table

- Email, Role, Tenant

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Security Features

- **Content Security Policy** configured for Google Maps
- **Rate limiting** on lead ingestion (60 req/min per API key)
- **JWT authentication** with HS256 signing
- **Admin token protection** for tenant creation
- **Tenant isolation** with automatic scope resolution

## Notes

- **Stripe integration** is not included (as requested)
- **Address geocoding** requires Google Geocoding API implementation
- **Place ID lookup** requires Google Places API implementation
- **Rate limiting** uses in-memory storage (use Redis in production)
- **JWT tokens** expire after 24 hours

## Support

For questions or issues, check the health endpoint first to verify environment variables are properly configured.

# Force deployment Mon Sep 8 12:43:43 EDT 2025

# Address update Fri Sep 12 23:16:07 EDT 2025
# Deployment trigger
