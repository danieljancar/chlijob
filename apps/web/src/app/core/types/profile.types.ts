import type { Database } from './database.types';

export type PreferredRole = Database['public']['Enums']['preferred_role'];

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type ProfileUpdate = Omit<
  Database['public']['Tables']['profiles']['Update'],
  'id' | 'created_at' | 'updated_at'
>;

export interface RegisterData {
  first_name: string;
  last_name: string;
  birthday: string;
  preferred_role: PreferredRole;
}
