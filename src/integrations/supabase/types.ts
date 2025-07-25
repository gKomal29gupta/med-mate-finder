export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      medicine_favorites: {
        Row: {
          created_at: string
          id: string
          medicine_details: Json | null
          medicine_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          medicine_details?: Json | null
          medicine_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          medicine_details?: Json | null
          medicine_name?: string
          user_id?: string
        }
        Relationships: []
      }
      medicine_scans: {
        Row: {
          confidence_score: number | null
          detected_medicine_name: string | null
          extracted_text: string | null
          generic_suggestions: Json | null
          id: string
          image_url: string | null
          price_savings: number | null
          scan_timestamp: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          detected_medicine_name?: string | null
          extracted_text?: string | null
          generic_suggestions?: Json | null
          id?: string
          image_url?: string | null
          price_savings?: number | null
          scan_timestamp?: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          detected_medicine_name?: string | null
          extracted_text?: string | null
          generic_suggestions?: Json | null
          id?: string
          image_url?: string | null
          price_savings?: number | null
          scan_timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      medicine_searches: {
        Row: {
          generic_alternatives: Json | null
          id: string
          medicine_found: Json | null
          search_query: string
          search_timestamp: string
          user_id: string
        }
        Insert: {
          generic_alternatives?: Json | null
          id?: string
          medicine_found?: Json | null
          search_query: string
          search_timestamp?: string
          user_id: string
        }
        Update: {
          generic_alternatives?: Json | null
          id?: string
          medicine_found?: Json | null
          search_query?: string
          search_timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      Medicines: {
        Row: {
          id: number | null
          Is_discontinued: boolean | null
          manufacturer_name: string | null
          name: string | null
          pack_size_label: string | null
          "price(₹)": number | null
          short_composition1: string | null
          short_composition2: string | null
          type: string | null
        }
        Insert: {
          id?: number | null
          Is_discontinued?: boolean | null
          manufacturer_name?: string | null
          name?: string | null
          pack_size_label?: string | null
          "price(₹)"?: number | null
          short_composition1?: string | null
          short_composition2?: string | null
          type?: string | null
        }
        Update: {
          id?: number | null
          Is_discontinued?: boolean | null
          manufacturer_name?: string | null
          name?: string | null
          pack_size_label?: string | null
          "price(₹)"?: number | null
          short_composition1?: string | null
          short_composition2?: string | null
          type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          allergies: string[] | null
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          id: string
          medical_conditions: string[] | null
          notification_preferences: Json | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          id?: string
          medical_conditions?: string[] | null
          notification_preferences?: Json | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          id?: string
          medical_conditions?: string[] | null
          notification_preferences?: Json | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminder_logs: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          reminder_id: string
          scheduled_time: string
          status: string
          taken_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          reminder_id: string
          scheduled_time: string
          status?: string
          taken_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          reminder_id?: string
          scheduled_time?: string
          status?: string
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_logs_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          created_at: string
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean | null
          medicine_name: string
          notes: string | null
          reminder_type: string | null
          specific_times: string[] | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          medicine_name: string
          notes?: string | null
          reminder_type?: string | null
          specific_times?: string[] | null
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          medicine_name?: string
          notes?: string | null
          reminder_type?: string | null
          specific_times?: string[] | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
