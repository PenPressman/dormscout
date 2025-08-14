export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      buildings: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string
          school_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
          school_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "buildings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      dorm_profiles: {
        Row: {
          contact_email: string | null
          contact_enabled: boolean
          contact_first_name: string | null
          contact_last_initial: string | null
          created_at: string
          dorm_name: string
          id: string
          notes: string | null
          photos_decorated: string[] | null
          photos_empty: string[] | null
          published: boolean
          room_number: string | null
          school_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_enabled?: boolean
          contact_first_name?: string | null
          contact_last_initial?: string | null
          created_at?: string
          dorm_name: string
          id?: string
          notes?: string | null
          photos_decorated?: string[] | null
          photos_empty?: string[] | null
          published?: boolean
          room_number?: string | null
          school_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_enabled?: boolean
          contact_first_name?: string | null
          contact_last_initial?: string | null
          created_at?: string
          dorm_name?: string
          id?: string
          notes?: string | null
          photos_decorated?: string[] | null
          photos_empty?: string[] | null
          published?: boolean
          room_number?: string | null
          school_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dorm_profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          caption: string | null
          created_at: string
          faces_blurred: boolean
          id: string
          photo_type: Database["public"]["Enums"]["photo_type"]
          room_id: string
          storage_url: string
          taken_at: string | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          faces_blurred?: boolean
          id?: string
          photo_type?: Database["public"]["Enums"]["photo_type"]
          room_id: string
          storage_url: string
          taken_at?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          faces_blurred?: boolean
          id?: string
          photo_type?: Database["public"]["Enums"]["photo_type"]
          room_id?: string
          storage_url?: string
          taken_at?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          room_id: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          room_id: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          room_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          school_id: string | null
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          school_id?: string | null
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          school_id?: string | null
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          bed_type: string | null
          building_id: string
          created_at: string
          dimensions: string | null
          floor: number | null
          id: string
          notes: string | null
          room_number: string
          room_type: string | null
          updated_at: string
        }
        Insert: {
          bed_type?: string | null
          building_id: string
          created_at?: string
          dimensions?: string | null
          floor?: number | null
          id?: string
          notes?: string | null
          room_number: string
          room_type?: string | null
          updated_at?: string
        }
        Update: {
          bed_type?: string | null
          building_id?: string
          created_at?: string
          dimensions?: string | null
          floor?: number | null
          id?: string
          notes?: string | null
          room_number?: string
          room_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_dorms: {
        Row: {
          created_at: string
          dorm_profile_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dorm_profile_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dorm_profile_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_dorms_dorm_profile_id_fkey"
            columns: ["dorm_profile_id"]
            isOneToOne: false
            referencedRelation: "dorm_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          created_at: string
          domain_whitelist: string[]
          id: string
          name: string
          primary_color: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain_whitelist: string[]
          id?: string
          name: string
          primary_color?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain_whitelist?: string[]
          id?: string
          name?: string
          primary_color?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_profile: {
        Args: { new_email: string; new_school_id: string; new_user_id: string }
        Returns: undefined
      }
      get_dorm_profile_secure: {
        Args: { profile_id: string }
        Returns: {
          contact_email: string
          contact_enabled: boolean
          contact_first_name: string
          contact_last_initial: string
          created_at: string
          dorm_name: string
          id: string
          notes: string
          photos_decorated: string
          photos_empty: string[]
          published: boolean
          room_number: string
          school_id: string
          updated_at: string
          user_id: string
        }[]
      }
      get_public_profile: {
        Args: { profile_user_id: string }
        Returns: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          school_id: string
          updated_at: string
          user_id: string
          verified_at: string
        }[]
      }
      get_user_school_id: {
        Args: { user_uuid: string }
        Returns: string
      }
      search_dorm_profiles_secure: {
        Args: { search_school_id: string; search_term?: string }
        Returns: {
          contact_email: string
          contact_enabled: boolean
          contact_first_name: string
          contact_last_initial: string
          created_at: string
          dorm_name: string
          id: string
          notes: string
          photos_decorated: string[]
          photos_empty: string[]
          published: boolean
          room_number: string
          school_id: string
          updated_at: string
          user_id: string
        }[]
      }
      user_can_access_school_content: {
        Args: { content_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "moderator" | "admin"
      photo_type: "empty" | "designed" | "detail"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "moderator", "admin"],
      photo_type: ["empty", "designed", "detail"],
    },
  },
} as const
