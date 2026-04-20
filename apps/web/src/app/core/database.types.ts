export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      applications: {
        Row: {
          contract_id: number | null;
          created_at: string | null;
          id: number;
          status: string | null;
          text: string | null;
          user_id: string | null;
        };
        Insert: {
          contract_id?: number | null;
          created_at?: string | null;
          id?: number;
          status?: string | null;
          text?: string | null;
          user_id?: string | null;
        };
        Update: {
          contract_id?: number | null;
          created_at?: string | null;
          id?: number;
          status?: string | null;
          text?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'applications_contract_id_fkey';
            columns: ['contract_id'];
            isOneToOne: false;
            referencedRelation: 'contracts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'applications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
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
      contract_images: {
        Row: {
          contract_id: number | null;
          created_at: string | null;
          id: number;
          image_path: string;
        };
        Insert: {
          contract_id?: number | null;
          created_at?: string | null;
          id?: number;
          image_path: string;
        };
        Update: {
          contract_id?: number | null;
          created_at?: string | null;
          id?: number;
          image_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'contract_images_contract_id_fkey';
            columns: ['contract_id'];
            isOneToOne: false;
            referencedRelation: 'contracts';
            referencedColumns: ['id'];
          },
        ];
      };
      contracts: {
        Row: {
          address: string | null;
          canceled_at: string | null;
          category_id: number | null;
          completed_at: string | null;
          created_at: string | null;
          creator_id: string;
          description: string | null;
          estimated_hours: number | null;
          id: number;
          latitude: number | null;
          longitude: number | null;
          preferred_date: string | null;
          salary_per_hour: number | null;
          status: string;
          taker_id: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          canceled_at?: string | null;
          category_id?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
          creator_id: string;
          description?: string | null;
          estimated_hours?: number | null;
          id?: number;
          latitude?: number | null;
          longitude?: number | null;
          preferred_date?: string | null;
          salary_per_hour?: number | null;
          status?: string;
          taker_id?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          canceled_at?: string | null;
          category_id?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
          creator_id?: string;
          description?: string | null;
          estimated_hours?: number | null;
          id?: number;
          latitude?: number | null;
          longitude?: number | null;
          preferred_date?: string | null;
          salary_per_hour?: number | null;
          status?: string;
          taker_id?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'contracts_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contracts_creator_id_fkey';
            columns: ['creator_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contracts_taker_id_fkey';
            columns: ['taker_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_blurhash: string | null;
          avatar_path: string | null;
          bio: string | null;
          birthday: string | null;
          created_at: string;
          email: string | null;
          first_name: string;
          id: string;
          last_name: string;
          location: string | null;
          phone: string | null;
          preferred_role: string;
          rating_avg: number | null;
          review_count: number | null;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_blurhash?: string | null;
          avatar_path?: string | null;
          bio?: string | null;
          birthday?: string | null;
          created_at?: string;
          email?: string | null;
          first_name?: string;
          id: string;
          last_name?: string;
          location?: string | null;
          phone?: string | null;
          preferred_role?: string;
          rating_avg?: number | null;
          review_count?: number | null;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_blurhash?: string | null;
          avatar_path?: string | null;
          bio?: string | null;
          birthday?: string | null;
          created_at?: string;
          email?: string | null;
          first_name?: string;
          id?: string;
          last_name?: string;
          location?: string | null;
          phone?: string | null;
          preferred_role?: string;
          rating_avg?: number | null;
          review_count?: number | null;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          comment: string | null;
          contract_id: number | null;
          created_at: string | null;
          id: number;
          rating: number;
          reviewed_by_id: string;
          reviewed_to_id: string;
        };
        Insert: {
          comment?: string | null;
          contract_id?: number | null;
          created_at?: string | null;
          id?: number;
          rating: number;
          reviewed_by_id: string;
          reviewed_to_id: string;
        };
        Update: {
          comment?: string | null;
          contract_id?: number | null;
          created_at?: string | null;
          id?: number;
          rating?: number;
          reviewed_by_id?: string;
          reviewed_to_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_contract_id_fkey';
            columns: ['contract_id'];
            isOneToOne: false;
            referencedRelation: 'contracts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_reviewed_by_id_fkey';
            columns: ['reviewed_by_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_reviewed_to_id_fkey';
            columns: ['reviewed_to_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_application: {
        Args: { p_application_id: number };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
