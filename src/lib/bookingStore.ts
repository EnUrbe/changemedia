import "server-only";
import { getSupabaseAdminClient } from "./supabaseAdmin";

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceType: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "cancelled";
  notes?: string;
}

export async function createBooking(booking: Omit<Booking, "id" | "status">) {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      client_name: booking.clientName,
      client_email: booking.clientEmail,
      service_type: booking.serviceType,
      start_time: booking.startTime,
      end_time: booking.endTime,
      notes: booking.notes,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create booking: ${error.message}`);
  return data;
}

export async function getBookingsForDateRange(start: Date, end: Date) {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .gte("start_time", start.toISOString())
    .lte("end_time", end.toISOString())
    .eq("status", "confirmed");

  if (error) throw new Error(`Failed to fetch bookings: ${error.message}`);
  
  return data.map((row: any) => ({
    id: row.id,
    clientName: row.client_name,
    clientEmail: row.client_email,
    serviceType: row.service_type,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status,
    notes: row.notes,
  })) as Booking[];
}

export async function getAllUpcomingBookings() {
  try {
    const supabase = getSupabaseAdminClient();
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .gte("start_time", now)
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
    
    return data.map((row: any) => ({
      id: row.id,
      clientName: row.client_name,
      clientEmail: row.client_email,
      serviceType: row.service_type,
      startTime: row.start_time,
      endTime: row.end_time,
      status: row.status,
      notes: row.notes,
    })) as Booking[];
  } catch (error) {
    console.error("Failed to fetch bookings (check env vars):", error);
    return [];
  }
}
