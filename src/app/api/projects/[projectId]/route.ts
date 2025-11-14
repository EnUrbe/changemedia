import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { getProjectById, saveProject } from "@/lib/projectsStore";
import { projectSchema } from "@/lib/projectsSchema";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (isAdminRequest(request)) {
    return NextResponse.json({ project });
  }
  const key = request.nextUrl.searchParams.get("key");
  if (project.accessCode && key !== project.accessCode) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { accessCode, ...rest } = project;
  void accessCode;
  return NextResponse.json({ project: rest });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { projectId } = await params;
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const project = await getProjectById(projectId);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = await request.json();
  const updated = projectSchema.parse({ ...project, ...(body.project ?? body) });
  await saveProject(updated);
  return NextResponse.json({ project: updated });
}
