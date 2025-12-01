import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type PortraitInquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "PAYMENT_PENDING"
  | "DEPOSIT_PAID"
  | "SCHEDULED"
  | "SHOT_DONE"
  | "GALLERY_SENT";

export type PortraitInquiryServiceType =
  | "grad_portraits"
  | "branding"
  | "portrait_general"
  | "family"
  | "couples"
  | "org"
  | string;

export interface PortraitInquiryInsert {
  full_name: string;
  email: string;
  phone?: string | null;
  school?: string | null;
  session_type?: string | null;
  preferred_dates?: string | null;
  preferred_time_window?: string | null;
  how_heard?: string | null;
  service_type?: PortraitInquiryServiceType;
  source?: string | null;
  status?: PortraitInquiryStatus;
  mercury_payment_id?: string | null;
  referral_from?: string | null;
}

export interface PortraitInquiryRow extends PortraitInquiryInsert {
  id: string;
  created_at: string;
  updated_at: string;
}

type AdminClient = SupabaseClient;

declare global {
  var __supabase_admin: AdminClient | undefined;
}

export function getSupabaseAdminClient(): AdminClient {
  if (!globalThis.__supabase_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
    }

    globalThis.__supabase_admin = createClient(url, serviceKey, {
      auth: { persistSession: false },
      global: { fetch: fetch.bind(globalThis) },
    });
  }

  return globalThis.__supabase_admin!;
}
