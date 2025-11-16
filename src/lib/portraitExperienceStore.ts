import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_PATH = path.join(process.cwd(), "content", "portrait-experience.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "portrait");

export type StyleQuiz = {
  vibes: string[];
  lighting?: string;
  palette?: string;
  inspirationNotes?: string;
};

export type PortraitSubmission = {
  id: string;
  trackingCode: string;
  clientName: string;
  email: string;
  phone?: string;
  brand?: string;
  packageId: string;
  preferredDate?: string;
  timeWindow?: string;
  locationNotes?: string;
  comments?: string;
  createdAt: string;
  status: "intake" | "review" | "scheduled" | "delivered";
  uploads: UploadedReference[];
  styleQuiz: StyleQuiz;
  updates: PortraitUpdate[];
};

export type UploadedReference = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
};

export type PortraitUpdate = {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  sender: string;
  status?: PortraitSubmission["status"];
  attachments?: { label: string; url: string }[];
};

type UploadPayload = {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
};

async function ensureDataFile() {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, "[]\n", "utf-8");
  }
}

async function readAll(): Promise<PortraitSubmission[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  try {
    return JSON.parse(raw) as PortraitSubmission[];
  } catch {
    return [];
  }
}

async function writeAll(data: PortraitSubmission[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

function generateTrackingCode() {
  return randomUUID().split("-")[0].toUpperCase();
}

function safeFileName(original: string) {
  const ext = path.extname(original) || ".jpg";
  const base = path.basename(original, ext).replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");
  return `${Date.now()}-${base || "reference"}${ext}`;
}

async function persistUploads(uploads: UploadPayload[]): Promise<UploadedReference[]> {
  const saved: UploadedReference[] = [];
  for (const file of uploads) {
    if (!file.size) continue;
    const filename = safeFileName(file.originalName);
    await fs.writeFile(path.join(UPLOAD_DIR, filename), file.buffer);
    saved.push({
      id: randomUUID(),
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      url: `/uploads/portrait/${filename}`,
    });
  }
  return saved;
}

export type PortraitSubmissionInput = {
  clientName: string;
  email: string;
  phone?: string;
  brand?: string;
  packageId: string;
  preferredDate?: string;
  timeWindow?: string;
  locationNotes?: string;
  comments?: string;
  styleQuiz: StyleQuiz;
};

export async function savePortraitSubmission(input: PortraitSubmissionInput, uploadPayloads: UploadPayload[]) {
  const entries = await readAll();
  const uploads = await persistUploads(uploadPayloads);
  const submission: PortraitSubmission = {
    id: randomUUID(),
    trackingCode: generateTrackingCode(),
    clientName: input.clientName,
    email: input.email,
    phone: input.phone,
    brand: input.brand,
    packageId: input.packageId,
    preferredDate: input.preferredDate,
    timeWindow: input.timeWindow,
    locationNotes: input.locationNotes,
    comments: input.comments,
    styleQuiz: input.styleQuiz,
    uploads,
    status: "intake",
    createdAt: new Date().toISOString(),
    updates: [],
  };
  entries.unshift(submission);
  await writeAll(entries);
  return submission;
}

export async function listPortraitSubmissions(): Promise<PortraitSubmission[]> {
  return readAll();
}

export async function findSubmissionById(id: string) {
  const entries = await readAll();
  return entries.find((entry) => entry.id === id);
}

export async function findSubmissionByTrackingCode(code: string) {
  const entries = await readAll();
  return entries.find((entry) => entry.trackingCode.toUpperCase() === code.toUpperCase());
}

export async function updatePortraitSubmission(submissionId: string, updater: (submission: PortraitSubmission) => PortraitSubmission) {
  const entries = await readAll();
  const idx = entries.findIndex((entry) => entry.id === submissionId);
  if (idx === -1) return null;
  const updated = updater(entries[idx]);
  entries[idx] = updated;
  await writeAll(entries);
  return updated;
}

export async function appendPortraitUpdate(submissionId: string, payload: Omit<PortraitUpdate, "id" | "sentAt">) {
  return updatePortraitSubmission(submissionId, (current) => {
    const update: PortraitUpdate = {
      id: randomUUID(),
      title: payload.title,
      message: payload.message,
      sender: payload.sender,
      status: payload.status ?? current.status,
      attachments: payload.attachments,
      sentAt: new Date().toISOString(),
    };
    const nextStatus = payload.status ?? current.status;
    return {
      ...current,
      status: nextStatus,
      updates: [update, ...current.updates],
    };
  });
}

export type UploadPayloadInput = UploadPayload;

export async function setPortraitSubmissionStatus(submissionId: string, status: PortraitSubmission["status"]) {
  return updatePortraitSubmission(submissionId, (current) => ({
    ...current,
    status,
  }));
}
