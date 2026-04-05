import "server-only";
import { getSupabaseAdminClient, hasSupabaseAdminEnv } from "./supabaseAdmin";
import { gradContentSchema, type GradContent } from "./gradSchema";

const CONTENT_KEY = "grad_page";

export async function getGradContent(): Promise<GradContent> {
  if (hasSupabaseAdminEnv()) {
    try {
      const supabase = getSupabaseAdminClient();
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("key", CONTENT_KEY)
        .single();

      if (data?.content) {
        return gradContentSchema.parse(data.content);
      }
    } catch (error) {
      console.error("Failed to load grad content from Supabase, falling back to empty:", error);
    }
  }

  // Fallback defaults
  return {
    packages: [],
    addons: [],
    gallery: [],
    portfolioGallery: [],
  };
}

export async function saveGradContent(content: GradContent): Promise<void> {
  const parsed = gradContentSchema.parse(content);
  const supabase = getSupabaseAdminClient();
  
  const { error } = await supabase
    .from("site_content")
    .upsert({
      key: CONTENT_KEY,
      content: parsed,
      updated_at: new Date().toISOString(),
    }, { onConflict: "key" });

  if (error) {
    throw new Error(`Failed to save grad content: ${error.message}`);
  }
}
