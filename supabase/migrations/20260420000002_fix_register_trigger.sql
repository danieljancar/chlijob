-- Update handle_new_user to populate all profile fields from auth metadata.
-- The client now passes first_name, last_name, birthday, preferred_role as
-- options.data in supabase.auth.signUp(), so the trigger can write them
-- atomically without a separate client-side upsert.

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public, auth as $$
begin
  insert into public.profiles (id, email, first_name, last_name, birthday, preferred_role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    nullif(new.raw_user_meta_data->>'birthday', '')::date,
    coalesce(new.raw_user_meta_data->>'preferred_role', 'taker')
  );
  return new;
end;
$$;
