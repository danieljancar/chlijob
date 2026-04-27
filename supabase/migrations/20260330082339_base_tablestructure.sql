-- ==========================================
-- 1. EXTENSIONS
-- ==========================================
create extension if not exists "uuid-ossp";

-- ==========================================
-- 2. TABLES
-- ==========================================

-- Profiles: Linked to Supabase Auth
create table if not exists public.profiles (
  id              uuid references auth.users on delete cascade primary key,
  username        text unique,
  first_name      text not null default '',
  last_name       text not null default '',
  email           text unique, 
  birthday        date,
  preferred_role  text not null default 'taker' check (preferred_role in ('taker', 'giver')),
  phone           text,
  location        text,
  bio             text,
  avatar_path     text,
  avatar_blurhash text,
  rating_avg      decimal(3,2) default 0,
  review_count    integer default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
  id   serial primary key,
  name varchar not null unique,
  slug text unique
);

-- Contracts
create table if not exists public.contracts (
  id              serial primary key,
  title           varchar not null,
  description     text,
  creator_id      uuid references public.profiles(id) not null,
  taker_id        uuid references public.profiles(id),
  category_id     integer references public.categories(id),
  -- payment_type    varchar not null,
  -- lump_sum        decimal(10, 2),
  salary_per_hour decimal(10, 2),
  address         varchar,
  latitude        float,
  longitude       float,
  estimated_hours decimal(5, 2),
  preferred_date  date,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  completed_at    timestamptz,
  canceled_at     timestamptz
);

-- Reviews
create table if not exists public.reviews (
  id             serial primary key,
  contract_id    integer references public.contracts(id) on delete cascade,
  reviewed_by_id uuid references public.profiles(id) not null,
  reviewed_to_id uuid references public.profiles(id) not null,
  rating         integer check (rating >= 1 and rating <= 5) not null,
  comment        text,
  created_at     timestamptz default now()
);

-- Contract Images
create table if not exists public.contract_images (
  id          serial primary key,
  image_path  varchar not null,
  contract_id integer references public.contracts(id) on delete cascade,
  created_at  timestamptz default now()
);

-- Applications
create table if not exists public.applications (
  id          serial primary key,
  user_id     uuid references public.profiles(id) on delete cascade,
  contract_id integer references public.contracts(id) on delete cascade,
  text        text,
  status      text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at  timestamptz default now(),
  unique(user_id, contract_id) 
);

-- Infobanners
create table if not exists public.infobanners (
  id          serial primary key,
  topic       varchar not null,
  start_date  timestamptz,
  end_date    timestamptz,
  message     text,
)

-- ==========================================
-- 3. FUNCTIONS & TRIGGERS
-- ==========================================

-- Standard updated_at refresher
create or replace function public.update_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Auto-create profile on Auth Signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public, auth as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'first_name', ''), 
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$;

-- Recalculate Rating Average for Profiles
create or replace function public.update_profile_rating()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles
  set 
    rating_avg = (select coalesce(avg(rating), 0) from public.reviews where reviewed_to_id = coalesce(new.reviewed_to_id, old.reviewed_to_id)),
    review_count = (select count(*) from public.reviews where reviewed_to_id = coalesce(new.reviewed_to_id, old.reviewed_to_id))
  where id = coalesce(new.reviewed_to_id, old.reviewed_to_id);
  return new;
end;
$$;

-- Triggers
create trigger profiles_updated_at before update on public.profiles for each row execute function update_updated_at();
create trigger contracts_updated_at before update on public.contracts for each row execute function update_updated_at();
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
create trigger on_review_change after insert or update or delete on public.reviews for each row execute function update_profile_rating();

-- ==========================================
-- 4. RLS POLICIES
-- ==========================================

alter table public.profiles enable row level security;
alter table public.contracts enable row level security;
alter table public.applications enable row level security;
alter table public.categories enable row level security;
alter table public.reviews enable row level security;
alter table public.contract_images enable row level security;
alter table public.infobanners enable row level security;

-- Profiles
create policy "Profiles are public" on public.profiles for select using (true);
create policy "Users edit own profile" on public.profiles for update using ((select auth.uid()) = id);

-- Categories
create policy "Categories are public" on public.categories for select using (true);

-- Contracts
create policy "Contracts are public" on public.contracts for select using (true);
create policy "Users create contracts" on public.contracts for insert with check ((select auth.uid()) = creator_id);
create policy "Creators edit own contracts" on public.contracts for update using ((select auth.uid()) = creator_id);

-- Applications
create policy "Visible to applicant and creator" on public.applications 
  for select using (
    (select auth.uid()) = user_id 
    OR 
    exists (select 1 from public.contracts where id = contract_id and creator_id = (select auth.uid()))
  );
create policy "Users apply to contracts" on public.applications for insert with check ((select auth.uid()) = user_id);

-- Reviews
create policy "Reviews are public" on public.reviews for select using (true);
create policy "Users write reviews" on public.reviews for insert with check ((select auth.uid()) = reviewed_by_id);

-- Infobanners
create policy "Infobanners are public" on public.infobanners for select using (true);

-- ==========================================
-- 5. STORAGE BUCKETS & POLICIES
-- ==========================================

insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('contract-images', 'contract-images', true) on conflict do nothing;

create policy "Avatars public" on storage.objects for select using (bucket_id = 'avatars');
create policy "Own avatar upload" on storage.objects for insert with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Contract images public" on storage.objects for select using (bucket_id = 'contract-images');
create policy "Authenticated upload images" on storage.objects for insert with check (
  bucket_id = 'contract-images' and auth.role() = 'authenticated'
);

-- ==========================================
-- 6. INDICES
-- ==========================================

create index if not exists idx_contracts_creator_id on public.contracts(creator_id);
create index if not exists idx_contracts_category_id on public.contracts(category_id);
create index if not exists idx_reviews_reviewed_to on public.reviews(reviewed_to_id);
create index if not exists idx_applications_contract on public.applications(contract_id);
create index if not exists idx_applications_user on public.applications(user_id);

-- ==========================================
-- 7. INSERT FIXED CATEGORIES
-- ==========================================
insert into public.categories (name, slug)
values 
  ('Cleaning', 'cleaning'),
  ('Gardening', 'gardening'),
  ('Moving', 'moving'),
  ('IT Support', 'it-support'),
  ('Tutoring', 'tutoring'),
  ('Other', 'other')
on conflict (name) do nothing;