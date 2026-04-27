import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import crypto from "crypto";
import { getPhotoSelectionById, deliverGallery } from "@/lib/photoSelectionStore";
import { appendDeliverable, getProjectById } from "@/lib/projectsStore";
import { sendEmail } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ galleryId: string }> }
) {
  const { galleryId } = await params;

  let editedPhotoUrls: string[];
  try {
    const body = await request.json();
    editedPhotoUrls = body.editedPhotoUrls;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(editedPhotoUrls) || editedPhotoUrls.length === 0) {
    return NextResponse.json({ error: "editedPhotoUrls must be a non-empty array" }, { status: 400 });
  }

  const gallery = await getPhotoSelectionById(galleryId);
  if (!gallery) {
    return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
  }

  const project = await getProjectById(gallery.projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  await deliverGallery(galleryId);

  await appendDeliverable(gallery.projectId, {
    id: crypto.randomUUID(),
    type: "gallery",
    title: `${gallery.title} — Edited`,
    description: `${editedPhotoUrls.length} edited photo${editedPhotoUrls.length === 1 ? "" : "s"} from your ${gallery.title} session.`,
    url: editedPhotoUrls[0],
    images: editedPhotoUrls,
    status: "ready",
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const portalUrl = `${siteUrl}/clients/${project.id}?key=${project.accessCode}`;
  const { name, email } = project.pointOfContact;
  const title = gallery.title;

  after(async () => {
    try {
      await sendEmail({
        to: email,
        subject: `Your ${title} photos are ready`,
        text: `Hi ${name},\n\nYour edited photos are ready to view and download.\n\nOpen your gallery: ${portalUrl}\n\n— The CHANGE Media team`,
        html: `
          <p>Hi ${name},</p>
          <p>Your edited photos from <strong>${title}</strong> are ready.</p>
          <p>
            <a href="${portalUrl}" style="display:inline-block;background:#111;color:#fff;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:600;font-size:14px;">
              View &amp; download your photos →
            </a>
          </p>
          <p style="color:#888;font-size:12px;">The CHANGE Media team</p>
        `,
      });
    } catch (emailError) {
      console.error("Delivery email failed:", emailError);
    }
  });

  return NextResponse.json({ success: true, delivered: editedPhotoUrls.length });
}
