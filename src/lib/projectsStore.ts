import "server-only";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import {
  ClientProject,
  Deliverable,
  FeedbackNote,
  projectSchema,
  projectsFileSchema,
} from "./projectsSchema";

const PROJECTS_PATH = path.join(process.cwd(), "content", "projects.json");

export type ClientFacingProject = Omit<ClientProject, "accessCode">;

interface ProjectsFile {
  projects: ClientProject[];
}

async function readProjectsFile(): Promise<ProjectsFile> {
  const raw = await fs.readFile(PROJECTS_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  return projectsFileSchema.parse(parsed);
}

async function writeProjectsFile(projects: ClientProject[]) {
  const payload = { projects } satisfies ProjectsFile;
  await fs.writeFile(PROJECTS_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

export async function getProjects(): Promise<ClientProject[]> {
  const file = await readProjectsFile();
  return file.projects;
}

export async function getProjectById(id: string): Promise<ClientProject | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.id === id);
}

export async function saveProject(project: ClientProject) {
  const validated = projectSchema.parse(project);
  const projects = await getProjects();
  const existingIndex = projects.findIndex((p) => p.id === validated.id);
  if (existingIndex === -1) {
    projects.push(validated);
  } else {
    projects[existingIndex] = validated;
  }
  await writeProjectsFile(projects);
}

export async function createProject(input: Omit<ClientProject, "id"> & { id?: string }) {
  const project: ClientProject = {
    ...input,
    id: input.id ?? crypto.randomUUID(),
  } as ClientProject;
  await saveProject(project);
  return project;
}

export async function appendDeliverable(projectId: string, deliverable: Deliverable) {
  const project = await getProjectById(projectId);
  if (!project) throw new Error("Project not found");
  const nextDeliverable = {
    ...deliverable,
    id: deliverable.id || crypto.randomUUID(),
  } as Deliverable;
  project.deliverables = [...project.deliverables, nextDeliverable];
  await saveProject(project);
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
  project.feedback = [nextFeedback, ...project.feedback];
  await saveProject(project);
  return nextFeedback;
}

export function sanitizeProject(project: ClientProject): ClientFacingProject {
  const { accessCode, ...rest } = project;
  void accessCode;
  return rest;
}
