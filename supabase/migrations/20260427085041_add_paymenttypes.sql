alter table public.infobanners
  add column if not exists payment_type varchar not null default 'unknown',
  add column if not exists lump_sum decimal(10, 2);