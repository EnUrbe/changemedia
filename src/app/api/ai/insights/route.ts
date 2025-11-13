import { NextRequest, NextResponse } from "next/server";
import { generateAiInsights } from "@/lib/aiAssistant";
import { getProjectById, saveProject } from "@/lib/projectsStore";
import { isAdminRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { projectId, project: rawProject } = body;
  const project = rawProject ?? (projectId ? await getProjectById(projectId) : undefined);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  const insights = await generateAiInsights(project);
  const nextStepsLine = insights.nextSteps?.length ? ` Next: ${insights.nextSteps.join(" • ")}` : "";
  project.aiNotes = `${insights.summary}${nextStepsLine}`.trim();
  await saveProject(project);
  return NextResponse.json({ insights, project });
}
