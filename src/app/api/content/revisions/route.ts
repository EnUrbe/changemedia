import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { listRevisions, restoreRevision } from "@/lib/contentStore";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 20);
  const revisions = await listRevisions(limit);
  return NextResponse.json({ revisions });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  if (!body.filename) {
    return NextResponse.json({ error: "filename is required" }, { status: 400 });
  }
  await restoreRevision(body.filename);
  return NextResponse.json({ ok: true });
}
