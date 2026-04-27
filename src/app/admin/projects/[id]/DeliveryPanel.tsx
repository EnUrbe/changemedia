"use client";

import { useState } from "react";
import Image from "next/image";
import CloudinaryUploadWidget from "@/components/admin/CloudinaryUploadWidget";

interface PhotoItem {
  id: string;
  url: string;
  thumbnail?: string;
  filename?: string;
}

interface DeliveryPanelProps {
  galleryId: string;
  projectId: string;
  galleryTitle: string;
  selectedPhotos: PhotoItem[];
  clientNotes?: string;
  currentStatus: "submitted" | "editing";
}

export default function DeliveryPanel({
  galleryId,
  projectId,
  galleryTitle,
  selectedPhotos,
  clientNotes,
  currentStatus,
}: DeliveryPanelProps) {
  const [editedUrls, setEditedUrls] = useState<string[]>([]);
  const [status, setStatus] = useState(currentStatus);
  const [delivering, setDelivering] = useState(false);
  const [markingEditing, setMarkingEditing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpload = (url: string) => {
    setEditedUrls((prev) => [...prev, url]);
  };

  const removeEdited = (url: string) => {
    setEditedUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleMarkEditing = async () => {
    setMarkingEditing(true);
    try {
      const res = await fetch("/api/admin/photo-selections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ galleryId, status: "editing" }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setStatus("editing");
      setMessage({ type: "success", text: "Status updated to editing" });
    } catch {
      setMessage({ type: "error", text: "Could not update status" });
    } finally {
      setMarkingEditing(false);
    }
  };

  const handleDeliver = async () => {
    if (editedUrls.length === 0) {
      setMessage({ type: "error", text: "Upload at least one edited photo before delivering" });
      return;
    }
    setDelivering(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/photo-selections/${galleryId}/deliver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editedPhotoUrls: editedUrls, projectId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delivery failed");
      }
      setMessage({ type: "success", text: `Delivered ${editedUrls.length} photos — client email sent` });
      setStatus("editing");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Delivery failed" });
    } finally {
      setDelivering(false);
    }
  };

  return (
    <div className="mt-6 space-y-5 rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-neutral-900">Delivery queue — {galleryTitle}</h4>
        {status === "submitted" && (
          <button
            onClick={handleMarkEditing}
            disabled={markingEditing}
            className="rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {markingEditing ? "Updating…" : "Mark as editing"}
          </button>
        )}
      </div>

      {clientNotes && (
        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          <span className="font-medium">Client notes: </span>{clientNotes}
        </div>
      )}

      {/* Client's selected photos */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
          Client selected ({selectedPhotos.length})
        </p>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
          {selectedPhotos.map((photo, idx) => (
            <a
              key={photo.id}
              href={photo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden rounded-lg ring-2 ring-blue-400"
              title={`Open original ${idx + 1}`}
            >
              <Image
                src={photo.thumbnail ?? photo.url}
                alt={`Selected ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1 py-0.5 text-[10px] text-white">
                {idx + 1}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Upload edited versions */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
          Upload edited versions ({editedUrls.length})
        </p>
        <CloudinaryUploadWidget onUpload={handleUpload} multiple>
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 hover:border-neutral-500 hover:bg-neutral-50">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add edited photos
          </div>
        </CloudinaryUploadWidget>

        {editedUrls.length > 0 && (
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
            {editedUrls.map((url, idx) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-lg ring-2 ring-emerald-400">
                <Image
                  src={url}
                  alt={`Edited ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                <button
                  onClick={() => removeEdited(url)}
                  className="absolute right-0.5 top-0.5 hidden rounded-full bg-red-600 p-0.5 text-white group-hover:flex"
                  title="Remove"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {message && (
        <p className={`rounded-lg px-3 py-2 text-sm ${message.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
          {message.text}
        </p>
      )}

      <button
        onClick={handleDeliver}
        disabled={delivering || editedUrls.length === 0}
        className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {delivering ? "Delivering…" : `Deliver ${editedUrls.length > 0 ? editedUrls.length : ""} edited photos to client`}
      </button>
    </div>
  );
}
