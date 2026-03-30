-- ==========================================
-- 1. SEED USERS (auth.users & public.profiles)
-- ==========================================

-- We insert into auth.users first. 
-- The trigger 'on_auth_user_created' will automatically handle public.profiles.
insert into auth.users (id, email, raw_user_meta_data, role, aud)
values 
  (
    '00000000-0000-0000-0000-000000000001', 
    'giver@chlijob.ch', 
    '{"first_name": "Daniel", "last_name": "Zimmermann"}', 
     'authenticated', 'authenticated'
  ),
  (
    '00000000-0000-0000-0000-000000000002', 
    'taker@chlijob.ch', 
    '{"first_name": "Jana", "last_name": "Kempf"}', 
     'authenticated', 'authenticated'
  )
on conflict (id) do nothing;

-- Update profiles for specific seed data not handled by the trigger
update public.profiles set username = 'FrenchMan01', preferred_role = 'giver' where id = '00000000-0000-0000-0000-000000000001';
update public.profiles set username = 'XX_jana_XX', preferred_role = 'taker' where id = '00000000-0000-0000-0000-000000000002';

-- ==========================================
-- 2. SEED CONTRACTS
-- ==========================================

insert into public.contracts (
  title, 
  description, 
  creator_id, 
  category_id, 
  salary_per_hour, 
  address, 
  estimated_hours, 
  preferred_date
)
values 
  (
    'Gartenarbeit', 
    'Der rasen muss gemäht werden', 
    '00000000-0000-0000-0000-000000000001', 
    (select id from public.categories where slug = 'gardening'),
    45.00, 
    '123 Main St, Berlin', 
    2.5, 
    '2026-04-10'
  ),
  (
    'c# Basics', 
    'ich check nicht', 
    '00000000-0000-0000-0000-000000000001', 
    (select id from public.categories where slug = 'tutoring'), 
    25.00, 
    '123 Main St, Berlin', 
    1.0, 
    '2026-04-12'
  );

-- ==========================================
-- 3. SEED APPLICATIONS
-- ==========================================

insert into public.applications (user_id, contract_id, text, status)
values 
  (
    '00000000-0000-0000-0000-000000000002', 
    1, 
    'I have all the tools needed and can be there by 10 AM.', 
    'pending'
  );

-- ==========================================
-- 4. SEED REVIEWS
-- ==========================================

-- Simulating a finished past contract for to show off the rating trigger
insert into public.contracts (id, title, creator_id, taker_id, salary_per_hour)
values (99, 'Old Completed Job', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 20.00);

insert into public.reviews (contract_id, reviewed_by_id, reviewed_to_id, rating, comment)
values 
  (99, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 5, 'fantastic and very fast!');