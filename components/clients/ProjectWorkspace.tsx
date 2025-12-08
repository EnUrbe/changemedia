"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ClientFacingProject } from "@/lib/projectsStore";
import ProjectConcierge from "./ProjectConcierge";
import PhotoSelectionGallery from "./PhotoSelectionGallery";

const serifFont = "var(--font-family-serif, 'Instrument Serif', Georgia, serif)";

interface PhotoItem {
  id: string;
  url: string;
  thumbnail?: string;
  filename?: string;
}

interface PhotoSelection {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  photos: PhotoItem[];
  maxSelections: number;
  status: "pending" | "submitted" | "editing" | "delivered";
  selectedPhotos: string[];
  clientNotes?: string;
  submittedAt?: string;
  createdAt: string;
}

interface FeedbackFormState {
  author: string;
  role: string;
  message: string;
}

const statusColors: Record<string, string> = {
  planning: "bg-amber-100 text-amber-800 border border-amber-200",
  "in-production": "bg-sky-100 text-sky-800 border border-sky-200",
  "in-review": "bg-rose-100 text-rose-800 border border-rose-200",
  approved: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const panelClass = "rounded-[32px] border border-neutral-200 bg-white/90 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur";
const subtlePanelClass = "rounded-3xl border border-neutral-200 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]";
const inputClass =
  "w-full rounded-2xl border border-neutral-200 bg-white/70 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none";
const labelClass = "text-[0.65rem] uppercase tracking-[0.35em] text-neutral-500";

type Props = {
  project: ClientFacingProject;
  accessKey?: string | null;
  photoSelections?: PhotoSelection[];
};

export default function ProjectWorkspace({ project, accessKey, photoSelections = [] }: Props) {
  const [feedback, setFeedback] = useState(project.feedback);
  const [form, setForm] = useState<FeedbackFormState>({ author: "", role: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const deliverablesByStatus = useMemo(() => {
    return project.deliverables.reduce<Record<string, number>>((acc, deliverable) => {
      acc[deliverable.status] = (acc[deliverable.status] ?? 0) + 1;
      return acc;
    }, {});
  }, [project.deliverables]);

  const finalImages = useMemo(() => {
    return project.deliverables
      .filter((d) => d.status === "ready")
      .flatMap((d) =>
        (d.images || []).map((url, idx) => ({
          id: `${d.id}-${idx}`,
          url,
          title: d.title,
        }))
      );
  }, [project.deliverables]);

  function buildCloudinaryUrlWithTransformation(url: string, transformation: string) {
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.includes("res.cloudinary.com")) return url;
      const parts = parsed.pathname.split("/").filter(Boolean);
      const uploadIndex = parts.findIndex((p) => p === "upload");
      if (uploadIndex === -1) return url;
      const before = parts.slice(0, uploadIndex + 1);
      const after = parts.slice(uploadIndex + 1);
      const withTransform = [...before, transformation, ...after].join("/");
      return `${parsed.origin}/${withTransform}${parsed.search}`;
    } catch (error) {
      console.error("buildCloudinaryUrlWithTransformation error", error);
      return url;
    }
  }

  function buildPreviewUrl(url: string) {
    // Gentle watermark for previews
    const watermark = "q_auto,f_auto,w_1600/l_text:Arial_60:bold:CHANGE%20MEDIA,co_white,g_south,y_40,opacity_50";
    return buildCloudinaryUrlWithTransformation(url, watermark);
  }

  function buildDownloadUrl(url: string) {
    // Force download without watermark
    return buildCloudinaryUrlWithTransformation(url, "fl_attachment");
  }

  async function handleDownloadAll() {
    if (downloadingAll) return;
    setDownloadingAll(true);
    setDownloadError(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/delivery/archive${accessKey ? `?key=${accessKey}` : ""}`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Download failed");
      }
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      console.error(error);
      setDownloadError(error?.message || "Could not start download");
    } finally {
      setDownloadingAll(false);
    }
  }

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
    <main className="min-h-screen bg-[var(--background)] px-4 py-12 text-neutral-900">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-[#ffe1d3] via-[#fff5e4] to-[#dceeff] blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-[#e3f0ff] via-[#fae6ff] to-[#fff6df] blur-[160px]" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10">
        <header className={`${panelClass} p-8`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className={labelClass}>{project.clientName}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight" style={{ fontFamily: serifFont }}>
                {project.projectTitle}
              </h1>
              <p className="mt-3 text-base text-neutral-500">{project.summary}</p>
            </div>
            <div className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] ${statusColors[project.status] ?? "border border-neutral-200 bg-white"}`}>
              {project.status.replace("-", " ")}
            </div>
          </div>
          <div className="mt-6 grid gap-4 text-sm md:grid-cols-4">
            {[{
              label: "Due date",
              value: new Date(project.dueDate).toLocaleDateString(),
            },
            {
              label: "Deliverables ready",
              value: deliverablesByStatus.ready ?? 0,
            },
            {
              label: "Needs review",
              value: deliverablesByStatus["needs-review"] ?? 0,
            },
            {
              label: "Producer contact",
              value: project.pointOfContact.name,
              secondary: project.pointOfContact.email,
            }].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-neutral-200 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{stat.label}</p>
                <div className="mt-2 text-lg font-semibold text-neutral-900">{stat.value}</div>
                {stat.secondary && (
                  <a href={`mailto:${stat.secondary}`} className="text-xs text-neutral-500 hover:text-neutral-900">
                    {stat.secondary}
                  </a>
                )}
              </div>
            ))}
          </div>
        </header>

        <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className={panelClass + " p-6"}>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className={labelClass}>Deliverables</p>
                <h2 className="text-2xl font-semibold">Preview + approvals</h2>
              </div>
              <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500">
                {project.deliverables.length} uploads
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {project.deliverables.length === 0 && (
                <p className="rounded-2xl border border-dashed border-neutral-200 px-4 py-6 text-sm text-neutral-500">
                  Assets will appear here as soon as they’re ready.
                </p>
              )}
              {project.deliverables.map((deliverable) => (
                <article key={deliverable.id} className={`${subtlePanelClass} overflow-hidden`}>
                  <div className="border-b border-neutral-200/70 bg-white/60 px-5 py-3 text-xs uppercase tracking-[0.3em] text-neutral-500">
                    {deliverable.type} • {deliverable.status}
                  </div>
                  <div className="space-y-3 p-5">
                    <h3 className="text-lg font-semibold">{deliverable.title}</h3>
                    <p className="text-sm text-neutral-600">{deliverable.description}</p>
                    {deliverable.type === "video" ? (
                      <div className="overflow-hidden rounded-2xl border border-neutral-200">
                        <iframe
                          src={deliverable.url}
                          className="h-64 w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={deliverable.title}
                        />
                      </div>
                    ) : deliverable.type === "gallery" && deliverable.images && deliverable.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                        {deliverable.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
                            <Image
                              src={img}
                              alt={`${deliverable.title} ${idx + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 hover:scale-105"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <a href={deliverable.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-neutral-900 hover:underline">
                        Open file ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className={panelClass + " p-6"}>
              <p className={labelClass}>Checklist & AI notes</p>
              <h2 className="text-2xl font-semibold">What’s next</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-600">
                {project.checklist.length === 0 && <li className="text-neutral-500">No outstanding tasks.</li>}
                {project.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {project.aiNotes && (
                <div className="mt-5 rounded-2xl border border-neutral-200 bg-white/70 p-4 text-sm text-neutral-600">
                  <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">AI notes</div>
                  <p className="mt-2 whitespace-pre-line">{project.aiNotes}</p>
                </div>
              )}
            </div>

            <div className={panelClass + " p-6"}>
              <p className={labelClass}>Feedback</p>
              <h2 className="text-2xl font-semibold">Share timestamp notes</h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-sm">
                <input required placeholder="Your name" className={inputClass} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                <input placeholder="Role or team" className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                <textarea
                  required
                  placeholder="Add timestamp notes, requests, or approvals"
                  className={`${inputClass} min-h-[140px]`}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button disabled={submitting} className="w-full rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
                  {submitting ? "Sending…" : "Send feedback"}
                </button>
              </form>
              {toast && <p className="mt-2 text-xs text-neutral-500">{toast}</p>}
              <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                {feedback.map((note) => (
                  <li key={note.id} className={`${subtlePanelClass} p-4`}>
                    <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                      {note.author} • {new Date(note.timestamp).toLocaleString()}
                    </div>
                    <p className="mt-2">{note.message}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Photo Selection Galleries */}
        {photoSelections.length > 0 && (
          <section className="space-y-8">
            {photoSelections.map((gallery) => (
              <div key={gallery.id} id={`photos-${gallery.id}`}>
                <PhotoSelectionGallery
                  galleryId={gallery.id}
                  title={gallery.title}
                  description={gallery.description}
                  photos={gallery.photos}
                  maxSelections={gallery.maxSelections}
                  status={gallery.status}
                  selectedPhotos={gallery.selectedPhotos}
                  accessKey={accessKey || undefined}
                />
              </div>
            ))}
          </section>
        )}

        {/* Delivery section */}
        {finalImages.length > 0 && (
          <section className={panelClass + " p-6 space-y-6"}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className={labelClass}>Delivery</p>
                <h2 className="text-2xl font-semibold">Final photos</h2>
                <p className="text-sm text-neutral-600">Watermarked previews; download links are clean and expiring.</p>
              </div>
              <button
                onClick={handleDownloadAll}
                disabled={downloadingAll}
                className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {downloadingAll ? "Preparing…" : "Download all"}
              </button>
            </div>

            {downloadError && <p className="text-sm text-red-500">{downloadError}</p>}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {finalImages.map((photo) => (
                <div key={photo.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white/80 shadow-[0_15px_45px_rgba(15,23,42,0.07)]">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={buildPreviewUrl(photo.url)}
                      alt={photo.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-neutral-700">{photo.title}</span>
                    <a
                      href={buildDownloadUrl(photo.url)}
                      className="text-neutral-900 underline-offset-4 hover:underline"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <ProjectConcierge project={project} />
    </main>
  );
}
