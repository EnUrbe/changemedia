import { NextRequest, NextResponse } from "next/server";
import { getProjectById } from "@/lib/projectsStore";

// Extracts a Cloudinary public ID from a delivery URL
function extractCloudinaryPublicId(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("res.cloudinary.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = parts.findIndex((p) => p === "upload");
    if (uploadIndex === -1) return null;

    const afterUpload = parts.slice(uploadIndex + 1);
    const withoutVersion = afterUpload[0]?.startsWith("v") ? afterUpload.slice(1) : afterUpload;
    const publicIdWithExt = withoutVersion.join("/");
    const publicId = publicIdWithExt.replace(/\.[^.]+$/, "");
    return publicId;
  } catch (error) {
    console.error("extractCloudinaryPublicId error", error);
    return null;
  }
}

async function buildArchiveUrl(publicIds: string[]) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary credentials");
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/generate_archive`;
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour

  const body = new URLSearchParams({
    public_ids: publicIds.join(","),
    target_format: "zip",
    expires_at: expiresAt.toString(),
    flatten_folders: "true",
    use_original_filename: "true",
  });

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary archive failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as { secure_url?: string };
  if (!json.secure_url) {
    throw new Error("No secure_url returned from Cloudinary");
  }

  return json.secure_url;
}

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const project = await getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const key = req.nextUrl.searchParams.get("key");
    if (project.accessCode && project.accessCode !== key) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deliverables = project.deliverables || [];

    const publicIds = deliverables
      .filter((d) => d.status === "ready")
      .flatMap((d) => {
        const ids: string[] = [];
        if (d.images && d.images.length > 0) {
          d.images.forEach((img) => {
            const id = extractCloudinaryPublicId(img);
            if (id) ids.push(id);
          });
        }
        if (d.url) {
          const id = extractCloudinaryPublicId(d.url);
          if (id) ids.push(id);
        }
        return ids;
      });

    if (publicIds.length === 0) {
      return NextResponse.json({ error: "No deliverable assets found" }, { status: 400 });
    }

    const archiveUrl = await buildArchiveUrl(publicIds);
    return NextResponse.json({ url: archiveUrl });
  } catch (error) {
    console.error("delivery archive error", error);
    return NextResponse.json({ error: "Failed to generate download link" }, { status: 500 });
  }
}
