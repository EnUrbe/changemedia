import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { listPhotographyRevisions, restorePhotographyRevision } from "@/lib/photographyStore";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const limitParam = Number(request.nextUrl.searchParams.get("limit"));
  const revisions = await listPhotographyRevisions(Number.isNaN(limitParam) ? 20 : limitParam);
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
  await restorePhotographyRevision(body.filename);
  return NextResponse.json({ restored: body.filename });
}
