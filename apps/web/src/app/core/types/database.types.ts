/**
 * Auto-generated Supabase database types.
 * Regenerate with: npm run db:types
 * Do not edit manually.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          birthday: string | null;
          preferred_role: 'taker' | 'giver';
          phone: string | null;
          location: string | null;
          bio: string | null;
          avatar_path: string | null;
          avatar_blurhash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          birthday?: string | null;
          preferred_role: 'taker' | 'giver';
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          avatar_path?: string | null;
          avatar_blurhash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          birthday?: string | null;
          preferred_role?: 'taker' | 'giver';
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          avatar_path?: string | null;
          avatar_blurhash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      preferred_role: 'taker' | 'giver';
    };
    CompositeTypes: { [_ in never]: never };
  };
};
