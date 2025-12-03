"use client";

import { useState } from "react";
import Image from "next/image";

interface PhotoItem {
  id: string;
  url: string;
  thumbnail?: string;
  filename?: string;
}

interface PhotoSelectionGallery {
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

interface PhotoSelectionsAdminProps {
  projectId: string;
  photoSelections: PhotoSelectionGallery[];
  accessCode: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  submitted: "bg-blue-100 text-blue-800",
  editing: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
};

export default function PhotoSelectionsAdmin({ projectId, photoSelections, accessCode }: PhotoSelectionsAdminProps) {
  const [expandedGallery, setExpandedGallery] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (galleryId: string, newStatus: PhotoSelectionGallery["status"]) => {
    setUpdating(galleryId);
    try {
      const res = await fetch("/api/admin/photo-selections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ galleryId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const getClientUrl = (galleryId: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/clients/${projectId}?key=${accessCode}#photos-${galleryId}`;
  };

  const copyClientUrl = (galleryId: string) => {
    navigator.clipboard.writeText(getClientUrl(galleryId));
    alert("Link copied to clipboard!");
  };

  if (photoSelections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold text-neutral-900">📸 Photo Selections</h2>
        <span className="text-sm text-neutral-500">{photoSelections.length} galleries</span>
      </div>

      {photoSelections.map((gallery) => {
        const isExpanded = expandedGallery === gallery.id;
        const selectedPhotoObjects = gallery.photos.filter((p) => 
          gallery.selectedPhotos.includes(p.id)
        );

        return (
          <div
            key={gallery.id}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
          >
            {/* Header */}
            <div 
              className="flex cursor-pointer items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-6 py-4"
              onClick={() => setExpandedGallery(isExpanded ? null : gallery.id)}
            >
              <div>
                <h3 className="font-medium text-neutral-900">{gallery.title}</h3>
                <p className="text-sm text-neutral-500">
                  {gallery.selectedPhotos.length} / {gallery.maxSelections} selected • {gallery.photos.length} total photos
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${statusColors[gallery.status]}`}>
                  {gallery.status}
                </span>
                <svg 
                  className={`h-5 w-5 text-neutral-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="p-6">
                {/* Status Update Buttons */}
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-neutral-500">Update status:</span>
                  {(["pending", "submitted", "editing", "delivered"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(gallery.id, status)}
                      disabled={updating === gallery.id || gallery.status === status}
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                        gallery.status === status
                          ? statusColors[status]
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      } disabled:opacity-50`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Client Notes */}
                {gallery.clientNotes && (
                  <div className="mb-6 rounded-lg bg-blue-50 p-4">
                    <p className="mb-1 text-sm font-medium text-blue-900">Client Notes</p>
                    <p className="text-sm text-blue-800">{gallery.clientNotes}</p>
                  </div>
                )}

                {/* Share Link */}
                <div className="mb-6 flex items-center gap-2 rounded-lg bg-neutral-100 p-3">
                  <input
                    type="text"
                    readOnly
                    value={getClientUrl(gallery.id)}
                    className="flex-1 bg-transparent text-xs text-neutral-600"
                  />
                  <button
                    onClick={() => copyClientUrl(gallery.id)}
                    className="rounded-md bg-neutral-900 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800"
                  >
                    Copy Link
                  </button>
                </div>

                {/* Selected Photos */}
                {gallery.status !== "pending" && selectedPhotoObjects.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold text-neutral-900">
                      Selected for Editing ({selectedPhotoObjects.length})
                    </h4>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                      {selectedPhotoObjects.map((photo, idx) => (
                        <a
                          key={photo.id}
                          href={photo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative aspect-square overflow-hidden rounded-lg ring-2 ring-emerald-500"
                        >
                          <Image
                            src={photo.thumbnail || photo.url}
                            alt={`Selected ${idx + 1}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="100px"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                          <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 py-0.5 text-[10px] text-white">
                            {idx + 1}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Photos (collapsed by default) */}
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-neutral-600 hover:text-neutral-900">
                    View all {gallery.photos.length} photos
                  </summary>
                  <div className="mt-3 grid grid-cols-6 gap-1 sm:grid-cols-8 md:grid-cols-10">
                    {gallery.photos.map((photo, idx) => {
                      const isSelected = gallery.selectedPhotos.includes(photo.id);
                      return (
                        <a
                          key={photo.id}
                          href={photo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`relative aspect-square overflow-hidden rounded ${
                            isSelected ? "ring-2 ring-emerald-500" : ""
                          }`}
                        >
                          <Image
                            src={photo.thumbnail || photo.url}
                            alt={`Photo ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="60px"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/30">
                              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </details>

                {/* Submitted timestamp */}
                {gallery.submittedAt && (
                  <p className="mt-4 text-xs text-neutral-400">
                    Submitted: {new Date(gallery.submittedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
