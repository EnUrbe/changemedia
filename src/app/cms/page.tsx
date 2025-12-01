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
  const panelClass = "rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl";
  const inputClass =
    "rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none focus:ring-0";
  const labelClass = "text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white/40";

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? projects[0] ?? null,
    [projects, selectedProjectId]
  );

  const cmsStats = useMemo(() => {
    const deliverables = projects.reduce((acc, project) => acc + project.deliverables.length, 0);
    const feedback = projects.reduce((acc, project) => acc + project.feedback.length, 0);
    const livePortals = projects.filter((project) => project.accessCode).length;
    const upcoming = projects
      .map((project) => (project.dueDate ? new Date(project.dueDate) : null))
      .filter((date): date is Date => !!date)
      .sort((a, b) => a.getTime() - b.getTime())[0] ?? null;

    return {
      activeClients: projects.length,
      deliverables,
      feedback,
      livePortals,
      nextDueDate: upcoming,
    };
  }, [projects]);

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
      <main className="relative min-h-screen bg-[#050505] text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 right-0 h-[26rem] w-[26rem] rounded-full bg-white/5 blur-[120px]" />
          <div className="absolute -bottom-16 left-[-5%] h-[32rem] w-[32rem] rounded-full bg-white/5 blur-[150px]" />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
          <div className={`${panelClass} w-full max-w-lg p-8`}>
            <p className={labelClass}>Admin access</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Unlock the CHANGE Media control room</h1>
            <p className="mt-3 text-sm text-white/60">
              Use the <span className="font-mono font-semibold">CMS_ADMIN_TOKEN</span> from your <code className="font-mono">.env.local</code>. We’ll remember it
              for this browser until you sign out.
            </p>
            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div className="space-y-2">
                <label htmlFor="cms-token" className="text-xs font-medium text-white/60">
                  Admin token
                </label>
                <input
                  id="cms-token"
                  type="password"
                  className={inputClass}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="off"
                />
              </div>
              <button className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90">Unlock dashboard</button>
            </form>
            <div className="mt-6 grid gap-3 text-sm text-white/60">
              <p className="font-semibold text-white/80">Need the token?</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Generate a random string (e.g., <span className="font-mono text-xs">openssl rand -base64 32</span>).
                </li>
                <li>
                  Store it as <span className="font-mono text-xs">CMS_ADMIN_TOKEN</span> in <code className="font-mono">.env.local</code>.
                </li>
                <li>Restart the dev server and reload this page.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const upcomingLabel = cmsStats.nextDueDate
    ? cmsStats.nextDueDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "Add due date";

  return (
    <main className="relative min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-[30rem] w-[30rem] rounded-full bg-white/5 blur-[160px]" />
        <div className="absolute bottom-0 right-[-5%] h-[36rem] w-[36rem] rounded-full bg-white/5 blur-[180px]" />
      </div>
      <div className="relative z-10">
        <header className="border-b border-white/10 bg-[#050505]/80 backdrop-blur supports-[backdrop-filter]:bg-[#050505]/70">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">CHANGE Media</p>
              <h1 className="text-xl font-semibold">Studio control</h1>
              <p className="text-sm text-white/60">Manage marketing copy, client workspaces, and AI notes.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <button onClick={refreshAll} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium text-white hover:border-white">
                Refresh data
              </button>
              <button
                onClick={() => {
                  setToken(null);
                  window.localStorage.removeItem("cmsToken");
                }}
                className="rounded-full border border-white/10 px-4 py-2 font-medium text-white/60 hover:border-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl space-y-10 px-6 py-12">
          {cmsMessage && <p className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-400">{cmsMessage}</p>}

          <section className={`${panelClass} overflow-hidden p-8`}>
            <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className={labelClass}>Operator view</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight">CHANGE Media command center</h2>
                <p className="mt-4 text-base text-white/60">
                  Keep the public site, AI assistant, and client portals aligned. Update JSON, drop new deliverables, and trigger fresh summaries without leaving this
                  screen.
                </p>
                <div className="mt-6 inline-flex flex-wrap gap-3 text-sm text-white/60">
                  <span className="rounded-full border border-white/10 px-3 py-1">Live editing</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">AI insights</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">Client portals</span>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Active clients", value: cmsStats.activeClients, detail: "Workspaces in flight" },
                  { label: "Deliverables", value: cmsStats.deliverables, detail: "Assets across work" },
                  { label: "Feedback loops", value: cmsStats.feedback, detail: "Notes to review" },
                  { label: "Next due", value: upcomingLabel, detail: cmsStats.nextDueDate ? "Soonest milestone" : "Schedule projects" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">{stat.label}</p>
                    <div className="mt-2 text-3xl font-semibold">{stat.value}</div>
                    <p className="text-sm text-white/60">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className={`${panelClass} p-6`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className={labelClass}>Site content JSON</p>
                  <h3 className="text-2xl font-semibold">Marketing copy + homepage data</h3>
                </div>
                <div className="flex gap-2 text-xs">
                  <button onClick={fetchContent} className="rounded-full border border-white/10 px-3 py-1 text-white/60 hover:border-white">
                    Reload
                  </button>
                  <button
                    disabled={!content}
                    onClick={() => content && setContentDraft(JSON.stringify(content, null, 2))}
                    className="rounded-full border border-white/10 px-3 py-1 text-white/60 disabled:opacity-40"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-white/60">Edit `content/site.json` safely, then publish to revalidate the landing page.</p>
              <textarea
                className="mt-4 h-[420px] w-full rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-xs text-white shadow-inner focus:outline-none focus:border-white/20"
                value={contentDraft}
                onChange={(e) => setContentDraft(e.target.value)}
              />
              <button
                disabled={contentSaving}
                onClick={handleSaveContent}
                className="mt-4 w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-60 hover:bg-white/90"
              >
                {contentSaving ? "Publishing…" : "Publish changes"}
              </button>
            </div>

            <div className={`${panelClass} p-6`}>
              <p className={labelClass}>New client workspace</p>
              <h3 className="mt-3 text-2xl font-semibold">Spin up a portal</h3>
              <form onSubmit={handleCreateProject} className="mt-6 grid gap-4">
                <div className="grid gap-1">
                  <label className="text-sm font-medium text-white/60">Client name</label>
                  <input required placeholder="Community Care" className={inputClass} value={projectForm.clientName} onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm font-medium text-white/60">Project title</label>
                  <input required placeholder="Rapid response campaign" className={inputClass} value={projectForm.projectTitle} onChange={(e) => setProjectForm({ ...projectForm, projectTitle: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm font-medium text-white/60">Access code</label>
                  <input required placeholder="secret-key" className={inputClass} value={projectForm.accessCode} onChange={(e) => setProjectForm({ ...projectForm, accessCode: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm font-medium text-white/60">Point of contact email</label>
                  <input
                    type="email"
                    required
                    placeholder="ops@partner.org"
                    className={inputClass}
                    value={projectForm.contactEmail}
                    onChange={(e) => setProjectForm({ ...projectForm, contactEmail: e.target.value })}
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm font-medium text-white/60">Project summary</label>
                  <textarea
                    required
                    placeholder="Intake notes, goals, tone..."
                    className={`${inputClass} min-h-[120px]`}
                    value={projectForm.summary}
                    onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm font-medium text-white/60">Due date</label>
                  <input
                    type="date"
                    required
                    className={inputClass}
                    value={projectForm.dueDate}
                    onChange={(e) => setProjectForm({ ...projectForm, dueDate: e.target.value })}
                  />
                </div>
                <button className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90">Create project</button>
              </form>
            </div>
          </section>

          <section className={`${panelClass} p-6`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className={labelClass}>Client workspaces</p>
                <h3 className="text-2xl font-semibold">Deliverables, AI notes, feedback</h3>
              </div>
              <select
                className={`${inputClass} md:w-72`}
                value={selectedProject?.id ?? ""}
                onChange={(e) => setSelectedProjectId(e.target.value || null)}
              >
                <option value="" className="bg-neutral-900 text-white">Select a workspace</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id} className="bg-neutral-900 text-white">
                    {project.clientName} — {project.projectTitle}
                  </option>
                ))}
              </select>
            </div>

            {selectedProject ? (
              <div className="mt-8 space-y-8">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Client</p>
                    <p className="mt-2 text-lg font-semibold">{selectedProject.clientName}</p>
                    <p className="text-sm text-white/60">{selectedProject.projectTitle}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Due date</p>
                    <p className="mt-2 text-lg font-semibold">
                      {selectedProject.dueDate ? new Date(selectedProject.dueDate).toLocaleDateString() : "Set date"}
                    </p>
                    <p className="text-sm text-white/60">
                      {selectedProject.summary
                        ? `${selectedProject.summary.slice(0, 60)}${selectedProject.summary.length > 60 ? "…" : ""}`
                        : "Add summary"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Portal link</p>
                    <a
                      className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline"
                      href={`/clients/${selectedProject.id}?key=${selectedProject.accessCode}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open client view ↗
                    </a>
                    <p className="mt-2 rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-white/60">{selectedProject.accessCode}</p>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-lg font-semibold">Deliverables</h4>
                        <span className="text-xs uppercase tracking-[0.3em] text-white/40">{selectedProject.deliverables.length} total</span>
                      </div>
                      <ul className="mt-4 space-y-3">
                        {selectedProject.deliverables.length === 0 && <li className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/60">No assets yet—add your first deliverable below.</li>}
                        {selectedProject.deliverables.map((deliverable) => (
                          <li key={deliverable.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <div className="flex flex-wrap items-center justify-between text-xs uppercase tracking-[0.3em] text-white/40">
                              <span>{deliverable.type}</span>
                              <span>{deliverable.status}</span>
                            </div>
                            <div className="mt-2 text-base font-semibold">{deliverable.title}</div>
                            {deliverable.description && <p className="text-sm text-white/60">{deliverable.description}</p>}
                            <a href={deliverable.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center text-sm text-white hover:underline">
                              Open asset ↗
                            </a>
                          </li>
                        ))}
                      </ul>

                      <form onSubmit={handleAddDeliverable} className="mt-6 grid gap-3 text-sm">
                        <h5 className="text-base font-semibold">Add deliverable</h5>
                        <input required placeholder="Title" className={inputClass} value={deliverableForm.title} onChange={(e) => setDeliverableForm({ ...deliverableForm, title: e.target.value })} />
                        <select className={inputClass} value={deliverableForm.type} onChange={(e) => setDeliverableForm({ ...deliverableForm, type: e.target.value as DeliverableForm["type"] })}>
                          <option value="video" className="bg-neutral-900 text-white">Video</option>
                          <option value="gallery" className="bg-neutral-900 text-white">Gallery</option>
                          <option value="document" className="bg-neutral-900 text-white">Document</option>
                          <option value="audio" className="bg-neutral-900 text-white">Audio</option>
                          <option value="link" className="bg-neutral-900 text-white">Link</option>
                        </select>
                        <input required placeholder="Asset URL" className={inputClass} value={deliverableForm.url} onChange={(e) => setDeliverableForm({ ...deliverableForm, url: e.target.value })} />
                        <textarea placeholder="Description" className={`${inputClass} min-h-[80px]`} value={deliverableForm.description} onChange={(e) => setDeliverableForm({ ...deliverableForm, description: e.target.value })} />
                        <button className="rounded-full border border-white/20 px-4 py-2 font-medium text-white hover:border-white">Save deliverable</button>
                      </form>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <h4 className="text-lg font-semibold">AI assistant</h4>
                      <p className="text-sm text-white/60">Summarize the project and surface next steps.</p>
                      <button onClick={handleRequestAi} className="mt-4 w-full rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-white/90">
                        Generate insights
                      </button>
                      {!aiSummary && selectedProject.aiNotes && (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                          <div className="text-xs uppercase tracking-[0.3em] text-white/40">Last saved insight</div>
                          <p className="mt-2 whitespace-pre-line">{selectedProject.aiNotes}</p>
                        </div>
                      )}
                      {aiSummary && (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                          <p>{aiSummary}</p>
                          {aiNextSteps.length > 0 && (
                            <ul className="mt-3 list-disc pl-4 text-white/60">
                              {aiNextSteps.map((step) => (
                                <li key={step}>{step}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <h4 className="text-lg font-semibold">Client feedback</h4>
                      <ul className="mt-4 space-y-3 text-sm">
                        {selectedProject.feedback.length === 0 && <li className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-white/60">No feedback submitted yet.</li>}
                        {selectedProject.feedback.map((note) => (
                          <li key={note.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <div className="text-xs uppercase tracking-[0.3em] text-white/40">
                              {note.author} — {new Date(note.timestamp).toLocaleString()}
                            </div>
                            <p className="mt-2 text-white/80">{note.message}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-8 rounded-2xl border border-dashed border-white/10 px-6 py-6 text-sm text-white/60">No projects yet—create one to unlock the workspace tools.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
