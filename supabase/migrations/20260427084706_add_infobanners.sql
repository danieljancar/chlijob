
-- Infobanners
create table if not exists public.infobanners (
  id          serial primary key,
  topic       varchar not null,
  start_date  timestamptz,
  end_date    timestamptz,
  message     text,
)


alter table public.infobanners enable row level security;

-- Infobanners
create policy "Infobanners are public" on public.infobanners for select using (true);