"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import CloudinaryUploadWidget from "@/components/admin/CloudinaryUploadWidget";

interface Project {
  id: string;
  clientName: string;
  projectTitle: string;
}

interface QuickPhotoUploadProps {
  projects: Project[];
}

export default function QuickPhotoUpload({ projects }: QuickPhotoUploadProps) {
  const [selectedProject, setSelectedProject] = useState("");
  const [title, setTitle] = useState("");
  const [maxSelections, setMaxSelections] = useState(15);
  const [images, setImages] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpload = (url: string) => {
    setImages((prev) => (prev ? `${prev}\n${url}` : url));
  };

  const photoCount = images
    .split(/[\n,]/)
    .filter((url) => url.trim().startsWith("http")).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) {
      setMessage({ type: "error", text: "Please select a project" });
      return;
    }
    
    setSubmitting(true);
    setMessage(null);

    const photoUrls = images
      .split(/[\n,]/)
      .map((url) => url.trim())
      .filter((url) => url.startsWith("http"));

    if (photoUrls.length === 0) {
      setMessage({ type: "error", text: "Please add at least one photo" });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/photo-selections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject,
          title: title || "Photo Selection",
          photos: photoUrls,
          maxSelections,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create gallery");
      }

      setMessage({ type: "success", text: `Gallery created with ${photoUrls.length} photos!` });
      setTitle("");
      setImages("");
      setSelectedProject("");
      
      // Refresh page after short delay
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <div className="mx-auto mb-3 text-3xl opacity-50">📸</div>
        <p className="text-sm text-white/50">Create a project first to upload photos</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02]">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-xl">
            📸
          </div>
          <div>
            <h2 className="font-semibold text-white">Photo Selection</h2>
            <p className="text-xs text-white/50">Upload culled photos for client</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
            Project
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition-colors focus:border-white/20 focus:outline-none"
            required
          >
            <option value="" className="bg-neutral-900">Choose project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-neutral-900">
                {p.clientName} — {p.projectTitle}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Gallery Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dec 2025 Session"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors focus:border-white/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Max Picks
            </label>
            <input
              type="number"
              min={1}
              value={maxSelections}
              onChange={(e) => setMaxSelections(parseInt(e.target.value) || 15)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition-colors focus:border-white/20 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
            Photos
          </label>
          <div className="mb-2">
            <CloudinaryUploadWidget onUpload={handleUpload} />
          </div>
          <textarea
            value={images}
            onChange={(e) => setImages(e.target.value)}
            placeholder="Or paste URLs (one per line)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-xs text-white placeholder:text-white/30 transition-colors focus:border-white/20 focus:outline-none"
            rows={3}
          />
          {photoCount > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-400">
                ✓
              </span>
              <span className="text-emerald-400">{photoCount} photo{photoCount > 1 ? "s" : ""} ready</span>
            </div>
          )}
        </div>

        {message && (
          <div className={`rounded-xl p-3 text-sm ${
            message.type === "success" 
              ? "bg-emerald-500/20 text-emerald-300" 
              : "bg-red-500/20 text-red-300"
          }`}>
            {message.text}
          </div>
        )}

        <Button 
          type="submit" 
          fullWidth 
          disabled={submitting || photoCount === 0}
          className="!rounded-xl"
        >
          {submitting ? "Creating..." : photoCount > 0 ? `Create Gallery (${photoCount})` : "Add photos first"}
        </Button>
      </form>
    </div>
  );
}
