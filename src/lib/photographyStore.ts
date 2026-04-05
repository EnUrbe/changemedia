import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { photographyContentSchema, PhotographyContent } from "./photographySchema";
import { getSupabaseAdminClient, hasSupabaseAdminEnv } from "./supabaseAdmin";

const PHOTOGRAPHY_CONTENT_PATH = path.join(process.cwd(), "content", "photography.json");
const CONTENT_KEY = "photography";

export async function getPhotographyContent(): Promise<PhotographyContent> {
  // 1. Try fetching from Supabase first
  if (hasSupabaseAdminEnv()) {
    try {
      const supabase = getSupabaseAdminClient();
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("key", CONTENT_KEY)
        .single();

      if (data?.content) {
        return photographyContentSchema.parse(data.content);
      }
    } catch (error) {
      console.error("Failed to load photography content from Supabase:", error);
    }
  }

  // 2. Fall back to local JSON if not in DB
  const raw = await fs.readFile(PHOTOGRAPHY_CONTENT_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  return photographyContentSchema.parse(parsed);
}

export async function savePhotographyContent(data: PhotographyContent, editor = "system", note?: string) {
  const parsed = photographyContentSchema.parse(data);

  // Save to Supabase
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({
      key: CONTENT_KEY,
      content: parsed,
      updated_at: new Date().toISOString(),
      updated_by: editor,
      last_note: note,
    }, { onConflict: "key" });

  if (error) {
    throw new Error(`Failed to save photography content: ${error.message}`);
  }

  revalidatePath("/photography");
}

export async function listPhotographyRevisions(limit = 20): Promise<unknown[]> {
  return []; // Removed file tracking to prevent Vercel crashes
}

export async function restorePhotographyRevision(filename: string) {
  // Removed local rollback mechanisms for cloud deployment
}
