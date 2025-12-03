import "server-only";
import crypto from "crypto";
import { getSupabaseAdminClient } from "./supabaseAdmin";
import { sendEmail } from "./email";

export interface PhotoSelectionGallery {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  photos: PhotoItem[];
  maxSelections: number;
  status: "pending" | "submitted" | "editing" | "delivered";
  selectedPhotos: string[]; // Array of photo IDs
  clientNotes?: string;
  submittedAt?: string;
  createdAt: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  thumbnail?: string;
  filename?: string;
}

// Create photo_selections table if it doesn't exist (run via migration)
// For now, we'll store in a new table

export async function createPhotoSelectionGallery(
  projectId: string,
  title: string,
  photos: string[], // URLs
  maxSelections: number,
  description?: string
): Promise<PhotoSelectionGallery> {
  const supabase = getSupabaseAdminClient();
  
  const gallery: PhotoSelectionGallery = {
    id: crypto.randomUUID(),
    projectId,
    title,
    description,
    photos: photos.map((url, idx) => ({
      id: crypto.randomUUID(),
      url,
      filename: `Photo ${idx + 1}`,
    })),
    maxSelections,
    status: "pending",
    selectedPhotos: [],
    createdAt: new Date().toISOString(),
  };

  const { error } = await supabase.from("photo_selections").insert({
    id: gallery.id,
    project_id: gallery.projectId,
    title: gallery.title,
    description: gallery.description,
    photos: gallery.photos,
    max_selections: gallery.maxSelections,
    status: gallery.status,
    selected_photos: gallery.selectedPhotos,
    created_at: gallery.createdAt,
  });

  if (error) throw new Error(`Failed to create photo selection gallery: ${error.message}`);
  return gallery;
}

export async function getPhotoSelectionsByProject(projectId: string): Promise<PhotoSelectionGallery[]> {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from("photo_selections")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photo selections:", error);
    return [];
  }

  return data.map(mapFromDB);
}

export async function getPhotoSelectionById(id: string): Promise<PhotoSelectionGallery | null> {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from("photo_selections")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapFromDB(data);
}

export async function submitPhotoSelections(
  galleryId: string,
  selectedPhotos: string[],
  clientNotes?: string
): Promise<PhotoSelectionGallery> {
  const supabase = getSupabaseAdminClient();
  
  const gallery = await getPhotoSelectionById(galleryId);
  if (!gallery) throw new Error("Gallery not found");
  
  if (selectedPhotos.length > gallery.maxSelections) {
    throw new Error(`Maximum ${gallery.maxSelections} selections allowed`);
  }

  const { error } = await supabase
    .from("photo_selections")
    .update({
      selected_photos: selectedPhotos,
      client_notes: clientNotes,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", galleryId);

  if (error) throw new Error(`Failed to submit selections: ${error.message}`);

  // Send notification email to admin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  await sendEmail({
    to: process.env.ADMIN_EMAIL || "hello@changemedia.studio",
    subject: `📸 Photo Selections Submitted - ${gallery.title}`,
    text: `Client has submitted their photo selections for "${gallery.title}".

Selected ${selectedPhotos.length} of ${gallery.maxSelections} photos.

${clientNotes ? `Client Notes:\n${clientNotes}\n\n` : ""}View and start editing: ${siteUrl}/admin/projects/${gallery.projectId}`,
    html: `
      <h2>Photo Selections Submitted</h2>
      <p>Client has submitted their photo selections for <strong>${gallery.title}</strong>.</p>
      <p>Selected <strong>${selectedPhotos.length}</strong> of ${gallery.maxSelections} photos.</p>
      ${clientNotes ? `<p><strong>Client Notes:</strong><br/>${clientNotes}</p>` : ""}
      <p><a href="${siteUrl}/admin/projects/${gallery.projectId}">View selections and start editing →</a></p>
    `,
  });

  return { ...gallery, selectedPhotos, clientNotes, status: "submitted", submittedAt: new Date().toISOString() };
}

export async function updateGalleryStatus(
  galleryId: string,
  status: PhotoSelectionGallery["status"]
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  
  const { error } = await supabase
    .from("photo_selections")
    .update({ status })
    .eq("id", galleryId);

  if (error) throw new Error(`Failed to update status: ${error.message}`);
}

export async function getAllPendingEdits(): Promise<PhotoSelectionGallery[]> {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from("photo_selections")
    .select("*")
    .eq("status", "submitted")
    .order("submitted_at", { ascending: true });

  if (error) {
    console.error("Error fetching pending edits:", error);
    return [];
  }

  return data.map(mapFromDB);
}

function mapFromDB(row: any): PhotoSelectionGallery {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    photos: row.photos || [],
    maxSelections: row.max_selections,
    status: row.status,
    selectedPhotos: row.selected_photos || [],
    clientNotes: row.client_notes,
    submittedAt: row.submitted_at,
    createdAt: row.created_at,
  };
}
