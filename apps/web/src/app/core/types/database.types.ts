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
          username: string | null;
          first_name: string;
          last_name: string;
          email: string | null;
          birthday: string | null;
          preferred_role: 'taker' | 'giver';
          phone: string | null;
          location: string | null;
          bio: string | null;
          avatar_path: string | null;
          avatar_blurhash: string | null;
          rating_avg: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          birthday?: string | null;
          preferred_role?: 'taker' | 'giver';
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          avatar_path?: string | null;
          avatar_blurhash?: string | null;
          rating_avg?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          birthday?: string | null;
          preferred_role?: 'taker' | 'giver';
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          avatar_path?: string | null;
          avatar_blurhash?: string | null;
          rating_avg?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          slug?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string | null;
        };
        Relationships: [];
      };
      contracts: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          creator_id: string;
          taker_id: string | null;
          category_id: number | null;
          salary_per_hour: number | null;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          estimated_hours: number | null;
          preferred_date: string | null;
          status: 'open' | 'assigned' | 'completed' | 'canceled';
          created_at: string | null;
          updated_at: string | null;
          completed_at: string | null;
          canceled_at: string | null;
        };
        Insert: {
          id?: number;
          title: string;
          description?: string | null;
          creator_id: string;
          taker_id?: string | null;
          category_id?: number | null;
          salary_per_hour?: number | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          estimated_hours?: number | null;
          preferred_date?: string | null;
          status?: 'open' | 'assigned' | 'completed' | 'canceled';
          created_at?: string | null;
          updated_at?: string | null;
          completed_at?: string | null;
          canceled_at?: string | null;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string | null;
          creator_id?: string;
          taker_id?: string | null;
          category_id?: number | null;
          salary_per_hour?: number | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          estimated_hours?: number | null;
          preferred_date?: string | null;
          status?: 'open' | 'assigned' | 'completed' | 'canceled';
          created_at?: string | null;
          updated_at?: string | null;
          completed_at?: string | null;
          canceled_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'contracts_creator_id_fkey';
            columns: ['creator_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contracts_taker_id_fkey';
            columns: ['taker_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contracts_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      applications: {
        Row: {
          id: number;
          user_id: string | null;
          contract_id: number | null;
          text: string | null;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string | null;
        };
        Insert: {
          id?: number;
          user_id?: string | null;
          contract_id?: number | null;
          text?: string | null;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string | null;
          contract_id?: number | null;
          text?: string | null;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'applications_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'applications_contract_id_fkey';
            columns: ['contract_id'];
            referencedRelation: 'contracts';
            referencedColumns: ['id'];
          },
        ];
      };
      reviews: {
        Row: {
          id: number;
          contract_id: number | null;
          reviewed_by_id: string;
          reviewed_to_id: string;
          rating: number;
          comment: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          contract_id?: number | null;
          reviewed_by_id: string;
          reviewed_to_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          contract_id?: number | null;
          reviewed_by_id?: string;
          reviewed_to_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      contract_images: {
        Row: {
          id: number;
          image_path: string;
          contract_id: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          image_path: string;
          contract_id?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          image_path?: string;
          contract_id?: number | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      accept_application: {
        Args: { p_application_id: number };
        Returns: void;
      };
    };
    Enums: {
      preferred_role: 'taker' | 'giver';
    };
    CompositeTypes: { [_ in never]: never };
  };
};
