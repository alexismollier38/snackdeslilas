-- À exécuter dans Supabase > SQL Editor.
create table if not exists public.app_state (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

-- Prototype mono-caisse : à remplacer par des policies liées à auth.uid()
-- avant une mise en production multi-utilisateur.
drop policy if exists "prototype read app state" on public.app_state;
drop policy if exists "prototype write app state" on public.app_state;
create policy "prototype read app state" on public.app_state for select to anon using (true);
create policy "prototype write app state" on public.app_state for insert to anon with check (true);
create policy "prototype update app state" on public.app_state for update to anon using (true) with check (true);
