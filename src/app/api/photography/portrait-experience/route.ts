import { NextRequest, NextResponse } from "next/server";
import {
  appendPortraitUpdate,
  findSubmissionById,
  findSubmissionByTrackingCode,
  listPortraitSubmissions,
  savePortraitSubmission,
  setPortraitSubmissionStatus,
  StyleQuiz,
  UploadPayloadInput,
} from "@/lib/portraitExperienceStore";
import { isAdminRequest } from "@/lib/auth";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackingCode = searchParams.get("trackingCode");

  if (trackingCode) {
    const submission = await findSubmissionByTrackingCode(trackingCode);
    if (!submission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ submission });
  }

  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  const submissions = await listPortraitSubmissions();
  return NextResponse.json({ submissions });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const clientName = String(formData.get("clientName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const packageId = String(formData.get("packageId") ?? "signature").trim();

  if (!clientName || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let styleQuiz: StyleQuiz = { vibes: [] };
  const styleQuizRaw = formData.get("styleQuiz");
  if (typeof styleQuizRaw === "string" && styleQuizRaw) {
    try {
      styleQuiz = JSON.parse(styleQuizRaw) as StyleQuiz;
      styleQuiz.vibes = Array.isArray(styleQuiz.vibes) ? styleQuiz.vibes : [];
    } catch {
      return NextResponse.json({ error: "Invalid style quiz data" }, { status: 400 });
    }
  }

  const uploads: UploadPayloadInput[] = [];
  const files = formData.getAll("references");
  for (const file of files) {
    if (file instanceof File && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      uploads.push({
        buffer,
        originalName: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
      });
    }
  }

  const submission = await savePortraitSubmission(
    {
      clientName,
      email,
      phone: String(formData.get("phone") ?? "").trim() || undefined,
      brand: String(formData.get("brand") ?? "").trim() || undefined,
      packageId,
      preferredDate: String(formData.get("preferredDate") ?? "").trim() || undefined,
      timeWindow: String(formData.get("timeWindow") ?? "").trim() || undefined,
      locationNotes: String(formData.get("locationNotes") ?? "").trim() || undefined,
      comments: String(formData.get("comments") ?? "").trim() || undefined,
      styleQuiz,
    },
    uploads,
  );

  return NextResponse.json({ submission }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { submissionId, trackingCode, status, update } = body as {
    submissionId?: string;
    trackingCode?: string;
    status?: "intake" | "review" | "scheduled" | "delivered";
    update?: { title: string; message: string; sender?: string; attachments?: { label: string; url: string }[] };
  };

  let targetId = submissionId;
  if (!targetId && trackingCode) {
    const existing = await findSubmissionByTrackingCode(trackingCode);
    if (!existing) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
    targetId = existing.id;
  }

  if (!targetId) {
    return NextResponse.json({ error: "Missing submission identifier" }, { status: 400 });
  }

  if (status) {
    const updated = await setPortraitSubmissionStatus(targetId, status);
    if (!updated) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
  }

  if (update && update.title && update.message) {
    const appended = await appendPortraitUpdate(targetId, {
      title: update.title,
      message: update.message,
      sender: update.sender ?? "Producer",
      attachments: update.attachments,
      status,
    });
    if (!appended) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
    return NextResponse.json({ submission: appended });
  }

  const record = targetId ? await findSubmissionById(targetId) : undefined;
  if (!record) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }
  return NextResponse.json({ submission: record });
}
