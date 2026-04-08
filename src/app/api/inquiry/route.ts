import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";
import { postToSlack, formatSlackMessage } from "@/lib/slack";
import { inquirySchema, isValidEmail, requiresPhone } from "@/lib/inquirySchema";
import {
  buildGradClientEmail,
  buildGenericClientEmail,
} from "@/lib/inquiryEmails";

// ---------------------------------------------------------------------------
// Anti-spam thresholds
// ---------------------------------------------------------------------------
const MIN_SUBMIT_MS = 1_500;
const MAX_SUBMIT_MS = 2 * 24 * 60 * 60 * 1_000; // 2 days

/** Minimal plain-text fallback for email clients that can't render HTML. */
function textFallback(name: string, isGrad: boolean): string {
  const first = name.split(" ")[0] || name;
  return isGrad
    ? `Hey ${first}, thanks for your grad session inquiry! Check your email for full details. — William, Change Media Studio`
    : `Hey ${first}, got your inquiry — thanks for reaching out. I'll be in touch within 24 hours. — William, Change Media Studio`;
}

// ---------------------------------------------------------------------------
// POST /api/inquiry
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    // ── Rate limit ──────────────────────────────────────────────────────
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again soon." },
        { status: 429 },
      );
    }

    // ── Parse body ──────────────────────────────────────────────────────
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // ── Validate + transform ────────────────────────────────────────────
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission data.", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const data = parsed.data;

    // ── Honeypot ────────────────────────────────────────────────────────
    if (data.hp) {
      return NextResponse.json({ success: true }); // silent discard
    }

    // ── Timing check ────────────────────────────────────────────────────
    if (data.ts != null) {
      const delta = Date.now() - data.ts;
      if (delta < MIN_SUBMIT_MS) return NextResponse.json({ success: true });
      if (delta > MAX_SUBMIT_MS) {
        return NextResponse.json({ error: "Submission expired." }, { status: 400 });
      }
    }

    // ── Field-level validation ──────────────────────────────────────────
    if (!data.fullName) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    if (!data.email || !isValidEmail(data.email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (requiresPhone(data.requestedService) && !data.phone) {
      return NextResponse.json(
        { error: "Phone number is required for portrait bookings." },
        { status: 400 },
      );
    }

    // ── Persist to Supabase ─────────────────────────────────────────────
    const supabase = getSupabaseAdminClient();
    const { data: inserted, error: dbError } = await supabase
      .from("portrait_inquiries")
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone ?? null,
        school: data.organization ?? null,
        session_type: data.sessionType ?? null,
        preferred_dates: data.preferredDates ?? null,
        preferred_time_window: data.preferredWindow ?? null,
        how_heard: data.howHeard ?? null,
        service_type: data.requestedService,
        source: data.source,
        status: data.status,
        referral_from: data.referralFrom ?? null,
      })
      .select("id")
      .single();

    if (dbError || !inserted) {
      console.error("Supabase insert error", dbError);
      return NextResponse.json({ error: "Could not save inquiry." }, { status: 500 });
    }

    // ── Notify Slack (fire-and-forget — non-critical) ───────────────────
    const slackMsg = formatSlackMessage("New website inquiry", {
      Name: data.fullName,
      Email: data.email,
      Phone: data.phone,
      Organization: data.organization,
      Service: data.requestedService,
      Source: data.source,
      "Session type": data.sessionType,
      Location: data.location,
      Timeline: data.timeline,
      Budget: data.budgetRange,
      "How heard": data.howHeard,
      Details: data.preferredDates,
      Referral: data.referralFrom,
    });
    // Don't await — Slack shouldn't block the response
    void postToSlack(slackMsg);

    // ── Send confirmation emails (must complete before Vercel kills fn) ─
    const isGrad = data.requestedService === "grad_portraits";
    const notifyEmail = process.env.NOTIFY_EMAIL;

    await Promise.allSettled([
      sendEmail({
        to: data.email,
        subject: isGrad
          ? "Your grad session inquiry — Change Media Studio"
          : "Got your inquiry — Change Media Studio",
        text: textFallback(data.fullName, isGrad),
        html: isGrad
          ? buildGradClientEmail(data.fullName, data.sessionType ?? null)
          : buildGenericClientEmail(data.fullName),
      }),
      notifyEmail
        ? sendEmail({
            to: notifyEmail,
            subject: `New ${isGrad ? "grad " : ""}inquiry: ${data.fullName}`,
            text: [
              `Name: ${data.fullName}`,
              `Email: ${data.email}`,
              data.phone ? `Phone: ${data.phone}` : null,
              data.organization ? `School/Org: ${data.organization}` : null,
              data.sessionType ? `Package: ${data.sessionType}` : null,
              data.timeline ? `Graduation: ${data.timeline}` : null,
              data.preferredDates ? `Details: ${data.preferredDates}` : null,
              `Source: ${data.source}`,
            ]
              .filter(Boolean)
              .join("\n"),
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ success: true, id: inserted.id });
  } catch (err) {
    console.error("Inquiry POST error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
