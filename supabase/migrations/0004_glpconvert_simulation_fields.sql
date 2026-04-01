-- GLPConvert simulation-first lead schema extension
-- Adds first-class columns for simulation/value-before-lead flow analytics.

alter table if exists public.leads
  add column if not exists vertical text,
  add column if not exists simulation_input jsonb,
  add column if not exists simulation_output jsonb,
  add column if not exists simulation_version text,
  add column if not exists recommended_path text,
  add column if not exists estimated_timeline_weeks integer,
  add column if not exists price_range_low integer,
  add column if not exists price_range_high integer,
  add column if not exists budget_band text,
  add column if not exists consent_terms boolean,
  add column if not exists consent_contact boolean,
  add column if not exists lead_capture_completed boolean default false,
  add column if not exists booking_status text,
  add column if not exists lead_source text,
  add column if not exists utm_source text,
  add column if not exists utm_campaign text;

create index if not exists leads_vertical_idx on public.leads (vertical);
create index if not exists leads_booking_status_idx on public.leads (booking_status);
create index if not exists leads_lead_source_idx on public.leads (lead_source);

comment on column public.leads.simulation_input is 'Anonymous low-friction simulator input payload';
comment on column public.leads.simulation_output is 'Educational simulation output shown pre-lead-capture';
comment on column public.leads.simulation_version is 'Simulation model version used for result';
