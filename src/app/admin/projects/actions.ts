"use server";

import { createProject, appendDeliverable, getProjectById, saveProject } from "@/lib/projectsStore";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ClientProject, Deliverable } from "@/lib/projectsSchema";
import { generateAiContent, AiGenerationType } from "@/lib/aiAssistant";

export async function createNewProject(formData: FormData) {
  const clientName = formData.get("clientName") as string;
  const projectTitle = formData.get("projectTitle") as string;
  const email = formData.get("email") as string;
  const accessCode = formData.get("accessCode") as string;

  if (!clientName || !projectTitle || !accessCode) {
    return { error: "Missing required fields" };
  }
  try {
    const newProject = await createProject({
      clientName,
      projectTitle,
      status: "planning",
      summary: "Project initialized.",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0], // +30 days
      pointOfContact: {
        name: clientName,
        email: email || "",
      },
      accessCode,
      deliverables: [],
      feedback: [],
      checklist: ["Initial briefing", "Shoot planning"],
    });

    revalidatePath("/admin/projects");
    redirect(`/admin/projects/${newProject.id}`);
  } catch (error: any) {
    // Handle duplicate access code or general creation failures gracefully
    const message = error?.message || "Failed to create project";
    if (message.toLowerCase().includes("duplicate") || message.includes("23505")) {
      return { error: "Access code already in use. Choose another code." };
    }
    return { error: message };
  }
}

export async function addDeliverable(projectId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const type = formData.get("type") as any;
  const url = formData.get("url") as string;
  const imagesStr = formData.get("images") as string;

  if (!title || !type || !url) {
    return { error: "Missing required fields" };
  }

  let images: string[] = [];
  if ((type === "gallery" || type === "portrait" || type === "photoshoot") && imagesStr) {
    images = imagesStr.split(",").map(s => s.trim()).filter(Boolean);
  }

  await appendDeliverable(projectId, {
    id: crypto.randomUUID(),
    title,
    type,
    description: "New deliverable",
    url,
    status: "ready",
    images: images.length > 0 ? images : undefined,
  });

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/clients/${projectId}`);
}

export async function updateProjectStatus(projectId: string, status: string) {
  const project = await getProjectById(projectId);
  if (!project) return { error: "Project not found" };

  await saveProject({ ...project, status: status as any });
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/admin/projects");
}

export async function deleteProject(projectId: string) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function generateProjectInsightsAction(projectId: string, type: AiGenerationType = "insights") {
  const project = await getProjectById(projectId);
  if (!project) return { error: "Project not found" };

  const result = await generateAiContent(project, type);
  
  if (type === "insights") {
    // Save the insights to the project summary or aiNotes
    await saveProject({
      ...project,
      aiNotes: result.summary,
      checklist: [...project.checklist, ...result.nextSteps],
    });
    revalidatePath(`/admin/projects/${projectId}`);
  }

  return { success: true, data: result };
}
