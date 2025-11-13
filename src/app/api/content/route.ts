import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/contentStore";
import { siteContentSchema } from "@/lib/contentSchema";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  const data = await getContent();
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = siteContentSchema.parse(body.data ?? body);
  await saveContent(parsed, request.headers.get("x-editor") ?? "admin", body.note);
  return NextResponse.json({ data: parsed });
}
