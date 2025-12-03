import { NextRequest, NextResponse } from "next/server";
import { createPhotoSelectionGallery, getAllPendingEdits, updateGalleryStatus } from "@/lib/photoSelectionStore";
import { getProjectById } from "@/lib/projectsStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, title, description, photos, maxSelections } = body;

    // Validate project exists
    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json({ error: "Photos array is required" }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const gallery = await createPhotoSelectionGallery(
      projectId,
      title,
      photos,
      maxSelections || 15,
      description
    );

    return NextResponse.json({ success: true, gallery });
  } catch (error) {
    console.error("Error creating photo selection gallery:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create gallery" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const pendingEdits = await getAllPendingEdits();
    return NextResponse.json(pendingEdits);
  } catch (error) {
    console.error("Error fetching pending edits:", error);
    return NextResponse.json({ error: "Failed to fetch pending edits" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { galleryId, status } = body;

    if (!galleryId || !status) {
      return NextResponse.json({ error: "galleryId and status are required" }, { status: 400 });
    }

    await updateGalleryStatus(galleryId, status);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating gallery status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update status" },
      { status: 500 }
    );
  }
}
