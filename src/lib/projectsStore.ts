import "server-only";
import crypto from "crypto";
import { getSupabaseAdminClient } from "./supabaseAdmin";
import {
  ClientProject,
  Deliverable,
  FeedbackNote,
  projectSchema,
} from "./projectsSchema";

export type ClientFacingProject = Omit<ClientProject, "accessCode">;

// Helper to map DB rows to our application schema
function mapProjectFromDB(row: any): ClientProject {
  return {
    id: row.id,
    clientName: row.client_name,
    projectTitle: row.project_title,
    status: row.status,
    summary: row.summary || "",
    dueDate: row.due_date,
    pointOfContact: row.point_of_contact,
    accessCode: row.access_code,
    deliverables: row.deliverables?.map(mapDeliverableFromDB) || [],
    feedback: row.feedback || [],
    checklist: row.checklist || [],
    aiNotes: row.ai_notes || undefined,
  };
}

function mapDeliverableFromDB(row: any): Deliverable {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description || "",
    url: row.url,
    thumbnail: row.thumbnail || undefined,
    images: row.images || undefined,
    status: row.status,
  };
}

export async function getProjects(): Promise<ClientProject[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, deliverables(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    return data.map(mapProjectFromDB);
  } catch (error) {
    console.error("Failed to get projects (check env vars):", error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<ClientProject | undefined> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, deliverables(*)")
      .eq("id", id)
      .single();

    if (error || !data) return undefined;
    return mapProjectFromDB(data);
  } catch (error) {
    console.error("Failed to get project by id:", error);
    return undefined;
  }
}

export async function getProjectByAccessCode(code: string): Promise<ClientProject | undefined> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, deliverables(*)")
      .eq("access_code", code)
      .single();

    if (error || !data) return undefined;
    return mapProjectFromDB(data);
  } catch (error) {
    console.error("Failed to get project by access code:", error);
    return undefined;
  }
}

export async function saveProject(project: ClientProject) {
  // This function was used for full document replacement in JSON.
  // In SQL, we should prefer specific updates, but for compatibility:
  const supabase = getSupabaseAdminClient();
  
  const { error } = await supabase
    .from("projects")
    .upsert({
      id: project.id,
      client_name: project.clientName,
      project_title: project.projectTitle,
      status: project.status,
      summary: project.summary,
      due_date: project.dueDate,
      point_of_contact: project.pointOfContact,
      access_code: project.accessCode,
      checklist: project.checklist,
      ai_notes: project.aiNotes,
      feedback: project.feedback, // Storing feedback as JSONB for now
    });

  if (error) throw new Error(`Failed to save project: ${error.message}`);
}

export async function createProject(input: Omit<ClientProject, "id"> & { id?: string }) {
  const id = input.id ?? crypto.randomUUID();
  const project: ClientProject = {
    ...input,
    id,
  } as ClientProject;

  await saveProject(project);
  return project;
}

export async function appendDeliverable(projectId: string, deliverable: Deliverable) {
  const supabase = getSupabaseAdminClient();
  
  const nextDeliverable = {
    ...deliverable,
    id: deliverable.id || crypto.randomUUID(),
  };

  const { error } = await supabase
    .from("deliverables")
    .insert({
      id: nextDeliverable.id,
      project_id: projectId,
      type: nextDeliverable.type,
      title: nextDeliverable.title,
      description: nextDeliverable.description,
      url: nextDeliverable.url,
      thumbnail: nextDeliverable.thumbnail,
      images: nextDeliverable.images,
      status: nextDeliverable.status,
    });

  if (error) throw new Error(`Failed to add deliverable: ${error.message}`);
  return nextDeliverable;
}

export async function appendFeedback(projectId: string, feedback: Omit<FeedbackNote, "id" | "timestamp">) {
  const project = await getProjectById(projectId);
  if (!project) throw new Error("Project not found");
  
  const nextFeedback: FeedbackNote = {
    ...feedback,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  const newFeedbackList = [nextFeedback, ...project.feedback];
  
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("projects")
    .update({ feedback: newFeedbackList })
    .eq("id", projectId);

  if (error) throw new Error(`Failed to add feedback: ${error.message}`);
  return nextFeedback;
}

export function sanitizeProject(project: ClientProject): ClientFacingProject {
  const { accessCode, ...rest } = project;
  void accessCode;
  return rest;
}
