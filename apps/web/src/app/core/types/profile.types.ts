import type { Database } from './database.types';

export type PreferredRole = Database['public']['Enums']['preferred_role'];

export type Profile = Database['public']['Tables']['profiles']['Row'];

/** Fields allowed when updating a profile (excludes server-managed fields). */
export type ProfileUpdate = Omit<
  Database['public']['Tables']['profiles']['Update'],
  'id' | 'created_at' | 'updated_at'
>;

/** Data required when registering a new user. */
export interface RegisterData {
  first_name: string;
  last_name: string;
  birthday: string;
  preferred_role: PreferredRole;
}
