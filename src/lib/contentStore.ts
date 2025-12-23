import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { siteContentSchema, SiteContent } from "./contentSchema";
import { getSupabaseAdminClient } from "./supabaseAdmin";

const CONTENT_PATH = path.join(process.cwd(), "content", "site.json");
const HISTORY_DIR = path.join(process.cwd(), "content", "history");

interface RevisionRecord {
  filename: string;
  savedAt: string;
  editor: string;
  note?: string;
}

async function ensureHistoryDir() {
  try {
    await fs.mkdir(HISTORY_DIR, { recursive: true });
  } catch (e) {
    // Ignore errors in read-only environments (like Vercel)
    console.warn("Could not create history directory (likely read-only fs)", e);
  }
}

export async function getContent(): Promise<SiteContent> {
  // 1. Try Supabase first
  try {
    const supabase = getSupabaseAdminClient();
    const { data } = await supabase
      .from('site_content')
      .select('content')
      .eq('key', 'main')
      .single();

    if (data?.content) {
      return siteContentSchema.parse(data.content);
    }
  } catch (e) {
    console.warn("Supabase content fetch failed, falling back to file", e);
  }

  // 2. Fallback to local file
  try {
    const data = await fs.readFile(CONTENT_PATH, "utf-8");
    const json = JSON.parse(data);
    return siteContentSchema.parse(json);
  } catch (e) {
    console.error("Failed to read local content file", e);
    // Return a default empty structure if absolutely necessary, or throw
    throw e;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24) || "editor";
}

export async function saveContent(data: SiteContent, editor = "system", note?: string) {
  const parsed = siteContentSchema.parse(data);
  const timestamp = new Date().toISOString();
  
  // 1. Save to Supabase (Primary)
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('site_content')
      .upsert({ 
        key: 'main', 
        content: parsed, 
        updated_at: timestamp,
        updated_by: editor,
        last_note: note
      }, { onConflict: 'key' });

    if (error) {
      console.error("Supabase upsert error:", error);
      throw new Error(`Database save failed: ${error.message}`);
    }
  } catch (e) {
    console.error("Failed to save content to Supabase", e);
    // If we are in production (Vercel), this is critical.
    // We MUST throw here if we want the user to know it failed.
    // Only catch if we have a reliable fallback, which we don't on Vercel.
    throw e; 
  }

  // 2. Save to File (Backup / Local Dev)
  // In Vercel, this will fail, so we catch and ignore the error
  try {
    await ensureHistoryDir();
    const filename = `${timestamp.replace(/[:.]/g, "-")}-${slugify(editor)}.json`;
    const payload = JSON.stringify(parsed, null, 2);
    
    // Try writing main file
    try {
      await fs.writeFile(CONTENT_PATH, `${payload}\n`, "utf-8");
    } catch (e) {
      console.warn("Could not write to CONTENT_PATH (likely read-only fs)");
    }

    // Try writing history
    try {
      await fs.writeFile(path.join(HISTORY_DIR, filename), `${JSON.stringify({
        savedAt: timestamp,
        editor,
        note,
        data: parsed,
      }, null, 2)}\n`, "utf-8");
    } catch (e) {
      console.warn("Could not write to HISTORY_DIR (likely read-only fs)");
    }
  } catch (e) {
    console.warn("File system operations failed (ignoring)", e);
  }

  revalidatePath("/");
}

export async function listRevisions(limit = 20): Promise<RevisionRecord[]> {
  try {
    await ensureHistoryDir();
    const files = await fs.readdir(HISTORY_DIR);
    const entries: RevisionRecord[] = [];
    for (const file of files) {
      const fullPath = path.join(HISTORY_DIR, file);
      try {
        const contents = await fs.readFile(fullPath, "utf-8");
        const parsed = JSON.parse(contents);
        entries.push({
          filename: file,
          savedAt: parsed.savedAt,
          editor: parsed.editor,
          note: parsed.note,
        });
      } catch (error) {
        console.error("Failed to parse revision", file, error);
      }
    }
    return entries
      .sort((a, b) => (a.savedAt > b.savedAt ? -1 : 1))
      .slice(0, limit);
  } catch (e) {
    return [];
  }
}

export async function restoreRevision(filename: string) {
  try {
    await ensureHistoryDir();
    const fullPath = path.join(HISTORY_DIR, filename);
    const contents = await fs.readFile(fullPath, "utf-8");
    const parsed = JSON.parse(contents);
    await saveContent(parsed.data, `${parsed.editor}-restore`, parsed.note);
  } catch (e) {
    console.error("Failed to restore revision", e);
    throw e;
  }
}
