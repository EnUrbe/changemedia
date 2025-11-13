"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SiteContent } from "@/lib/contentSchema";
import type { ClientProject } from "@/lib/projectsSchema";

interface DeliverableForm {
  title: string;
  type: "video" | "gallery" | "document" | "audio" | "link";
  url: string;
  description: string;
}

interface ProjectForm {
  clientName: string;
  projectTitle: string;
  accessCode: string;
  summary: string;
  dueDate: string;
  contactEmail: string;
}

const defaultDeliverable: DeliverableForm = {
  title: "",
  type: "video",
  url: "",
  description: "",
};

const defaultProject: ProjectForm = {
  clientName: "",
  projectTitle: "",
  accessCode: "",
  summary: "",
  dueDate: "",
  contactEmail: "",
};

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

export default function CmsPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [contentDraft, setContentDraft] = useState("");
  const [contentSaving, setContentSaving] = useState(false);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [deliverableForm, setDeliverableForm] = useState(defaultDeliverable);
  const [projectForm, setProjectForm] = useState(defaultProject);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiNextSteps, setAiNextSteps] = useState<string[]>([]);
  const [cmsMessage, setCmsMessage] = useState<string | null>(null);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? projects[0] ?? null,
    [projects, selectedProjectId]
  );

  const authHeaders = useMemo<HeadersInit | undefined>(() => {
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }, [token]);

  useEffect(() => {
    const stored = window.localStorage.getItem("cmsToken");
    if (stored) {
      setToken(stored);
    }
  }, []);

  const fetchContent = useCallback(async () => {
    const res = await fetch("/api/content", {
  headers: { ...(authHeaders ?? {}) },
      cache: "no-store",
    });
    if (!res.ok) {
      setCmsMessage("Failed to load site content");
      return;
    }
    const data = await res.json();
    setContent(data.data);
    setContentDraft(JSON.stringify(data.data, null, 2));
  }, [authHeaders]);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects", {
  headers: { ...(authHeaders ?? {}) },
      cache: "no-store",
    });
    if (!res.ok) {
      setCmsMessage("Failed to load projects");
      return;
    }
    const data = await res.json();
    setProjects(data.projects);
  }, [authHeaders]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchContent(), fetchProjects()]);
  }, [fetchContent, fetchProjects]);

  useEffect(() => {
    if (token) {
      window.localStorage.setItem("cmsToken", token);
      void refreshAll();
    }
  }, [token, refreshAll]);

  async function handleSaveContent() {
    if (!token || !contentDraft) return;
    setContentSaving(true);
    try {
      const payload = JSON.parse(contentDraft) as SiteContent;
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authHeaders ?? {}),
        },
        body: JSON.stringify({ data: payload }),
      });
      if (!res.ok) {
        throw new Error("Failed to save content");
      }
      setCmsMessage("Content updated");
      await fetchContent();
    } catch (error) {
      console.error(error);
      setCmsMessage("Invalid JSON or save failed");
    } finally {
      setContentSaving(false);
    }
  }

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!tokenInput) return;
    setToken(tokenInput);
    setTokenInput("");
  }

  async function handleCreateProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!projectForm.clientName || !projectForm.projectTitle || !projectForm.accessCode) return;
    const body = {
      project: {
        id: randomId(),
        ...projectForm,
        status: "planning",
        deliverables: [],
        feedback: [],
        checklist: [],
        aiNotes: "Pending summary",
        pointOfContact: {
          name: projectForm.clientName,
          email: projectForm.contactEmail || "client@example.com",
        },
      },
    };
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeaders ?? {}),
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setProjectForm(defaultProject);
      setCmsMessage("Project created");
      await fetchProjects();
    } else {
      setCmsMessage("Could not create project");
    }
  }

  async function handleAddDeliverable(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedProject) return;
    const updated = {
      ...selectedProject,
      deliverables: [
        ...selectedProject.deliverables,
        {
          id: randomId(),
          status: "in-progress" as const,
          ...deliverableForm,
        },
      ],
    };
    const res = await fetch(`/api/projects/${selectedProject.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authHeaders ?? {}),
      },
      body: JSON.stringify({ project: updated }),
    });
    if (res.ok) {
      setDeliverableForm(defaultDeliverable);
      await fetchProjects();
      setCmsMessage("Deliverable added");
    } else {
      setCmsMessage("Failed to save deliverable");
    }
  }

  async function handleRequestAi() {
    if (!selectedProject) return;
    const res = await fetch("/api/ai/insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeaders ?? {}),
      },
      body: JSON.stringify({ projectId: selectedProject.id }),
    });
    if (!res.ok) {
      setCmsMessage("AI insights failed");
      return;
    }
    const data = await res.json();
    setAiSummary(data.insights.summary);
    setAiNextSteps(data.insights.nextSteps ?? []);
    await fetchProjects();
  }

  if (!token) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-4">
        <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6">
          <h1 className="text-xl font-semibold">CMS Access</h1>
          <p className="mt-2 text-sm text-neutral-400">Enter the admin token to load content.</p>
          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            <input
              type="password"
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="CMS token"
              autoComplete="off"
            />
            <button className="w-full rounded-xl bg-white px-3 py-2 text-sm font-medium text-neutral-900">Unlock</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">CHANGE Media CMS</h1>
            <p className="text-sm text-neutral-400">Edit the marketing site, deliverables, and AI assistant from one screen.</p>
          </div>
          <div className="flex gap-2 text-sm text-neutral-400">
            <button onClick={refreshAll} className="rounded-xl border border-white/10 px-3 py-1">
              Refresh data
            </button>
            <button
              onClick={() => {
                setToken(null);
                window.localStorage.removeItem("cmsToken");
              }}
              className="rounded-xl border border-white/10 px-3 py-1"
            >
              Sign out
            </button>
          </div>
        </header>

        {cmsMessage && <p className="text-sm text-emerald-300">{cmsMessage}</p>}

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Site Content JSON</h2>
              <div className="flex gap-2 text-xs">
                <button onClick={fetchContent} className="rounded-lg border border-white/10 px-2 py-1">
                  Reload
                </button>
                <button
                  disabled={!content}
                  onClick={() => content && setContentDraft(JSON.stringify(content, null, 2))}
                  className="rounded-lg border border-white/10 px-2 py-1 disabled:opacity-50"
                >
                  Reset
                </button>
              </div>
            </div>
            <textarea
              className="mt-4 h-[420px] w-full rounded-2xl border border-white/10 bg-neutral-950/60 p-3 font-mono text-xs"
              value={contentDraft}
              onChange={(e) => setContentDraft(e.target.value)}
            />
            <button
              disabled={contentSaving}
              onClick={handleSaveContent}
              className="mt-4 w-full rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-900 disabled:opacity-60"
            >
              {contentSaving ? "Publishing…" : "Publish changes"}
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Create Project</h2>
            <form onSubmit={handleCreateProject} className="mt-4 grid gap-3">
              <input
                required
                placeholder="Client name"
                className="rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2"
                value={projectForm.clientName}
                onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
              />
              <input
                required
                placeholder="Project title"
                className="rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2"
                value={projectForm.projectTitle}
                onChange={(e) => setProjectForm({ ...projectForm, projectTitle: e.target.value })}
              />
              <input
                required
                placeholder="Access code"
                className="rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2"
                value={projectForm.accessCode}
                onChange={(e) => setProjectForm({ ...projectForm, accessCode: e.target.value })}
              />
              <input
                type="email"
                required
                placeholder="Point of contact email"
                className="rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2"
                value={projectForm.contactEmail}
                onChange={(e) => setProjectForm({ ...projectForm, contactEmail: e.target.value })}
              />
              <textarea
                required
                placeholder="Project summary"
                className="rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2"
                value={projectForm.summary}
                onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
              />
              <input
                type="date"
                required
                className="rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2"
                value={projectForm.dueDate}
                onChange={(e) => setProjectForm({ ...projectForm, dueDate: e.target.value })}
              />
              <button className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-neutral-900">Create project</button>
            </form>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold">Client Workspaces</h2>
            <select
              className="rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2 text-sm"
              value={selectedProject?.id ?? ""}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.clientName} — {project.projectTitle}
                </option>
              ))}
            </select>
          </div>

          {selectedProject ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-neutral-950/60 p-4">
                <h3 className="font-medium">Deliverables</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {selectedProject.deliverables.map((deliverable) => (
                    <li key={deliverable.id} className="rounded-xl border border-white/10 p-3">
                      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-neutral-400">
                        <span>{deliverable.type}</span>
                        <span>{deliverable.status}</span>
                      </div>
                      <div className="mt-1 text-base font-medium">{deliverable.title}</div>
                      <p className="text-sm text-neutral-400">{deliverable.description}</p>
                      <a
                        href={deliverable.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-xs text-emerald-300 hover:underline"
                      >
                        Open asset ↗
                      </a>
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleAddDeliverable} className="mt-4 grid gap-2 text-sm">
                  <h4 className="font-medium">Add deliverable</h4>
                  <input
                    required
                    placeholder="Title"
                    className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-2"
                    value={deliverableForm.title}
                    onChange={(e) => setDeliverableForm({ ...deliverableForm, title: e.target.value })}
                  />
                  <select
                    className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-2"
                    value={deliverableForm.type}
                    onChange={(e) => setDeliverableForm({ ...deliverableForm, type: e.target.value as DeliverableForm["type"] })}
                  >
                    <option value="video">Video</option>
                    <option value="gallery">Gallery</option>
                    <option value="document">Document</option>
                    <option value="audio">Audio</option>
                    <option value="link">Link</option>
                  </select>
                  <input
                    required
                    placeholder="Asset URL"
                    className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-2"
                    value={deliverableForm.url}
                    onChange={(e) => setDeliverableForm({ ...deliverableForm, url: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-2"
                    value={deliverableForm.description}
                    onChange={(e) => setDeliverableForm({ ...deliverableForm, description: e.target.value })}
                  />
                  <button className="rounded-xl border border-white/20 px-3 py-2">Save deliverable</button>
                </form>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-neutral-950/60 p-4">
                  <h3 className="font-medium">AI assistant</h3>
                  <p className="text-sm text-neutral-400">Summarize the project and receive the next actions.</p>
                  <button
                    onClick={handleRequestAi}
                    className="mt-3 rounded-xl bg-white/90 px-3 py-2 text-sm font-semibold text-neutral-900"
                  >
                    Generate insights
                  </button>
                  {!aiSummary && selectedProject.aiNotes && (
                    <div className="mt-3 rounded-xl border border-white/10 bg-neutral-900/60 p-3 text-sm text-neutral-200">
                      <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Last saved insight</div>
                      <p className="mt-1 whitespace-pre-line">{selectedProject.aiNotes}</p>
                    </div>
                  )}
                  {aiSummary && (
                    <div className="mt-3 rounded-xl border border-white/10 bg-neutral-900/60 p-3 text-sm text-neutral-200">
                      <p>{aiSummary}</p>
                      {aiNextSteps.length > 0 && (
                        <ul className="mt-2 list-disc pl-4 text-neutral-400">
                          {aiNextSteps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-neutral-950/60 p-4">
                  <h3 className="font-medium">Client feedback</h3>
                  <ul className="mt-2 space-y-2 text-sm text-neutral-300">
                    {selectedProject.feedback.map((note) => (
                      <li key={note.id} className="rounded-xl border border-white/10 p-3">
                        <div className="text-xs uppercase text-neutral-500">
                          {note.author} — {new Date(note.timestamp).toLocaleString()}
                        </div>
                        <p className="mt-1">{note.message}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-neutral-400">No projects yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
