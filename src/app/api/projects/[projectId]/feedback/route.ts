import { NextRequest, NextResponse } from "next/server";
import { appendFeedback, getProjectById } from "@/lib/projectsStore";

interface RouteParams {
  params: { projectId: string };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const project = await getProjectById(params.projectId);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  if (project.accessCode) {
    const key = request.nextUrl.searchParams.get("key") ?? (body.accessCode as string | undefined);
    if (key !== project.accessCode) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  if (!body.message || !body.author) {
    return NextResponse.json({ error: "author and message are required" }, { status: 400 });
  }
  const note = await appendFeedback(project.id, {
    author: body.author as string,
    role: (body.role as string | undefined) ?? "",
    message: body.message as string,
  });
  return NextResponse.json({ feedback: note });
}
