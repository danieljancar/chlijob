-- ==========================================
-- 1. ADD STATUS COLUMN TO CONTRACTS
-- ==========================================
alter table public.contracts
  add column if not exists status text not null default 'open'
  check (status in ('open', 'assigned', 'completed', 'canceled'));

-- Backfill status from existing fields
update public.contracts
set status =
  case
    when canceled_at is not null then 'canceled'
    when completed_at is not null then 'completed'
    when taker_id is not null then 'assigned'
    else 'open'
  end;

-- ==========================================
-- 2. ADDITIONAL INDICES
-- ==========================================
create index if not exists idx_contracts_status    on public.contracts(status);
create index if not exists idx_contracts_taker_id  on public.contracts(taker_id);

-- ==========================================
-- 3. RLS: contract creator may update applications
-- ==========================================
create policy "Creators update application status"
  on public.applications for update
  using (
    exists (
      select 1 from public.contracts
      where id = contract_id
        and creator_id = (select auth.uid())
    )
  );

-- ==========================================
-- 4. FUNCTION: atomically accept an application
-- ==========================================
create or replace function public.accept_application(p_application_id int)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_contract_id int;
  v_user_id     uuid;
begin
  select contract_id, user_id
    into v_contract_id, v_user_id
    from public.applications
   where id = p_application_id;

  if v_contract_id is null then
    raise exception 'Application not found';
  end if;

  if not exists (
    select 1 from public.contracts
     where id = v_contract_id
       and creator_id = (select auth.uid())
  ) then
    raise exception 'Not authorized';
  end if;

  update public.applications
     set status = 'accepted'
   where id = p_application_id;

  update public.applications
     set status = 'rejected'
   where contract_id = v_contract_id
     and id <> p_application_id
     and status = 'pending';

  update public.contracts
     set taker_id = v_user_id,
         status   = 'assigned'
   where id = v_contract_id;
end;
$$;
