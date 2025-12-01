import { NextResponse } from "next/server";
import { getSupabaseAdminClient, type PortraitInquiryStatus } from "@/lib/supabaseAdmin";

const RL_WINDOW_MS = 60_000;
const RL_MAX = 5;

declare global {
  var __cm_rl: Map<string, number[]> | undefined;
}

const rlStore: Map<string, number[]> = globalThis.__cm_rl || new Map();
globalThis.__cm_rl = rlStore;


function getClientIp(req: Request) {
  const forwarded = req.headers.get("forwarded");
  if (forwarded) {
    const match = forwarded.match(/for=([^;]+)/i);
    if (match) {
      const ip = match[1].replace(/["\[\]]/g, "");
      if (ip) return ip;
    }
  }
  const candidates = [
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
    "true-client-ip",
    "fly-client-ip",
  ];
  for (const header of candidates) {
    const value = req.headers.get(header);
    if (value) {
      const ip = value.split(",")[0].trim();
      if (ip) return ip;
    }
  }
  return "unknown";
}

function rateLimited(ip: string) {
  const now = Date.now();
  const arr = rlStore.get(ip) || [];
  const recent = arr.filter((ts) => now - ts < RL_WINDOW_MS);
  if (recent.length >= RL_MAX) return true;
  recent.push(now);
  rlStore.set(ip, recent);
  return false;
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

async function postToSlack(text: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const t = await res.text();
      console.error("Slack webhook error:", res.status, t);
    }
  } catch (error) {
    clearTimeout(timeout);
    console.error("Slack webhook failed:", error);
  }
}

function selectStatus(candidate?: string | null): PortraitInquiryStatus {
  const allowed: PortraitInquiryStatus[] = [
    "NEW",
    "CONTACTED",
    "PAYMENT_PENDING",
    "DEPOSIT_PAID",
    "SCHEDULED",
    "SHOT_DONE",
    "GALLERY_SENT",
  ];
  if (!candidate) return "NEW";
  return allowed.includes(candidate as PortraitInquiryStatus) ? (candidate as PortraitInquiryStatus) : "NEW";
}

function sanitizeString(input: unknown, max = 500) {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, max);
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again soon." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const data = body as Record<string, unknown>;

    const hp = sanitizeString(data.hp).toLowerCase();
    if (hp) {
      return NextResponse.json({ success: true });
    }

    const ts = Number(data.ts);
    if (Number.isFinite(ts)) {
      const delta = Date.now() - ts;
      if (delta < 1500) {
        return NextResponse.json({ success: true });
      }
      if (delta > 1000 * 60 * 60 * 24 * 2) {
        return NextResponse.json({ error: "Submission expired." }, { status: 400 });
      }
    }

    const fullName = sanitizeString(data.full_name ?? data.name, 160);
    const email = sanitizeString(data.email, 200);
    const phone = sanitizeString(data.phone, 60);
    const school = sanitizeString(data.school ?? data.org, 160) || null;
    const sessionType = sanitizeString(data.session_type, 60) || null;
    const preferredDates = sanitizeString(data.preferred_dates ?? data.details, 600) || null;
    const preferredWindow = sanitizeString(data.preferred_time_window, 120) || null;
    const howHeard = sanitizeString(data.how_heard, 160) || null;
    const requestedService = sanitizeString(data.service_type, 60) || "portrait_general";
    const source = sanitizeString(data.source, 120) || "direct";
    const referralFromInput = sanitizeString(data.referral_from, 160);
    const referralFrom = referralFromInput || (source.startsWith("referral_") ? source : "") || null;
    const status = selectStatus(sanitizeString(data.status, 32));

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    if (!email || !validEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const requiresPhone = Boolean(data.service_type || data.session_type || data.full_name);
    if (requiresPhone && !phone) {
      return NextResponse.json({ error: "Phone number is required for portrait bookings." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data: inserted, error } = await supabase
      .from("portrait_inquiries")
      .insert({
        full_name: fullName,
        email,
        phone: phone || null,
        school,
        session_type: sessionType,
        preferred_dates: preferredDates,
        preferred_time_window: preferredWindow,
        how_heard: howHeard,
        service_type: requestedService || "portrait_general",
        source,
        status,
        referral_from: referralFrom,
      })
      .select("id")
      .single();

    if (error || !inserted) {
      console.error("Supabase insert error", error);
      return NextResponse.json({ error: "Could not save inquiry." }, { status: 500 });
    }

    postToSlack(
      `New portrait inquiry` +
        `\nName: ${fullName}` +
        `\nEmail: ${email}` +
        (phone ? `\nPhone: ${phone}` : "") +
        (school ? `\nSchool/Org: ${school}` : "") +
        `\nService: ${requestedService}` +
        `\nSource: ${source}` +
        (sessionType ? `\nSession type: ${sessionType}` : "") +
        (preferredDates ? `\nDates: ${preferredDates}` : "") +
        (referralFrom ? `\nReferral: ${referralFrom}` : "")
    );

    return NextResponse.json({ success: true, id: inserted.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
