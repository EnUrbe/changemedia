import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { siteContentSchema, SiteContent } from "./contentSchema";

const CONTENT_PATH = path.join(process.cwd(), "content", "site.json");
const HISTORY_DIR = path.join(process.cwd(), "content", "history");

interface RevisionRecord {
  filename: string;
  savedAt: string;
  editor: string;
  note?: string;
}

async function ensureHistoryDir() {
  await fs.mkdir(HISTORY_DIR, { recursive: true });
}

export async function getContent(): Promise<SiteContent> {
  const data = await fs.readFile(CONTENT_PATH, "utf-8");
  const json = JSON.parse(data);
  return siteContentSchema.parse(json);
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
  await ensureHistoryDir();
  const timestamp = new Date().toISOString();
  const filename = `${timestamp.replace(/[:.]/g, "-")}-${slugify(editor)}.json`;
  const payload = JSON.stringify(parsed, null, 2);
  await fs.writeFile(CONTENT_PATH, `${payload}\n`, "utf-8");
  const historyEntry = {
    savedAt: timestamp,
    editor,
    note,
    data: parsed,
  };
  await fs.writeFile(path.join(HISTORY_DIR, filename), `${JSON.stringify(historyEntry, null, 2)}\n`, "utf-8");
  revalidatePath("/");
}

export async function listRevisions(limit = 20): Promise<RevisionRecord[]> {
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
}

export async function restoreRevision(filename: string) {
  await ensureHistoryDir();
  const fullPath = path.join(HISTORY_DIR, filename);
  const contents = await fs.readFile(fullPath, "utf-8");
  const parsed = JSON.parse(contents);
  await saveContent(parsed.data, `${parsed.editor}-restore`, parsed.note);
}
