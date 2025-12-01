import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/contentStore";
import { siteContentSchema } from "@/lib/contentSchema";
import { isAdminRequest } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const data = await getContent();
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  // Check for legacy token auth
  const isLegacyAdmin = isAdminRequest(request);
  
  // Check for Supabase auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!isLegacyAdmin && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = siteContentSchema.parse(body.data ?? body);
  
  const editor = user ? user.email : (request.headers.get("x-editor") ?? "admin");
  
  await saveContent(parsed, editor ?? "system", body.note);
  return NextResponse.json({ data: parsed });
}
