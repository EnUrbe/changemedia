"use client";

import { useMemo, useState } from "react";
import type { ClientFacingProject } from "@/lib/projectsStore";

interface FeedbackFormState {
  author: string;
  role: string;
  message: string;
}

const statusColors: Record<string, string> = {
  planning: "bg-slate-500/20 text-slate-200",
  "in-production": "bg-sky-500/20 text-sky-200",
  "in-review": "bg-amber-500/20 text-amber-200",
  approved: "bg-emerald-500/20 text-emerald-200",
  delivered: "bg-emerald-500/30 text-emerald-100",
};

type Props = {
  project: ClientFacingProject;
  accessKey?: string | null;
};

export default function ProjectWorkspace({ project, accessKey }: Props) {
  const [feedback, setFeedback] = useState(project.feedback);
  const [form, setForm] = useState<FeedbackFormState>({ author: "", role: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const deliverablesByStatus = useMemo(() => {
    return project.deliverables.reduce<Record<string, number>>((acc, deliverable) => {
      acc[deliverable.status] = (acc[deliverable.status] ?? 0) + 1;
      return acc;
    }, {});
  }, [project.deliverables]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.author || !form.message) return;
    setSubmitting(true);
    setToast(null);
    try {
      const url = new URL(`/api/projects/${project.id}/feedback`, window.location.origin);
      if (accessKey) url.searchParams.set("key", accessKey);
      const res = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, accessCode: accessKey }),
      });
      if (!res.ok) throw new Error("Feedback failed");
      const data = await res.json();
      setFeedback((prev) => [data.feedback, ...prev]);
      setForm({ author: "", role: "", message: "" });
      setToast("Feedback sent. Thanks!");
    } catch (error) {
      console.error(error);
      setToast("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{project.clientName}</p>
              <h1 className="mt-2 text-3xl font-semibold">{project.projectTitle}</h1>
              <p className="mt-2 text-sm text-neutral-300">{project.summary}</p>
            </div>
            <div className={`rounded-full px-4 py-1 text-xs font-medium ${statusColors[project.status] ?? "bg-white/10"}`}>
              {project.status.replace("-", " ")}
            </div>
          </div>
          <div className="mt-4 grid gap-4 text-sm md:grid-cols-4">
            <div>
              <div className="text-neutral-400">Due date</div>
              <div className="text-base font-medium">{new Date(project.dueDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-neutral-400">Deliverables ready</div>
              <div className="text-base font-medium">{deliverablesByStatus.ready ?? 0}</div>
            </div>
            <div>
              <div className="text-neutral-400">Needs review</div>
              <div className="text-base font-medium">{deliverablesByStatus["needs-review"] ?? 0}</div>
            </div>
            <div>
              <div className="text-neutral-400">Producer contact</div>
              <div className="text-base font-medium">{project.pointOfContact.name}</div>
              <a href={`mailto:${project.pointOfContact.email}`} className="text-xs text-emerald-300 hover:underline">
                {project.pointOfContact.email}
              </a>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Deliverables</h2>
            <div className="mt-4 space-y-4">
              {project.deliverables.length === 0 && (
                <p className="text-sm text-neutral-400">Assets will appear here as soon as they’re ready.</p>
              )}
              {project.deliverables.map((deliverable) => (
                <article key={deliverable.id} className="rounded-2xl border border-white/10 bg-neutral-950/60">
                  <div className="border-b border-white/5 px-4 py-3 text-xs uppercase tracking-wide text-neutral-400">
                    {deliverable.type} • {deliverable.status}
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold">{deliverable.title}</h3>
                    <p className="text-sm text-neutral-400">{deliverable.description}</p>
                    {deliverable.type === "video" ? (
                      <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                        <iframe
                          src={deliverable.url}
                          className="h-56 w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={deliverable.title}
                        />
                      </div>
                    ) : (
                      <a
                        href={deliverable.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center text-sm text-emerald-300 hover:underline"
                      >
                        Open file ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Checklist</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-300">
                {project.checklist.length === 0 && <li>No outstanding tasks.</li>}
                {project.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {project.aiNotes && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-950/50 p-4 text-sm text-neutral-200">
                  <div className="text-xs uppercase tracking-[0.2em] text-neutral-400">AI Notes</div>
                  <p className="mt-2">{project.aiNotes}</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Feedback</h2>
              <form onSubmit={handleSubmit} className="mt-3 space-y-3 text-sm">
                <input
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
                <input
                  placeholder="Role or team"
                  className="w-full rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
                <textarea
                  required
                  placeholder="Add timestamp notes, requests, or approvals"
                  className="w-full rounded-xl border border-white/10 bg-neutral-950/60 px-3 py-2"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button
                  disabled={submitting}
                  className="w-full rounded-xl bg-white px-3 py-2 text-sm font-semibold text-neutral-900 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send feedback"}
                </button>
              </form>
              {toast && <p className="mt-2 text-xs text-neutral-400">{toast}</p>}
              <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                {feedback.map((note) => (
                  <li key={note.id} className="rounded-2xl border border-white/10 p-3">
                    <div className="text-xs uppercase text-neutral-500">
                      {note.author} • {new Date(note.timestamp).toLocaleString()}
                    </div>
                    <p className="mt-1">{note.message}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
