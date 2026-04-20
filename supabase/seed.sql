insert into public.categories (name, slug)
values
  ('Cleaning',   'cleaning'),
  ('Gardening',  'gardening'),
  ('Moving',     'moving'),
  ('IT Support', 'it-support'),
  ('Tutoring',   'tutoring'),
  ('Other',      'other')
on conflict (name) do nothing;
