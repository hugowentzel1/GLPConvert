-- GLPConvert (Wellspire LLC) — draft schema extension
-- Apply after review; align with existing `supabase/schema.sql` tenant/lead tables.

-- Vertical / product line for a tenant funnel
-- alter table tenants add column if not exists vertical text default 'glp';

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  vertical text not null default 'glp' check (vertical in ('glp', 'trt', 'pep')),
  slug text not null,
  display_name text not null,
  description text,
  price_min_cents integer,
  price_max_cents integer,
  price_mode text check (price_mode in ('fixed', 'range', 'starts_at')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, slug)
);

create table if not exists public.intake_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid,
  vertical text not null default 'glp',
  status text not null default 'started' check (status in ('started', 'completed', 'abandoned')),
  recommendation jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.intake_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.intake_sessions (id) on delete cascade,
  question_id text not null,
  value jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists intake_answers_session_idx on public.intake_answers (session_id);
create index if not exists intake_sessions_tenant_idx on public.intake_sessions (tenant_id);

comment on table public.programs is 'Per-clinic catalog for deterministic recommendations';
comment on table public.intake_sessions is 'GLP/TRT/Pep intake runs; minimize PHI in value payloads';
