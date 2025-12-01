import { NextRequest, NextResponse } from "next/server";
import { getProjectById } from "@/lib/projectsStore";
import { generateProjectConciergeResponse } from "@/lib/aiAssistant";

export async function POST(req: NextRequest) {
  try {
    const { projectId, message } = await req.json();

    if (!projectId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const response = await generateProjectConciergeResponse(project, message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Concierge API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
