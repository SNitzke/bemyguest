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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          actor_id: string | null
          created_at: string
          event: string
          id: string
          reference_id: string | null
          tenancy_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          event: string
          id?: string
          reference_id?: string | null
          tenancy_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          event?: string
          id?: string
          reference_id?: string | null
          tenancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_documents: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          path: string
          shared: boolean
          tenancy_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          name: string
          path: string
          shared?: boolean
          tenancy_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          path?: string
          shared?: boolean
          tenancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_documents_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_allocations: {
        Row: {
          amount: number
          charge_id: string
          created_at: string
          expense_id: string
          id: string
        }
        Insert: {
          amount: number
          charge_id: string
          created_at?: string
          expense_id: string
          id?: string
        }
        Update: {
          amount?: number
          charge_id?: string
          created_at?: string
          expense_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_allocations_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "rent_charges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_allocations_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "rental_expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      deposit_deductions: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string
          tenancy_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          reason: string
          tenancy_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          tenancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deposit_deductions_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      inventories: {
        Row: {
          agreed_at: string | null
          agreed_by: string | null
          area: string
          condition: string
          created_at: string
          id: string
          note: string | null
          phase: string
          photo_path: string | null
          tenancy_id: string
        }
        Insert: {
          agreed_at?: string | null
          agreed_by?: string | null
          area: string
          condition: string
          created_at?: string
          id?: string
          note?: string | null
          phase: string
          photo_path?: string | null
          tenancy_id: string
        }
        Update: {
          agreed_at?: string | null
          agreed_by?: string | null
          area?: string
          condition?: string
          created_at?: string
          id?: string
          note?: string | null
          phase?: string
          photo_path?: string | null
          tenancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventories_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          annual_increase: number | null
          code: string
          created_at: string
          deposit_amount: number
          end_date: string | null
          grace_days: number
          id: string
          landlord_id: string
          payment_day: number
          property_id: string
          rent_amount: number
          start_date: string
          status: string
          tenant_email: string
          tenant_name: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          annual_increase?: number | null
          code?: string
          created_at?: string
          deposit_amount?: number
          end_date?: string | null
          grace_days?: number
          id?: string
          landlord_id: string
          payment_day?: number
          property_id: string
          rent_amount?: number
          start_date?: string
          status?: string
          tenant_email: string
          tenant_name: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          annual_increase?: number | null
          code?: string
          created_at?: string
          deposit_amount?: number
          end_date?: string | null
          grace_days?: number
          id?: string
          landlord_id?: string
          payment_day?: number
          property_id?: string
          rent_amount?: number
          start_date?: string
          status?: string
          tenant_email?: string
          tenant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          issue_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          issue_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          issue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          actual_cost: number | null
          created_at: string
          description: string | null
          estimated_cost: number | null
          id: string
          landlord_id: string
          media_paths: string[]
          payer: string
          payment_note: string | null
          priority: string
          property_id: string
          provider_name: string | null
          provider_phone: string | null
          receipt_path: string | null
          reimbursement_mode: string | null
          reimbursement_months: number | null
          status: string
          tenancy_id: string | null
          tenant_id: string
          tenant_paid_amount: number | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          landlord_id: string
          media_paths?: string[]
          payer?: string
          payment_note?: string | null
          priority?: string
          property_id: string
          provider_name?: string | null
          provider_phone?: string | null
          receipt_path?: string | null
          reimbursement_mode?: string | null
          reimbursement_months?: number | null
          status?: string
          tenancy_id?: string | null
          tenant_id: string
          tenant_paid_amount?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          created_at?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          landlord_id?: string
          media_paths?: string[]
          payer?: string
          payment_note?: string | null
          priority?: string
          property_id?: string
          provider_name?: string | null
          provider_phone?: string | null
          receipt_path?: string | null
          reimbursement_mode?: string | null
          reimbursement_months?: number | null
          status?: string
          tenancy_id?: string | null
          tenant_id?: string
          tenant_paid_amount?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_notices: {
        Row: {
          content: string
          id: string
          landlord_id: string
          state: string
        }
        Insert: {
          content: string
          id?: string
          landlord_id: string
          state: string
        }
        Update: {
          content?: string
          id?: string
          landlord_id?: string
          state?: string
        }
        Relationships: []
      }
      maintenance_records: {
        Row: {
          category: string
          cost: number | null
          created_at: string
          id: string
          landlord_id: string
          next_due_on: string | null
          notes: string | null
          property_id: string
          repaired_on: string
          title: string
        }
        Insert: {
          category?: string
          cost?: number | null
          created_at?: string
          id?: string
          landlord_id: string
          next_due_on?: string | null
          notes?: string | null
          property_id: string
          repaired_on?: string
          title: string
        }
        Update: {
          category?: string
          cost?: number | null
          created_at?: string
          id?: string
          landlord_id?: string
          next_due_on?: string | null
          notes?: string | null
          property_id?: string
          repaired_on?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
          tenancy_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
          tenancy_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          tenancy_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          advance_days: number
          contract_alerts: boolean
          message_alerts: boolean
          payment_reminders: boolean
          proof_alerts: boolean
          reminder_text: string
          repair_alerts: boolean
          user_id: string
          weekly_summary: boolean
        }
        Insert: {
          advance_days?: number
          contract_alerts?: boolean
          message_alerts?: boolean
          payment_reminders?: boolean
          proof_alerts?: boolean
          reminder_text?: string
          repair_alerts?: boolean
          user_id: string
          weekly_summary?: boolean
        }
        Update: {
          advance_days?: number
          contract_alerts?: boolean
          message_alerts?: boolean
          payment_reminders?: boolean
          proof_alerts?: boolean
          reminder_text?: string
          repair_alerts?: boolean
          user_id?: string
          weekly_summary?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          event_key: string | null
          id: string
          path: string
          read_at: string | null
          reference_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_key?: string | null
          id?: string
          path: string
          read_at?: string | null
          reference_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_key?: string | null
          id?: string
          path?: string
          read_at?: string | null
          reference_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          category: string
          charge_id: string | null
          confirmation_status: string
          created_at: string
          id: string
          kind: string
          landlord_id: string
          method: string
          migrated_expense_id: string | null
          notes: string | null
          paid_on: string
          proof_path: string | null
          property_id: string | null
          receipt_number: number
          review_note: string | null
          tenant_id: string | null
        }
        Insert: {
          amount: number
          category?: string
          charge_id?: string | null
          confirmation_status?: string
          created_at?: string
          id?: string
          kind?: string
          landlord_id: string
          method?: string
          migrated_expense_id?: string | null
          notes?: string | null
          paid_on?: string
          proof_path?: string | null
          property_id?: string | null
          receipt_number?: number
          review_note?: string | null
          tenant_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          charge_id?: string | null
          confirmation_status?: string
          created_at?: string
          id?: string
          kind?: string
          landlord_id?: string
          method?: string
          migrated_expense_id?: string | null
          notes?: string | null
          paid_on?: string
          proof_path?: string | null
          property_id?: string | null
          receipt_number?: number
          review_note?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "rent_charges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_migrated_expense_id_fkey"
            columns: ["migrated_expense_id"]
            isOneToOne: false
            referencedRelation: "rental_expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          emergency_contact: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string
          emergency_contact?: string | null
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          emergency_contact?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          created_at: string
          description: string | null
          id: string
          landlord_id: string
          name: string
          rent_amount: number
          state: string | null
          updated_at: string
        }
        Insert: {
          address: string
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          landlord_id: string
          name: string
          rent_amount?: number
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          landlord_id?: string
          name?: string
          rent_amount?: number
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rent_charges: {
        Row: {
          amount: number
          created_at: string
          credit_applied: number
          due_on: string
          id: string
          period: string
          tenancy_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          credit_applied?: number
          due_on: string
          id?: string
          period: string
          tenancy_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          credit_applied?: number
          due_on?: string
          id?: string
          period?: string
          tenancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_charges_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          installments: number
          issue_id: string | null
          note: string | null
          paid_on: string
          payer: string
          property_id: string
          reimbursement: string
          source_payment_id: string | null
          tenancy_id: string
          unapplied_credit: number
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          id?: string
          installments?: number
          issue_id?: string | null
          note?: string | null
          paid_on?: string
          payer: string
          property_id: string
          reimbursement?: string
          source_payment_id?: string | null
          tenancy_id: string
          unapplied_credit?: number
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          installments?: number
          issue_id?: string | null
          note?: string | null
          paid_on?: string
          payer?: string
          property_id?: string
          reimbursement?: string
          source_payment_id?: string | null
          tenancy_id?: string
          unapplied_credit?: number
        }
        Relationships: [
          {
            foreignKeyName: "rental_expenses_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: true
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_expenses_source_payment_id_fkey"
            columns: ["source_payment_id"]
            isOneToOne: true
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_expenses_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          plan: string
          status: string
          stripe_customer_id: string | null
          trial_ends_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          trial_ends_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          trial_ends_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tenancies: {
        Row: {
          annual_increase: number | null
          created_at: string
          deposit_amount: number
          deposit_status: string
          end_date: string | null
          grace_days: number
          id: string
          landlord_id: string
          payment_day: number
          property_id: string
          rent_amount: number
          start_date: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          annual_increase?: number | null
          created_at?: string
          deposit_amount?: number
          deposit_status?: string
          end_date?: string | null
          grace_days?: number
          id?: string
          landlord_id: string
          payment_day?: number
          property_id: string
          rent_amount?: number
          start_date?: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          annual_increase?: number | null
          created_at?: string
          deposit_amount?: number
          deposit_status?: string
          end_date?: string | null
          grace_days?: number
          id?: string
          landlord_id?: string
          payment_day?: number
          property_id?: string
          rent_amount?: number
          start_date?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenancies_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: { Args: { _code: string }; Returns: string }
      agree_inventory: { Args: { _id: string }; Returns: undefined }
      apply_rent_credits: { Args: { _tenancy: string }; Returns: undefined }
      contract_owner: { Args: { _id: string }; Returns: boolean }
      contract_party: { Args: { _id: string }; Returns: boolean }
      generate_rent_charges: { Args: { _tenancy: string }; Returns: undefined }
      get_invitation: {
        Args: { _code: string }
        Returns: {
          landlord_name: string
          property_address: string
          property_city: string
          property_name: string
          rent_amount: number
          status: string
          tenant_email: string
          tenant_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_tenant_of: {
        Args: { _property_id: string; _user_id: string }
        Returns: boolean
      }
      landlord_has_access: { Args: { _user_id: string }; Returns: boolean }
      plan_property_limit: { Args: { _plan: string }; Returns: number }
      record_charge_payment: {
        Args: {
          _amount: number
          _charge: string
          _method: string
          _note?: string
          _paid_on: string
          _proof?: string
        }
        Returns: string
      }
      refresh_rental_reminders: { Args: never; Returns: undefined }
      resolve_repair: {
        Args: { _cost: number; _issue: string; _months?: number }
        Returns: undefined
      }
      review_payment: {
        Args: { _approve: boolean; _note?: string; _payment: string }
        Returns: undefined
      }
      shares_tenancy: { Args: { _a: string; _b: string }; Returns: boolean }
    }
    Enums: {
      app_role: "landlord" | "tenant"
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
    Enums: {
      app_role: ["landlord", "tenant"],
    },
  },
} as const
