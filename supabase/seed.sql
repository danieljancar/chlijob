-- ============================================================
-- ChliJobs – Demo Seed Data
-- ============================================================
-- Populates the database with realistic Swiss mini-job data
-- for demo and development purposes.
--
-- Includes: 8 users, 13 contracts (open / assigned /
-- completed / canceled), 20 applications, 8 reviews,
-- and 3 info banners.
--
-- Demo password for ALL users: password
-- Run via: supabase db reset
-- ============================================================


-- ============================================================
-- 1. CATEGORIES
-- ============================================================

insert into public.categories (name, slug)
values
  ('Cleaning',   'cleaning'),
  ('Gardening',  'gardening'),
  ('Moving',     'moving'),
  ('IT Support', 'it-support'),
  ('Tutoring',   'tutoring'),
  ('Other',      'other')
on conflict (name) do nothing;


-- ============================================================
-- 2. AUTH USERS
-- ============================================================
-- Inserting into auth.users triggers handle_new_user(), which
-- auto-creates the corresponding public.profiles row using
-- data from raw_user_meta_data.
-- ============================================================

insert into auth.users (
  instance_id, id, aud, role,
  email, encrypted_password,
  email_confirmed_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
values
  -- ── Givers (job creators) ──────────────────────────────────
  (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-0001-0001-0001-000000000001',
    'authenticated', 'authenticated',
    'jonas.weber@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now() - interval '45 days', now() - interval '1 day',
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Jonas","last_name":"Weber","birthday":"1985-04-12","preferred_role":"giver"}',
    false, now() - interval '45 days', now() - interval '1 day',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-0002-0002-0002-000000000002',
    'authenticated', 'authenticated',
    'petra.brunner@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now() - interval '38 days', now() - interval '3 days',
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Petra","last_name":"Brunner","birthday":"1978-09-23","preferred_role":"giver"}',
    false, now() - interval '38 days', now() - interval '3 days',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-0003-0003-0003-000000000003',
    'authenticated', 'authenticated',
    'thomas.huber@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now() - interval '30 days', now() - interval '2 days',
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Thomas","last_name":"Huber","birthday":"1990-02-08","preferred_role":"giver"}',
    false, now() - interval '30 days', now() - interval '2 days',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-0004-0004-0004-000000000004',
    'authenticated', 'authenticated',
    'anna.schneider@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now() - interval '22 days', now() - interval '5 hours',
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Anna","last_name":"Schneider","birthday":"1993-07-15","preferred_role":"giver"}',
    false, now() - interval '22 days', now() - interval '5 hours',
    '', '', '', ''
  ),
  -- ── Takers (job seekers) ───────────────────────────────────
  (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-0005-0005-0005-000000000005',
    'authenticated', 'authenticated',
    'lisa.mueller@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now() - interval '40 days', now() - interval '6 hours',
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Lisa","last_name":"Müller","birthday":"1998-11-03","preferred_role":"taker"}',
    false, now() - interval '40 days', now() - interval '6 hours',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-0006-0006-0006-000000000006',
    'authenticated', 'authenticated',
    'marco.rossi@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now() - interval '35 days', now() - interval '1 day',
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Marco","last_name":"Rossi","birthday":"1995-06-20","preferred_role":"taker"}',
    false, now() - interval '35 days', now() - interval '1 day',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-0007-0007-0007-000000000007',
    'authenticated', 'authenticated',
    'sarah.keller@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now() - interval '28 days', now() - interval '2 hours',
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Sarah","last_name":"Keller","birthday":"2000-01-17","preferred_role":"taker"}',
    false, now() - interval '28 days', now() - interval '2 hours',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-0008-0008-0008-000000000008',
    'authenticated', 'authenticated',
    'david.meier@example.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now() - interval '20 days', now() - interval '12 hours',
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"David","last_name":"Meier","birthday":"1997-03-28","preferred_role":"taker"}',
    false, now() - interval '20 days', now() - interval '12 hours',
    '', '', '', ''
  );


-- ============================================================
-- 3. ENRICH PROFILES
-- ============================================================
-- The trigger only sets first_name, last_name, birthday and
-- preferred_role. Fill in the remaining fields here.
-- ============================================================

update public.profiles set
  username = 'jonasweber',
  email    = 'jonas.weber@example.com',
  phone    = '+41 79 123 45 67',
  location = 'Zürich',
  bio      = 'Homeowner in Zürich looking for reliable help with household and garden tasks. I appreciate punctual, careful workers and always pay on time.'
where id = 'a1b2c3d4-0001-0001-0001-000000000001';

update public.profiles set
  username = 'petrabrunner',
  email    = 'petra.brunner@example.com',
  phone    = '+41 78 234 56 78',
  location = 'Luzern',
  bio      = 'Busy professional in Lucerne. I post jobs regularly and value quality over speed. Reliable payment guaranteed within 24 hours of completion.'
where id = 'a1b2c3d4-0002-0002-0002-000000000002';

update public.profiles set
  username = 'thomashuber',
  email    = 'thomas.huber@example.com',
  phone    = '+41 77 345 67 89',
  location = 'Genf',
  bio      = 'Software engineer living in Geneva. Need occasional help around the house and with small IT side-projects. Flexible with scheduling.'
where id = 'a1b2c3d4-0003-0003-0003-000000000003';

update public.profiles set
  username = 'annaschneider',
  email    = 'anna.schneider@example.com',
  phone    = '+41 76 456 78 90',
  location = 'Zürich',
  bio      = 'Young professional preparing to move in Zürich. Need reliable helping hands – always pay promptly and provide refreshments on the day!'
where id = 'a1b2c3d4-0004-0004-0004-000000000004';

update public.profiles set
  username = 'lisamueller',
  email    = 'lisa.mueller@example.com',
  phone    = '+41 79 567 89 01',
  location = 'Zürich',
  bio      = 'Student in Zürich with 3+ years of professional cleaning experience. Thorough, detail-oriented and available evenings and weekends.'
where id = 'a1b2c3d4-0005-0005-0005-000000000005';

update public.profiles set
  username = 'marcorossi',
  email    = 'marco.rossi@example.com',
  phone    = '+41 78 678 90 12',
  location = 'Basel',
  bio      = 'Strong and dependable – available for moving jobs, garden work, and general labour. Based in Basel, happy to travel within 30 km.'
where id = 'a1b2c3d4-0006-0006-0006-000000000006';

update public.profiles set
  username = 'sarahkeller',
  email    = 'sarah.keller@example.com',
  phone    = '+41 77 789 01 23',
  location = 'Bern',
  bio      = 'Computer science student with strong Python and web skills. Available for IT support, bug fixes, and tutoring. Quick learner, great communicator.'
where id = 'a1b2c3d4-0007-0007-0007-000000000007';

update public.profiles set
  username = 'davidmeier',
  email    = 'david.meier@example.com',
  phone    = '+41 76 890 12 34',
  location = 'St. Gallen',
  bio      = 'Former teacher and current graduate student. Available for tutoring in German, Mathematics, and Sciences. Patient, structured, and experienced.'
where id = 'a1b2c3d4-0008-0008-0008-000000000008';


-- ============================================================
-- 4. CONTRACTS
-- ============================================================
-- Category IDs: 1=Cleaning  2=Gardening  3=Moving
--               4=IT Support  5=Tutoring  6=Other
-- ============================================================

-- ── OPEN (5) ─────────────────────────────────────────────────

insert into public.contracts (
  title, description,
  creator_id, taker_id,
  category_id, status, payment_type,
  salary_per_hour, lump_sum,
  address, latitude, longitude,
  estimated_hours, preferred_date, created_at
)
values
  (
    'Spring Cleaning – 4.5-Room Apartment',
    'I need help with a thorough spring clean of my apartment. Tasks include: cleaning windows inside and out, scrubbing kitchen appliances (oven, fridge, microwave), deep-cleaning the bathroom, and mopping all floors. Cleaning supplies are provided.',
    'a1b2c3d4-0001-0001-0001-000000000001', null,
    1, 'open', 'hourly',
    25.00, null,
    'Bahnhofstrasse 42, 8001 Zürich', 47.3769, 8.5417,
    4.0, '2026-05-10', now() - interval '3 days'
  ),
  (
    'Garden Weeding & Hedge Trimming',
    'My garden needs attention after the winter months. The side hedges need trimming to about 180 cm and there is significant weeding to do in the flower beds along the fence. Tools and a ladder are available on site.',
    'a1b2c3d4-0002-0002-0002-000000000002', null,
    2, 'open', 'lump_sum',
    null, 180.00,
    'Haldenstrasse 12, 6006 Luzern', 47.0502, 8.3093,
    null, '2026-05-08', now() - interval '2 days'
  ),
  (
    'Smart Home Setup & Network Configuration',
    'Just moved into a new flat and need help setting up Philips Hue lighting, a Sonos system, Apple TV 4K, and configuring the Fritzbox router with proper guest Wi-Fi. Basic scripting knowledge (Python/bash) is a plus.',
    'a1b2c3d4-0003-0003-0003-000000000003', null,
    4, 'open', 'hourly',
    45.00, null,
    'Rue du Rhône 8, 1204 Genève', 46.2044, 6.1432,
    3.0, '2026-05-12', now() - interval '1 day'
  ),
  (
    'Math Tutoring – Gymnasium (Matura Level)',
    'My 16-year-old is preparing for the Matura exams and needs support in Analysis and Algebra. Looking for a tutor with a strong academic background. Sessions at our home in Zürich or online – fully flexible.',
    'a1b2c3d4-0001-0001-0001-000000000001', null,
    5, 'open', 'hourly',
    35.00, null,
    'Rämistrasse 101, 8001 Zürich', 47.3769, 8.5417,
    2.0, '2026-05-09', now() - interval '4 days'
  ),
  (
    'Moving Help – 3-Room Apartment (Altstetten → Oerlikon)',
    'Moving from a 3-room apartment in Zürich Altstetten to Oerlikon. Furniture includes a large sofa, two wardrobes, a dining table with 4 chairs, and about 30 standard moving boxes. Need 2 strong helpers for approximately 4 hours. I provide a moving van.',
    'a1b2c3d4-0004-0004-0004-000000000004', null,
    3, 'open', 'lump_sum',
    null, 350.00,
    'Badenerstrasse 200, 8048 Zürich', 47.3857, 8.4896,
    null, '2026-05-15', now() - interval '6 hours'
  );

-- ── ASSIGNED (3) ─────────────────────────────────────────────

insert into public.contracts (
  title, description,
  creator_id, taker_id,
  category_id, status, payment_type,
  salary_per_hour, lump_sum,
  address, latitude, longitude,
  estimated_hours, preferred_date, created_at
)
values
  (
    'After-Hours Office Cleaning (2×/week)',
    'Looking for a reliable cleaner to maintain a small 4-person office in Lucerne every Tuesday and Friday evening (18:00–21:00). Tasks: vacuum all floors, sanitise kitchen and toilets, empty bins, wipe desks. All supplies provided.',
    'a1b2c3d4-0002-0002-0002-000000000002',
    'a1b2c3d4-0005-0005-0005-000000000005',
    1, 'assigned', 'hourly',
    22.00, null,
    'Pilatusstrasse 35, 6003 Luzern', 47.0502, 8.3093,
    5.0, '2026-05-06', now() - interval '10 days'
  ),
  (
    'Weekly Lawn Mowing & Garden Tidy',
    'Need someone to mow the lawn and do a general garden tidy every Saturday morning from 09:00 to 11:00. Garden is roughly 200 m². Lawnmower, rake and other tools are available in the garden shed.',
    'a1b2c3d4-0003-0003-0003-000000000003',
    'a1b2c3d4-0006-0006-0006-000000000006',
    2, 'assigned', 'lump_sum',
    null, 60.00,
    'Route de Chêne 45, 1208 Genève', 46.1988, 6.1662,
    null, '2026-05-03', now() - interval '14 days'
  ),
  (
    'Python Data Processing Script',
    'Need a Python script that reads multiple CSV files from a folder, validates and cleans the data (handle missing values, fix date formats), and outputs a formatted Excel summary report with totals per category. Must include error handling and clear comments.',
    'a1b2c3d4-0001-0001-0001-000000000001',
    'a1b2c3d4-0007-0007-0007-000000000007',
    4, 'assigned', 'hourly',
    50.00, null,
    'Technoparkstrasse 1, 8005 Zürich', 47.3892, 8.5181,
    6.0, '2026-05-07', now() - interval '7 days'
  );

-- ── COMPLETED (4) ────────────────────────────────────────────

insert into public.contracts (
  title, description,
  creator_id, taker_id,
  category_id, status, payment_type,
  salary_per_hour, lump_sum,
  address, latitude, longitude,
  estimated_hours, preferred_date,
  created_at, completed_at
)
values
  (
    'Kitchen & Bathroom Deep Clean',
    'Full deep clean of a flat including oven, fridge, bathroom tiles and grout, toilet, all kitchen surfaces and inside all cupboards.',
    'a1b2c3d4-0004-0004-0004-000000000004',
    'a1b2c3d4-0005-0005-0005-000000000005',
    1, 'completed', 'hourly',
    28.00, null,
    'Langstrasse 56, 8004 Zürich', 47.3775, 8.5270,
    3.0, '2026-04-18',
    now() - interval '18 days', now() - interval '13 days'
  ),
  (
    'German Language Tutoring (B1 → B2)',
    'Four sessions of German tutoring for an international professional preparing for a B2 exam. Focus on written grammar, oral fluency and business vocabulary.',
    'a1b2c3d4-0002-0002-0002-000000000002',
    'a1b2c3d4-0008-0008-0008-000000000008',
    5, 'completed', 'hourly',
    30.00, null,
    'Alpenquai 12, 6005 Luzern', 47.0435, 8.3151,
    4.0, '2026-04-22',
    now() - interval '20 days', now() - interval '9 days'
  ),
  (
    'Move Heavy Furniture – Home Office Remodel',
    'Move a large desk, bookshelves, and a filing cabinet from the ground floor to the first floor study. Disassembly and reassembly of the desk required.',
    'a1b2c3d4-0003-0003-0003-000000000003',
    'a1b2c3d4-0006-0006-0006-000000000006',
    3, 'completed', 'lump_sum',
    null, 280.00,
    'Chemin de la Gradelle 30, 1224 Chêne-Bougeries', 46.1947, 6.1890,
    null, '2026-04-15',
    now() - interval '25 days', now() - interval '16 days'
  ),
  (
    'WordPress Bug Fixes & Performance Tuning',
    'Fix three known bugs on a small business WordPress site (broken contact form, image gallery layout issue, slow homepage load) and optimise for PageSpeed score above 85.',
    'a1b2c3d4-0001-0001-0001-000000000001',
    'a1b2c3d4-0007-0007-0007-000000000007',
    4, 'completed', 'hourly',
    60.00, null,
    'Technoparkstrasse 1, 8005 Zürich', 47.3892, 8.5181,
    2.0, '2026-04-10',
    now() - interval '28 days', now() - interval '21 days'
  );

-- ── CANCELED (1) ─────────────────────────────────────────────

insert into public.contracts (
  title, description,
  creator_id, taker_id,
  category_id, status, payment_type,
  salary_per_hour, lump_sum,
  address, latitude, longitude,
  estimated_hours, preferred_date,
  created_at, canceled_at
)
values
  (
    'Paint Garden Fence (approx. 20 m)',
    'Garden fence needs a fresh coat of weather-proof paint before summer. Fence is about 20 m long and 150 cm high – wood, currently unpainted. Paint and brushes provided.',
    'a1b2c3d4-0002-0002-0002-000000000002', null,
    6, 'canceled', 'lump_sum',
    null, 120.00,
    'Haldenstrasse 12, 6006 Luzern', 47.0502, 8.3093,
    null, '2026-04-12',
    now() - interval '24 days', now() - interval '20 days'
  );


-- ============================================================
-- 5. APPLICATIONS
-- ============================================================
-- Uses scalar subqueries on contract title to avoid hardcoding
-- serial IDs. VALUES context auto-casts text literals to uuid.
-- ============================================================

insert into public.applications (user_id, contract_id, text, status, created_at)
values
  -- ── Open: Spring Cleaning ─────────────────────────────────
  (
    'a1b2c3d4-0005-0005-0005-000000000005',
    (select id from public.contracts where title = 'Spring Cleaning – 4.5-Room Apartment'),
    'Hi! I am Lisa, a student with 3 years of professional cleaning experience in Zürich. I am thorough, bring great attention to detail, and am available on your preferred date. Looking forward to hearing from you!',
    'pending', now() - interval '2 days'
  ),
  (
    'a1b2c3d4-0006-0006-0006-000000000006',
    (select id from public.contracts where title = 'Spring Cleaning – 4.5-Room Apartment'),
    'Hello, I am Marco. I regularly help with household cleaning and am reliable and punctual. Available on your date.',
    'pending', now() - interval '1 day'
  ),
  -- ── Open: Garden Weeding ──────────────────────────────────
  (
    'a1b2c3d4-0008-0008-0008-000000000008',
    (select id from public.contracts where title = 'Garden Weeding & Hedge Trimming'),
    'I grew up on a farm and have plenty of experience with garden maintenance. Happy to do the weeding and hedge trimming for the agreed price. Available on the weekend you mentioned.',
    'pending', now() - interval '1 day'
  ),
  -- ── Open: Smart Home Setup ────────────────────────────────
  (
    'a1b2c3d4-0007-0007-0007-000000000007',
    (select id from public.contracts where title = 'Smart Home Setup & Network Configuration'),
    'Hi Thomas! I am a CS student and have set up Philips Hue, Sonos, and Fritzbox for several clients. I can also write a small Python script to automate your lights if useful. Available on May 12.',
    'pending', now() - interval '12 hours'
  ),
  -- ── Open: Math Tutoring ───────────────────────────────────
  (
    'a1b2c3d4-0006-0006-0006-000000000006',
    (select id from public.contracts where title = 'Math Tutoring – Gymnasium (Matura Level)'),
    'Hi! I studied mathematics at ETH Zürich and have 2 years of tutoring experience with Gymnasium students. I am very familiar with the Matura syllabus. Happy to meet for a trial session first.',
    'pending', now() - interval '3 days'
  ),
  (
    'a1b2c3d4-0008-0008-0008-000000000008',
    (select id from public.contracts where title = 'Math Tutoring – Gymnasium (Matura Level)'),
    'Hello, I am David – a former teacher and current graduate student. I have tutored many students for Matura in Maths and Sciences. Very patient and structured approach.',
    'pending', now() - interval '2 days'
  ),
  -- ── Open: Moving Help ─────────────────────────────────────
  (
    'a1b2c3d4-0006-0006-0006-000000000006',
    (select id from public.contracts where title = 'Moving Help – 3-Room Apartment (Altstetten → Oerlikon)'),
    'Hello! I am strong and experienced with moves – I have helped with over 10 relocations in the Zürich area this year. Punctual and careful with your belongings. Available May 15.',
    'pending', now() - interval '4 hours'
  ),
  -- ── Assigned: Office Cleaning ─────────────────────────────
  (
    'a1b2c3d4-0005-0005-0005-000000000005',
    (select id from public.contracts where title = 'After-Hours Office Cleaning (2×/week)'),
    'Hi Petra! I am Lisa and I am very interested in this recurring position. I have office cleaning experience and am fully available Tuesday and Friday evenings. Very reliable and thorough.',
    'accepted', now() - interval '9 days'
  ),
  (
    'a1b2c3d4-0006-0006-0006-000000000006',
    (select id from public.contracts where title = 'After-Hours Office Cleaning (2×/week)'),
    'Hello, I have experience cleaning commercial spaces and am available on those evenings.',
    'rejected', now() - interval '8 days'
  ),
  -- ── Assigned: Lawn Mowing ─────────────────────────────────
  (
    'a1b2c3d4-0006-0006-0006-000000000006',
    (select id from public.contracts where title = 'Weekly Lawn Mowing & Garden Tidy'),
    'Ciao Thomas! I love working outdoors and am available every Saturday morning. I have experience mowing lawns of similar size and will leave everything tidy.',
    'accepted', now() - interval '12 days'
  ),
  (
    'a1b2c3d4-0008-0008-0008-000000000008',
    (select id from public.contracts where title = 'Weekly Lawn Mowing & Garden Tidy'),
    'Hello, I am available Saturday mornings and comfortable with garden maintenance. Please let me know if you would like to meet first.',
    'rejected', now() - interval '11 days'
  ),
  -- ── Assigned: Python Script ───────────────────────────────
  (
    'a1b2c3d4-0007-0007-0007-000000000007',
    (select id from public.contracts where title = 'Python Data Processing Script'),
    'Hi Jonas! This is right in my wheelhouse – I have built several similar CSV-to-Excel pipelines in Python using pandas and openpyxl. I can deliver clean, documented code within your estimated hours.',
    'accepted', now() - interval '6 days'
  ),
  (
    'a1b2c3d4-0005-0005-0005-000000000005',
    (select id from public.contracts where title = 'Python Data Processing Script'),
    'Hi, I have basic Python knowledge and can take a look at this task. Let me know if you would like to discuss.',
    'rejected', now() - interval '5 days'
  ),
  -- ── Completed: Kitchen & Bathroom Clean ───────────────────
  (
    'a1b2c3d4-0005-0005-0005-000000000005',
    (select id from public.contracts where title = 'Kitchen & Bathroom Deep Clean'),
    'Hi Anna! I specialise in deep cleaning in Zürich and have glowing references. Available on April 18 – happy to bring my own professional cleaning kit if preferred.',
    'accepted', now() - interval '17 days'
  ),
  -- ── Completed: German Tutoring ────────────────────────────
  (
    'a1b2c3d4-0008-0008-0008-000000000008',
    (select id from public.contracts where title = 'German Language Tutoring (B1 → B2)'),
    'Guten Tag Petra! I taught German for 4 years at a cantonal school and have extensive experience preparing international students for B2 exams. I would love to help.',
    'accepted', now() - interval '19 days'
  ),
  (
    'a1b2c3d4-0007-0007-0007-000000000007',
    (select id from public.contracts where title = 'German Language Tutoring (B1 → B2)'),
    'Hello! I am fluent in German and have tutored non-native speakers before. Happy to help with exam preparation.',
    'rejected', now() - interval '18 days'
  ),
  -- ── Completed: Heavy Furniture ────────────────────────────
  (
    'a1b2c3d4-0006-0006-0006-000000000006',
    (select id from public.contracts where title = 'Move Heavy Furniture – Home Office Remodel'),
    'Salut Thomas! I am strong, experienced, and very careful with furniture. I have the right tools for disassembly and can be there on April 15.',
    'accepted', now() - interval '24 days'
  ),
  (
    'a1b2c3d4-0008-0008-0008-000000000008',
    (select id from public.contracts where title = 'Move Heavy Furniture – Home Office Remodel'),
    'Hello, I can help with moving furniture and have done similar jobs before. Available on request.',
    'rejected', now() - interval '23 days'
  ),
  -- ── Completed: WordPress Fixes ────────────────────────────
  (
    'a1b2c3d4-0007-0007-0007-000000000007',
    (select id from public.contracts where title = 'WordPress Bug Fixes & Performance Tuning'),
    'Hi Jonas! I have fixed similar WordPress issues many times – contact forms (usually a plugin conflict), gallery layouts, and page speed. I know exactly where to look. Can deliver within 2 hours.',
    'accepted', now() - interval '27 days'
  ),
  (
    'a1b2c3d4-0008-0008-0008-000000000008',
    (select id from public.contracts where title = 'WordPress Bug Fixes & Performance Tuning'),
    'Hello, I have some WordPress experience and can take a look at the issues. Let me know more details.',
    'rejected', now() - interval '26 days'
  );


-- ============================================================
-- 6. REVIEWS
-- ============================================================
-- Only for completed contracts. The update_profile_rating()
-- trigger fires after each insert and auto-updates
-- profiles.rating_avg and profiles.review_count.
-- ============================================================

insert into public.reviews (contract_id, reviewed_by_id, reviewed_to_id, rating, comment, created_at)
values
  -- ── Kitchen & Bathroom Deep Clean ─────────────────────────
  -- Anna → Lisa
  (
    (select id from public.contracts where title = 'Kitchen & Bathroom Deep Clean'),
    'a1b2c3d4-0004-0004-0004-000000000004',
    'a1b2c3d4-0005-0005-0005-000000000005',
    5, 'Lisa was absolutely fantastic – punctual, thorough, and professional. The apartment looked brand new. Will definitely hire again!',
    now() - interval '12 days'
  ),
  -- Lisa → Anna
  (
    (select id from public.contracts where title = 'Kitchen & Bathroom Deep Clean'),
    'a1b2c3d4-0005-0005-0005-000000000005',
    'a1b2c3d4-0004-0004-0004-000000000004',
    4, 'Great client! Clear instructions, everything prepared, and paid promptly. Would work for Anna again.',
    now() - interval '11 days'
  ),
  -- ── German Language Tutoring ──────────────────────────────
  -- Petra → David
  (
    (select id from public.contracts where title = 'German Language Tutoring (B1 → B2)'),
    'a1b2c3d4-0002-0002-0002-000000000002',
    'a1b2c3d4-0008-0008-0008-000000000008',
    4, 'David is a patient and knowledgeable tutor. My German improved noticeably over the four sessions. Highly recommended for exam preparation.',
    now() - interval '8 days'
  ),
  -- David → Petra
  (
    (select id from public.contracts where title = 'German Language Tutoring (B1 → B2)'),
    'a1b2c3d4-0008-0008-0008-000000000008',
    'a1b2c3d4-0002-0002-0002-000000000002',
    5, 'Wonderful client – well-organised, motivated, and very friendly. Made the sessions enjoyable. Five stars!',
    now() - interval '7 days'
  ),
  -- ── Move Heavy Furniture ──────────────────────────────────
  -- Thomas → Marco
  (
    (select id from public.contracts where title = 'Move Heavy Furniture – Home Office Remodel'),
    'a1b2c3d4-0003-0003-0003-000000000003',
    'a1b2c3d4-0006-0006-0006-000000000006',
    5, 'Marco was strong, careful, and very punctual. Not a single scratch on any furniture. Disassembled and reassembled the desk perfectly. Highly recommend!',
    now() - interval '15 days'
  ),
  -- Marco → Thomas
  (
    (select id from public.contracts where title = 'Move Heavy Furniture – Home Office Remodel'),
    'a1b2c3d4-0006-0006-0006-000000000006',
    'a1b2c3d4-0003-0003-0003-000000000003',
    4, 'Good job description, everything was prepared and easy to find. Fair pay and a relaxed atmosphere. Would work for Thomas again.',
    now() - interval '14 days'
  ),
  -- ── WordPress Bug Fixes ───────────────────────────────────
  -- Jonas → Sarah
  (
    (select id from public.contracts where title = 'WordPress Bug Fixes & Performance Tuning'),
    'a1b2c3d4-0001-0001-0001-000000000001',
    'a1b2c3d4-0007-0007-0007-000000000007',
    5, 'Sarah fixed all three bugs quickly and the PageSpeed score went from 62 to 91. Excellent communication throughout. Will hire again for sure.',
    now() - interval '20 days'
  ),
  -- Sarah → Jonas
  (
    (select id from public.contracts where title = 'WordPress Bug Fixes & Performance Tuning'),
    'a1b2c3d4-0007-0007-0007-000000000007',
    'a1b2c3d4-0001-0001-0001-000000000001',
    4, 'Jonas had a well-specified brief which made the work very efficient. Prompt payment, easy to communicate with. Good experience overall.',
    now() - interval '19 days'
  );


-- ============================================================
-- 7. INFO BANNERS
-- ============================================================

insert into public.infobanners (topic, start_date, end_date, message)
values
  (
    'Scheduled Maintenance',
    now() + interval '4 days',
    now() + interval '5 days',
    'ChliJobs will be offline for scheduled maintenance on 5 May 2026 from 22:00 to 02:00 (CEST). Please save your work beforehand. We apologise for any inconvenience.'
  ),
  (
    'New Feature: Lump Sum Payments',
    now() - interval '3 days',
    now() + interval '9 days',
    'You can now post jobs with a fixed lump-sum price – perfect for moving help, garden work, or any task where hourly billing does not apply. Try it when creating your next contract!'
  ),
  (
    'Welcome to ChliJobs Beta!',
    now() - interval '32 days',
    now() - interval '10 days',
    'We are thrilled to launch the ChliJobs beta in Switzerland. Post your first job or apply for one today – and please share your feedback so we can keep improving the platform.'
  );
