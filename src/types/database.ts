export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type WorkerStatus = "pending" | "active" | "suspended" | "deleted";
export type CompanyPlan = "free" | "starter" | "pro" | "enterprise";
export type ShiftStatus = "draft" | "open" | "filled" | "in_progress" | "completed" | "cancelled";
export type ApplicationStatus = "pending" | "accepted" | "rejected" | "withdrawn" | "no_show";
export type InvoiceStatus = "pending" | "paid" | "overdue" | "cancelled";
export type PayoutStatus = "pending" | "processing" | "completed" | "failed";
export type ReviewerType = "worker" | "company";
export type SenderType = "worker" | "company" | "system";
export type CompanyMemberRole = "owner" | "admin" | "manager" | "viewer";
export type Sector = "horeca" | "retail" | "logistics" | "events" | "cleaning" | "delivery" | "construction" | "other";

export interface Database {
  public: {
    Tables: {
      workers: {
        Row: {
          id: string;
          phone: string;
          email: string | null;
          first_name: string;
          last_name: string;
          kvk_number: string | null;
          iban: string | null;
          profile_photo_url: string | null;
          bio: string | null;
          sectors: Sector[];
          city: string | null;
          lat: number | null;
          lng: number | null;
          reliability_score: number;
          total_shifts: number;
          total_hours: number;
          rating_avg: number;
          verified_at: string | null;
          status: WorkerStatus;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["workers"]["Row"], "id" | "reliability_score" | "total_shifts" | "total_hours" | "rating_avg" | "created_at" | "status"> & {
          id?: string;
          reliability_score?: number;
          total_shifts?: number;
          total_hours?: number;
          rating_avg?: number;
          created_at?: string;
          status?: WorkerStatus;
        };
        Update: Partial<Database["public"]["Tables"]["workers"]["Insert"]>;
      };
      companies: {
        Row: {
          id: string;
          name: string;
          kvk_number: string;
          logo_url: string | null;
          brand_color: string | null;
          description: string | null;
          sectors: Sector[];
          contact_email: string;
          contact_phone: string | null;
          stripe_account_id: string | null;
          plan: CompanyPlan;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["companies"]["Row"], "id" | "plan" | "status" | "created_at"> & {
          id?: string;
          plan?: CompanyPlan;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
      };
      company_members: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          role: CompanyMemberRole;
          invited_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["company_members"]["Row"], "id" | "role" | "invited_at"> & {
          id?: string;
          role?: CompanyMemberRole;
          invited_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_members"]["Insert"]>;
      };
      locations: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          address: string;
          city: string;
          lat: number;
          lng: number;
          parking_info: string | null;
          dress_code: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["locations"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["locations"]["Insert"]>;
      };
      shifts: {
        Row: {
          id: string;
          company_id: string;
          location_id: string;
          sector: Sector;
          title: string;
          description: string | null;
          date: string;
          start_time: string;
          end_time: string;
          rate_per_hour: number;
          workers_needed: number;
          workers_filled: number;
          status: ShiftStatus;
          requirements: string[];
          auto_accept_flexpool: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["shifts"]["Row"], "id" | "workers_filled" | "status" | "auto_accept_flexpool" | "created_at"> & {
          id?: string;
          workers_filled?: number;
          status?: ShiftStatus;
          auto_accept_flexpool?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["shifts"]["Insert"]>;
      };
      applications: {
        Row: {
          id: string;
          shift_id: string;
          worker_id: string;
          proposed_rate: number | null;
          status: ApplicationStatus;
          applied_at: string;
          accepted_at: string | null;
          rejected_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["applications"]["Row"], "id" | "status" | "applied_at"> & {
          id?: string;
          status?: ApplicationStatus;
          applied_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
      };
      check_ins: {
        Row: {
          id: string;
          shift_id: string;
          worker_id: string;
          checked_in_at: string | null;
          check_in_lat: number | null;
          check_in_lng: number | null;
          checked_out_at: string | null;
          check_out_lat: number | null;
          check_out_lng: number | null;
          break_minutes: number;
          total_hours: number | null;
          photo_url: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["check_ins"]["Row"], "id" | "break_minutes"> & {
          id?: string;
          break_minutes?: number;
        };
        Update: Partial<Database["public"]["Tables"]["check_ins"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          shift_id: string;
          reviewer_type: ReviewerType;
          reviewer_id: string;
          reviewed_id: string;
          rating: number;
          categories: Json;
          comment: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          shift_id: string;
          sender_id: string;
          sender_type: SenderType;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      invoices: {
        Row: {
          id: string;
          shift_id: string;
          worker_id: string;
          company_id: string;
          amount: number;
          fee: number;
          net_amount: number;
          pdf_url: string | null;
          status: InvoiceStatus;
          paid_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["invoices"]["Row"], "id" | "status" | "created_at"> & {
          id?: string;
          status?: InvoiceStatus;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
      };
      payouts: {
        Row: {
          id: string;
          worker_id: string;
          invoice_id: string;
          amount: number;
          method: string;
          stripe_transfer_id: string | null;
          status: PayoutStatus;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payouts"]["Row"], "id" | "status" | "created_at"> & {
          id?: string;
          status?: PayoutStatus;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payouts"]["Insert"]>;
      };
      flexpool: {
        Row: {
          id: string;
          company_id: string;
          worker_id: string;
          added_at: string;
          blocked: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["flexpool"]["Row"], "id" | "added_at" | "blocked"> & {
          id?: string;
          added_at?: string;
          blocked?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["flexpool"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          user_type: string;
          title: string;
          body: string;
          type: string;
          data: Json;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      worker_status: WorkerStatus;
      company_plan: CompanyPlan;
      shift_status: ShiftStatus;
      application_status: ApplicationStatus;
      invoice_status: InvoiceStatus;
      payout_status: PayoutStatus;
      reviewer_type: ReviewerType;
      sender_type: SenderType;
      company_member_role: CompanyMemberRole;
      sector: Sector;
    };
  };
}
