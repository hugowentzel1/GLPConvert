-- Sunspire Supabase schema (tenants, leads, users, links)
-- Run this in Supabase SQL Editor for both staging and prod projects.

-- Tenants (installer/customer config)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT NOT NULL UNIQUE,
  name TEXT,
  plan TEXT,
  domain_login_url TEXT,
  brand_colors TEXT,
  logo_url TEXT,
  crm_keys TEXT,
  api_key TEXT,
  capture_url TEXT,
  users TEXT[],
  payment_status TEXT,
  stripe_customer_id TEXT,
  last_payment TIMESTAMPTZ,
  subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  requested_domain TEXT,
  domain_status TEXT,
  domain TEXT,
  notification_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenants_handle ON tenants (handle);
CREATE INDEX IF NOT EXISTS idx_tenants_subscription_id ON tenants (subscription_id) WHERE subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tenants_api_key ON tenants (api_key) WHERE api_key IS NOT NULL;

-- Leads (per-tenant)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  company TEXT,
  demo_url TEXT,
  campaign_id TEXT,
  assignee TEXT,
  street TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  place_id TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  utility_rate NUMERIC,
  token TEXT,
  system_size_kw NUMERIC,
  estimated_cost NUMERIC,
  estimated_savings NUMERIC,
  payback_period_years NUMERIC,
  npv_25_year NUMERIC,
  co2_offset_per_year NUMERIC,
  last_activity TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_tenant_created ON leads (tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);

-- Users (optional; dashboard access / roles)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL,
  role TEXT,
  tenant_ids UUID[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Links (optional; outreach redirect tracking)
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  target_params TEXT,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  clicks INT NOT NULL DEFAULT 0,
  status TEXT,
  last_clicked_at TIMESTAMPTZ,
  prospect_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_links_token ON links (token);
