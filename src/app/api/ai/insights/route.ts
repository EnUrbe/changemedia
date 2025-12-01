import { NextRequest, NextResponse } from "next/server";
import { generateAiContent, AiGenerationType } from "@/lib/aiAssistant";
import { getProjectById, saveProject } from "@/lib/projectsStore";
import { isAdminRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { projectId, project: rawProject, type = "insights" } = body;
  
  const project = rawProject ?? (projectId ? await getProjectById(projectId) : undefined);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const result = await generateAiContent(project, type as AiGenerationType);
  
  // Only save to project notes if it's the standard insights
  if (type === "insights") {
    const nextStepsLine = result.nextSteps?.length ? ` Next: ${result.nextSteps.join(" • ")}` : "";
    project.aiNotes = `${result.summary}${nextStepsLine}`.trim();
    await saveProject(project);
  }

  return NextResponse.json({ insights: result, project });
}
