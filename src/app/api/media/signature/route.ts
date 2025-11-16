import { NextRequest, NextResponse } from "next/server";
import { createCloudinarySignature } from "@/lib/cloudinary";
import { isAdminRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!apiSecret || !apiKey || !cloudName) {
    return NextResponse.json({
      error: "Cloudinary credentials are not fully configured.",
    }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const timestamp = Math.round(Date.now() / 1000);
  const folder = body.folder ?? process.env.CLOUDINARY_UPLOAD_FOLDER ?? "changemedia/photography";
  const uploadPreset = body.uploadPreset;

  const params = {
    folder,
    timestamp,
    upload_preset: uploadPreset,
    public_id: body.publicId,
    eager: body.eager,
    invalidate: body.invalidate,
    overwrite: body.overwrite,
  } as Record<string, string | number | undefined>;

  const signature = createCloudinarySignature(params, apiSecret);

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    apiKey,
    cloudName,
    uploadPreset,
  });
}
