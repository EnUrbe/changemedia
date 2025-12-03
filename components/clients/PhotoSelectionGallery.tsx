"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

const serifFont = "var(--font-family-serif, 'Instrument Serif', Georgia, serif)";

interface PhotoItem {
  id: string;
  url: string;
  thumbnail?: string;
  filename?: string;
}

interface PhotoSelectionGalleryProps {
  galleryId: string;
  title: string;
  description?: string;
  photos: PhotoItem[];
  maxSelections: number;
  status: "pending" | "submitted" | "editing" | "delivered";
  selectedPhotos?: string[];
  accessKey?: string;
}

const panelClass = "rounded-[32px] border border-neutral-200 bg-white/90 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur";

export default function PhotoSelectionGallery({
  galleryId,
  title,
  description,
  photos,
  maxSelections,
  status,
  selectedPhotos: initialSelected = [],
  accessKey,
}: PhotoSelectionGalleryProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(status === "submitted" || status === "editing" || status === "delivered");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const remaining = maxSelections - selected.size;
  const canSubmit = selected.size > 0 && selected.size <= maxSelections;

  const togglePhoto = (photoId: string) => {
    if (submitted) return;
    
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else if (next.size < maxSelections) {
        next.add(photoId);
      } else {
        setToast(`You can only select up to ${maxSelections} photos`);
        setTimeout(() => setToast(null), 3000);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setToast(null);

    try {
      const url = new URL(`/api/projects/photo-selections/${galleryId}`, window.location.origin);
      if (accessKey) url.searchParams.set("key", accessKey);

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPhotos: Array.from(selected),
          clientNotes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit selections");
      }

      setSubmitted(true);
      setToast("Your selections have been submitted! We'll start editing soon.");
    } catch (error) {
      console.error(error);
      setToast(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPhotos = useMemo(() => {
    return photos.filter((p) => selected.has(p.id));
  }, [photos, selected]);

  if (status === "delivered") {
    return (
      <div className={`${panelClass} p-8 text-center`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold" style={{ fontFamily: serifFont }}>Photos Delivered!</h2>
        <p className="mt-2 text-neutral-600">Your edited photos have been delivered. Check your deliverables for the final gallery.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${panelClass} p-8`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-neutral-500">Photo Selection</p>
            <h2 className="mt-2 text-3xl font-semibold" style={{ fontFamily: serifFont }}>{title}</h2>
            {description && <p className="mt-2 text-neutral-600">{description}</p>}
          </div>
          <div className="flex items-center gap-3">
            {submitted ? (
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">
                ✓ Submitted
              </span>
            ) : (
              <span className={`rounded-full px-4 py-2 text-sm font-medium ${
                remaining === 0 
                  ? "bg-emerald-100 text-emerald-800" 
                  : "bg-amber-100 text-amber-800"
              }`}>
                {remaining === 0 ? "Ready to submit" : `${remaining} more to select`}
              </span>
            )}
          </div>
        </div>

        {!submitted && (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white">
                <span className="text-sm font-bold">{selected.size}</span>
              </div>
              <div>
                <p className="font-medium text-neutral-900">
                  {selected.size} of {maxSelections} photos selected
                </p>
                <p className="text-sm text-neutral-500">
                  Click on photos to select your favorites
                </p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200">
              <div 
                className="h-full rounded-full bg-neutral-900 transition-all duration-300"
                style={{ width: `${(selected.size / maxSelections) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Photo Grid */}
      <div className={`${panelClass} p-6`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {photos.map((photo, idx) => {
            const isSelected = selected.has(photo.id);
            const isDisabled = submitted && !isSelected;
            
            return (
              <button
                key={photo.id}
                onClick={() => togglePhoto(photo.id)}
                onDoubleClick={() => setLightbox(photo.url)}
                disabled={submitted}
                className={`group relative aspect-square overflow-hidden rounded-xl transition-all ${
                  isSelected 
                    ? "ring-4 ring-neutral-900 ring-offset-2" 
                    : isDisabled 
                      ? "opacity-40" 
                      : "hover:ring-2 hover:ring-neutral-300"
                } ${submitted ? "cursor-default" : "cursor-pointer"}`}
              >
                <Image
                  src={photo.thumbnail || photo.url}
                  alt={photo.filename || `Photo ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
                
                {/* Selection indicator */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all ${
                  isSelected ? "bg-black/30" : "bg-transparent"
                }`}>
                  {isSelected && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                      <svg className="h-6 w-6 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Photo number badge */}
                <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                  {idx + 1}
                </div>

                {/* Zoom hint on hover */}
                {!submitted && (
                  <div className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Photos Preview */}
      {selected.size > 0 && !submitted && (
        <div className={`${panelClass} p-6`}>
          <h3 className="mb-4 text-lg font-semibold">Your Selections</h3>
          <div className="flex flex-wrap gap-2">
            {selectedPhotos.map((photo, idx) => (
              <div key={photo.id} className="relative">
                <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                  <Image
                    src={photo.thumbnail || photo.url}
                    alt={`Selected ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => togglePhoto(photo.id)}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white hover:bg-red-600"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes & Submit */}
      {!submitted && (
        <div className={`${panelClass} p-6`}>
          <h3 className="mb-4 text-lg font-semibold">Ready to Submit?</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Any notes for the editor? (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Please brighten the photos, I prefer warmer tones, etc."
                className="mt-1 w-full rounded-xl border border-neutral-200 bg-white/70 px-4 py-3 text-sm focus:border-neutral-900 focus:outline-none"
                rows={3}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="w-full rounded-full bg-neutral-900 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : `Submit ${selected.size} Selections`}
            </button>
            <p className="text-center text-xs text-neutral-500">
              Once submitted, we'll begin editing your selected photos
            </p>
          </div>
        </div>
      )}

      {/* Success message for submitted */}
      {submitted && (status === "submitted" || status === "editing") && (
        <div className={`${panelClass} p-8 text-center`}>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold" style={{ fontFamily: serifFont }}>
            {status === "editing" ? "We're Editing Your Photos" : "Selections Submitted!"}
          </h3>
          <p className="mt-2 text-neutral-600">
            {status === "editing" 
              ? "Your photos are being edited. We'll notify you when they're ready."
              : "Thank you! We'll start editing your selected photos soon."}
          </p>
          <div className="mt-6">
            <p className="text-sm font-medium text-neutral-900">You selected {selected.size} photos:</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {selectedPhotos.map((photo, idx) => (
                <div key={photo.id} className="relative h-16 w-16 overflow-hidden rounded-lg">
                  <Image
                    src={photo.thumbnail || photo.url}
                    alt={`Selected ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-neutral-900 px-6 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button 
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl">
            <Image
              src={lightbox}
              alt="Full size preview"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
