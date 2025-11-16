import { NextRequest, NextResponse } from "next/server";
import { getPhotographyContent, savePhotographyContent } from "@/lib/photographyStore";
import { photographyContentSchema } from "@/lib/photographySchema";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  const data = await getPhotographyContent();
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = photographyContentSchema.parse(body.data ?? body);
  await savePhotographyContent(parsed, request.headers.get("x-editor") ?? "admin", body.note);
  return NextResponse.json({ data: parsed });
}
