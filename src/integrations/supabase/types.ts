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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_wallet: {
        Row: {
          balance: number
          completed_jobs_count: number
          id: string
          total_buzzer_payout: number
          total_incoming: number
          total_revenue: number
          updated_at: string
        }
        Insert: {
          balance?: number
          completed_jobs_count?: number
          id?: string
          total_buzzer_payout?: number
          total_incoming?: number
          total_revenue?: number
          updated_at?: string
        }
        Update: {
          balance?: number
          completed_jobs_count?: number
          id?: string
          total_buzzer_payout?: number
          total_incoming?: number
          total_revenue?: number
          updated_at?: string
        }
        Relationships: []
      }
      admin_withdrawals: {
        Row: {
          account_no: string | null
          amount: number
          created_at: string
          id: string
          method: string
          provider: string | null
          status: string
        }
        Insert: {
          account_no?: string | null
          amount: number
          created_at?: string
          id: string
          method: string
          provider?: string | null
          status?: string
        }
        Update: {
          account_no?: string | null
          amount?: number
          created_at?: string
          id?: string
          method?: string
          provider?: string | null
          status?: string
        }
        Relationships: []
      }
      app_accounts: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          company: string | null
          created_at: string
          email: string
          followers: number | null
          industry: string | null
          name: string
          password_hash: string
          phone: string | null
          platform: string | null
          rating?: number | null
          role: string
          total_reviews?: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company?: string | null
          created_at?: string
          email: string
          followers?: number | null
          industry?: string | null
          name: string
          password_hash: string
          phone?: string | null
          platform?: string | null
          rating?: number | null
          role: string
          total_reviews?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company?: string | null
          created_at?: string
          email?: string
          followers?: number | null
          industry?: string | null
          name?: string
          password_hash?: string
          phone?: string | null
          platform?: string | null
          rating?: number | null
          role?: string
          total_reviews?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      buzzer_applications: {
        Row: {
          bio: string | null
          category: string | null
          city: string | null
          created_at: string
          email: string
          followers: number
          id: string
          name: string
          phone: string | null
          platform: string
          platforms: string[]
          review_note: string | null
          reviewed_at: string | null
          status: string
          submitted_at: string
          updated_at: string
          username: string
        }
        Insert: {
          bio?: string | null
          category?: string | null
          city?: string | null
          created_at?: string
          email: string
          followers?: number
          id: string
          name: string
          phone?: string | null
          platform?: string
          platforms?: string[]
          review_note?: string | null
          reviewed_at?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          username?: string
        }
        Update: {
          bio?: string | null
          category?: string | null
          city?: string | null
          created_at?: string
          email?: string
          followers?: number
          id?: string
          name?: string
          phone?: string | null
          platform?: string
          platforms?: string[]
          review_note?: string | null
          reviewed_at?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      buzzer_levels: {
        Row: {
          created_at: string
          emoji: string
          max_followers: number | null
          min_followers: number
          name: string
          payout_per_job: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          emoji?: string
          max_followers?: number | null
          min_followers?: number
          name: string
          payout_per_job?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          emoji?: string
          max_followers?: number | null
          min_followers?: number
          name?: string
          payout_per_job?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      buzzer_ratings: {
        Row: {
          buzzer_email: string
          buzzer_name: string
          campaign_title: string
          comment: string | null
          created_at: string
          customer_id: string
          customer_email: string
          customer_name: string
          id: string
          job_id: string
          stars: number
          updated_at: string
        }
        Insert: {
          buzzer_email: string
          buzzer_name?: string
          campaign_title?: string
          comment?: string | null
          created_at?: string
          customer_id: string
          customer_email: string
          customer_name?: string
          id?: string
          job_id: string
          stars?: number
          updated_at?: string
        }
        Update: {
          buzzer_email?: string
          buzzer_name?: string
          campaign_title?: string
          comment?: string | null
          created_at?: string
          customer_email?: string
          customer_id?: string
          customer_name?: string
          id?: string
          job_id?: string
          stars?: number
          updated_at?: string
        }
        Relationships: []
      }
      buzzer_wallets: {
        Row: {
          avatar_url: string | null
          balance: number
          buzzer_email: string
          buzzer_name: string
          campaigns_completed: number
          followers: number
          level: string | null
          level_assigned_at: string | null
          online: boolean
          pending_balance: number
          platform: string | null
          rating: number
          total_reviews: number
          updated_at: string
          verified_followers: number
        }
        Insert: {
          avatar_url?: string | null
          balance?: number
          buzzer_email: string
          buzzer_name: string
          campaigns_completed?: number
          followers?: number
          level?: string | null
          level_assigned_at?: string | null
          online?: boolean
          pending_balance?: number
          platform?: string | null
          rating?: number
          total_reviews?: number
          updated_at?: string
          verified_followers?: number
        }
        Update: {
          avatar_url?: string | null
          balance?: number
          buzzer_email?: string
          buzzer_name?: string
          campaigns_completed?: number
          followers?: number
          level?: string | null
          level_assigned_at?: string | null
          online?: boolean
          pending_balance?: number
          platform?: string | null
          rating?: number
          updated_at?: string
          verified_followers?: number
        }
        Relationships: []
      }
      campaign_jobs: {
        Row: {
          brief: string
          admin_amount: number | null
          admin_percentage: number | null
          buzzer_email: string | null
          buzzer_amount: number | null
          buzzer_level: string | null
          buzzer_name: string | null
          buzzer_percentage: number | null
          campaign_id: string | null
          campaign_title: string
          created_at: string
          deadline: string
          gross_price: number
          id: string
          note: string | null
          payout: number
          platform: string
          proof_url: string | null
          rejection_reason: string | null
          rejected_at: string | null
          rejected_by: string | null
          resubmission_count: number
          status: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          brief?: string
          admin_amount?: number | null
          admin_percentage?: number | null
          buzzer_email?: string | null
          buzzer_amount?: number | null
          buzzer_level?: string | null
          buzzer_name?: string | null
          buzzer_percentage?: number | null
          campaign_id?: string | null
          campaign_title: string
          created_at?: string
          deadline?: string
          gross_price?: number
          id?: string
          note?: string | null
          payout?: number
          platform: string
          proof_url?: string | null
          rejection_reason?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          resubmission_count?: number
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          brief?: string
          admin_amount?: number | null
          admin_percentage?: number | null
          buzzer_email?: string | null
          buzzer_amount?: number | null
          buzzer_level?: string | null
          buzzer_name?: string | null
          buzzer_percentage?: number | null
          campaign_id?: string | null
          campaign_title?: string
          created_at?: string
          deadline?: string
          gross_price?: number
          id?: string
          note?: string | null
          payout?: number
          platform?: string
          proof_url?: string | null
          rejection_reason?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          resubmission_count?: number
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      campaign_job_submissions: {
        Row: {
          buzzer_email: string
          created_at: string
          id: string
          job_id: string
          proof_url: string
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          status: string
          submission_number: number
          submitted_at: string
          updated_at: string
        }
        Insert: {
          buzzer_email: string
          created_at?: string
          id?: string
          job_id: string
          proof_url: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          status?: string
          submission_number: number
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          buzzer_email?: string
          created_at?: string
          id?: string
          job_id?: string
          proof_url?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          status?: string
          submission_number?: number
          submitted_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_messages: {
        Row: {
          body: string
          campaign_id: string | null
          created_at: string
          from_email: string
          from_name: string
          from_role: string
          id: string
          read_at: string | null
          to_email: string
        }
        Insert: {
          body: string
          campaign_id?: string | null
          created_at?: string
          from_email: string
          from_name: string
          from_role: string
          id?: string
          read_at?: string | null
          to_email: string
        }
        Update: {
          body?: string
          campaign_id?: string | null
          created_at?: string
          from_email?: string
          from_name?: string
          from_role?: string
          id?: string
          read_at?: string | null
          to_email?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          brief: string
          budget: number
          created_at: string
          customer_email: string
          customer_name: string
          deadline: string
          id: string
          payout_per_buzzer: number
          platform: string
          slots: number
          status: string
          title: string
          updated_at: string
          payment_id: string | null
          payment_status: string
          payment_rejection_reason: string | null
          target_reached_at: string | null
        }
        Insert: {
          brief?: string
          budget?: number
          created_at?: string
          customer_email: string
          customer_name: string
          deadline?: string
          id?: string
          payout_per_buzzer?: number
          platform: string
          slots?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          brief?: string
          budget?: number
          created_at?: string
          customer_email?: string
          customer_name?: string
          deadline?: string
          id?: string
          payout_per_buzzer?: number
          platform?: string
          slots?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_accounts: {
        Row: {
          active: boolean
          active_campaigns: number
          avatar_url: string | null
          campaigns_count: number
          email: string
          name: string
          total_spent: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          active_campaigns?: number
          avatar_url?: string | null
          campaigns_count?: number
          email: string
          name: string
          total_spent?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          active_campaigns?: number
          avatar_url?: string | null
          campaigns_count?: number
          email?: string
          name?: string
          total_spent?: number
          updated_at?: string
        }
        Relationships: []
      }
      finance_activity: {
        Row: {
          amount: number | null
          created_at: string
          description: string | null
          id: string
          link: string | null
          ref_id: string | null
          ref_table: string | null
          title: string
          type: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          ref_id?: string | null
          ref_table?: string | null
          title: string
          type: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          ref_id?: string | null
          ref_table?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      finance_notifications: {
        Row: {
          body: string | null
          category: string
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
        }
        Insert: {
          body?: string | null
          category: string
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          buzzer_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          buzzer_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          buzzer_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          buzzer_cost: number
          campaign_name: string
          campaign_type: string
          created_at: string
          customer_email: string | null
          customer_name: string
          fee: number
          id: string
          invoice_no: string
          method: string
          note: string | null
          paid_at: string | null
          status: string
          updated_at: string
          campaign_id: string | null
          proof_url: string | null
          rejection_reason: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount?: number
          buzzer_cost?: number
          campaign_name: string
          campaign_type: string
          created_at?: string
          customer_email?: string | null
          customer_name: string
          fee?: number
          id?: string
          invoice_no: string
          method?: string
          note?: string | null
          paid_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          buzzer_cost?: number
          campaign_name?: string
          campaign_type?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          fee?: number
          id?: string
          invoice_no?: string
          method?: string
          note?: string | null
          paid_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          account_name: string
          bio: string
          buzzer_email: string
          buzzer_name: string
          category: string
          created_at: string
          followers: number
          following_count: number
          id: string
          is_active: boolean
          photo_url: string | null
          platform: string
          posts: number
          profile_url: string
          rejection_note: string | null
          updated_at: string
          username: string
          verification: string
        }
        Insert: {
          account_name?: string
          bio?: string
          buzzer_email: string
          buzzer_name?: string
          category?: string
          created_at?: string
          followers?: number
          following_count?: number
          id?: string
          is_active?: boolean
          photo_url?: string | null
          platform: string
          posts?: number
          profile_url?: string
          rejection_note?: string | null
          updated_at?: string
          username: string
          verification?: string
        }
        Update: {
          account_name?: string
          bio?: string
          buzzer_email?: string
          buzzer_name?: string
          category?: string
          created_at?: string
          followers?: number
          following_count?: number
          id?: string
          is_active?: boolean
          photo_url?: string | null
          platform?: string
          posts?: number
          profile_url?: string
          rejection_note?: string | null
          updated_at?: string
          username?: string
          verification?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          account_no: string
          admin_note: string | null
          amount: number
          approved_at: string | null
          buzzer_email: string
          buzzer_name: string
          completed_at: string | null
          created_at: string
          id: string
          method: string
          proof_url: string | null
          requested_at: string
          status: string
          updated_at: string
        }
        Insert: {
          account_no?: string
          admin_note?: string | null
          amount?: number
          approved_at?: string | null
          buzzer_email: string
          buzzer_name: string
          completed_at?: string | null
          created_at?: string
          id?: string
          method?: string
          proof_url?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          account_no?: string
          admin_note?: string | null
          amount?: number
          approved_at?: string | null
          buzzer_email?: string
          buzzer_name?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          method?: string
          proof_url?: string | null
          requested_at?: string
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
