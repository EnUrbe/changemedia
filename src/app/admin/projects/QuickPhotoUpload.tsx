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

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">📸</span>
        <div>
          <h2 className="text-lg font-semibold text-white">Quick Photo Upload</h2>
          <p className="text-sm text-white/60">Create selection gallery for client</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-white/70">Select Project</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
            required
          >
            <option value="" className="bg-neutral-900">Choose a project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-neutral-900">
                {p.clientName} - {p.projectTitle}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/70">Gallery Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Portrait Session Dec 2025"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/30"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/70">Max Selections (based on package)</label>
          <input
            type="number"
            min={1}
            value={maxSelections}
            onChange={(e) => setMaxSelections(parseInt(e.target.value) || 15)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/70">Upload Photos</label>
          <CloudinaryUploadWidget onUpload={handleUpload} />
          <textarea
            value={images}
            onChange={(e) => setImages(e.target.value)}
            placeholder="Or paste URLs here (one per line)"
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white placeholder:text-white/30"
            rows={4}
          />
          {photoCount > 0 && (
            <p className="mt-1 text-sm text-emerald-400">
              ✓ {photoCount} photo{photoCount > 1 ? "s" : ""} ready
            </p>
          )}
        </div>

        {message && (
          <div className={`rounded-lg p-3 text-sm ${
            message.type === "success" 
              ? "bg-emerald-500/20 text-emerald-300" 
              : "bg-red-500/20 text-red-300"
          }`}>
            {message.text}
          </div>
        )}

        <Button type="submit" fullWidth disabled={submitting || photoCount === 0}>
          {submitting ? "Creating..." : `Create Gallery (${photoCount} photos)`}
        </Button>
      </form>
    </div>
  );
}
