-- Optional: run this ONLY if you already ran schema.sql earlier and tables exist
-- but are missing the columns we added for Step 9 (name, company, demo_url, campaign_id, assignee).
-- If you're running the full schema.sql for the first time, you don't need this.

-- Tenants: add name (display name)
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS name TEXT;

-- Leads: add company, demo_url, campaign_id, assignee
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS demo_url TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS campaign_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assignee TEXT;

-- Users: add name
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
