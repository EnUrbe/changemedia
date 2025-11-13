import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { getProjects, saveProject } from "@/lib/projectsStore";
import { projectSchema } from "@/lib/projectsSchema";

export async function GET(request: NextRequest) {
  const projects = await getProjects();
  const isAdmin = isAdminRequest(request);
  if (!isAdmin) {
    const clientSafe = projects.map((project) => {
      const { accessCode, ...rest } = project;
      void accessCode;
      return rest;
    });
    return NextResponse.json({ projects: clientSafe });
  }
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = projectSchema.parse(body.project ?? body);
  await saveProject(parsed);
  return NextResponse.json({ project: parsed });
}
