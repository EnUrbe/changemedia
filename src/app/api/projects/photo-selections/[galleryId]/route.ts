import { NextRequest, NextResponse } from "next/server";
import { getPhotoSelectionById, submitPhotoSelections } from "@/lib/photoSelectionStore";
import { getProjectByAccessCode } from "@/lib/projectsStore";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ galleryId: string }> }
) {
  try {
    const { galleryId } = await params;
    const body = await request.json();
    const { selectedPhotos, clientNotes } = body;

    // Validate access - check for access key in query params
    const accessKey = request.nextUrl.searchParams.get("key");
    
    // Get the gallery to verify project access
    const gallery = await getPhotoSelectionById(galleryId);
    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    // Verify access code matches the project
    if (accessKey) {
      const project = await getProjectByAccessCode(accessKey);
      if (!project || project.id !== gallery.projectId) {
        return NextResponse.json({ error: "Invalid access" }, { status: 403 });
      }
    }

    if (!Array.isArray(selectedPhotos) || selectedPhotos.length === 0) {
      return NextResponse.json({ error: "No photos selected" }, { status: 400 });
    }

    const updated = await submitPhotoSelections(galleryId, selectedPhotos, clientNotes);

    return NextResponse.json({ success: true, gallery: updated });
  } catch (error) {
    console.error("Error submitting photo selections:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit selections" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ galleryId: string }> }
) {
  try {
    const { galleryId } = await params;
    
    const gallery = await getPhotoSelectionById(galleryId);
    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}
