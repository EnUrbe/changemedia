import "server-only";
import { getSupabaseAdminClient } from "./supabaseAdmin";

export interface CalendarFeed {
  id: string;
  name: string;
  url: string;
}

export async function getCalendarFeeds() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("calendar_feeds")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return [];
  return data as CalendarFeed[];
}

export async function addCalendarFeed(name: string, url: string) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("calendar_feeds")
    .insert({ name, url });

  if (error) throw new Error(error.message);
}

export async function deleteCalendarFeed(id: string) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("calendar_feeds")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
