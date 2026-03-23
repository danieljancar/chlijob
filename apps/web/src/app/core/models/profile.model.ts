export type PreferredRole = 'taker' | 'giver';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  birthday: string | null;
  preferred_role: PreferredRole;
  phone: string | null;
  location: string | null;
  bio: string | null;
  avatar_path: string | null;
  avatar_blurhash: string | null;
  created_at: string;
  updated_at: string;
}
