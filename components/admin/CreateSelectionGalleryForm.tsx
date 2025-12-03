"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import CloudinaryUploadWidget from "@/components/admin/CloudinaryUploadWidget";

interface CreateSelectionGalleryFormProps {
  projectId: string;
}

export default function CreateSelectionGalleryForm({ projectId }: CreateSelectionGalleryFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxSelections, setMaxSelections] = useState(15);
  const [images, setImages] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpload = (url: string) => {
    setImages((prev) => (prev ? `${prev}\n${url}` : url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const photoUrls = images
      .split(/[\n,]/)
      .map((url) => url.trim())
      .filter((url) => url.startsWith("http"));

    if (photoUrls.length === 0) {
      setMessage({ type: "error", text: "Please add at least one photo URL" });
      setSubmitting(false);
      return;
    }

    if (maxSelections > photoUrls.length) {
      setMessage({ type: "error", text: `Max selections (${maxSelections}) cannot exceed number of photos (${photoUrls.length})` });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/photo-selections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title,
          description: description || undefined,
          photos: photoUrls,
          maxSelections,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create gallery");
      }

      setMessage({ type: "success", text: "Selection gallery created! Client can now select their photos." });
      setTitle("");
      setDescription("");
      setImages("");
      setMaxSelections(15);
      
      // Refresh the page to show the new gallery
      window.location.reload();
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700">Gallery Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2"
          placeholder="e.g., Portrait Session - Culled Photos"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">Description (optional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2"
          placeholder="e.g., Please select your favorite 15 photos for editing"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">Max Selections</label>
        <input
          type="number"
          required
          min={1}
          value={maxSelections}
          onChange={(e) => setMaxSelections(parseInt(e.target.value) || 15)}
          className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2"
        />
        <p className="mt-1 text-xs text-neutral-500">Based on the client's package</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">Photos</label>
        <div className="mt-1 mb-2">
          <CloudinaryUploadWidget onUpload={handleUpload} />
        </div>
        <textarea
          required
          value={images}
          onChange={(e) => setImages(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 font-mono text-xs"
          rows={6}
          placeholder="https://res.cloudinary.com/...&#10;https://res.cloudinary.com/...&#10;(one URL per line or comma-separated)"
        />
        <p className="mt-1 text-xs text-neutral-500">
          {images.split(/[\n,]/).filter((url) => url.trim().startsWith("http")).length} photos added
        </p>
      </div>

      {message && (
        <div className={`rounded-lg p-3 text-sm ${
          message.type === "success" 
            ? "bg-emerald-50 text-emerald-800" 
            : "bg-red-50 text-red-800"
        }`}>
          {message.text}
        </div>
      )}

      <Button type="submit" fullWidth disabled={submitting}>
        {submitting ? "Creating..." : "Create Selection Gallery"}
      </Button>
    </form>
  );
}
