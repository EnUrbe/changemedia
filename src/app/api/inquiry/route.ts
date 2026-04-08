import { NextResponse } from "next/server";
import { getSupabaseAdminClient, type PortraitInquiryStatus } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

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

function buildInquiryNotes(parts: Array<string | null>) {
  return parts.filter(Boolean).join("\n").slice(0, 600) || null;
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
    const organization = sanitizeString(data.organization ?? data.school ?? data.org, 160) || null;
    const sessionType = sanitizeString(data.session_type, 60) || null;
    const location = sanitizeString(data.location, 160) || null;
    const timeline = sanitizeString(data.timeline, 120) || null;
    const budgetRange = sanitizeString(data.budget_range, 120) || null;
    const message = sanitizeString(data.message, 1200) || null;
    const preferredDates =
      sanitizeString(data.preferred_dates ?? data.details, 600) ||
      buildInquiryNotes([
        message,
        location ? `Location: ${location}` : null,
        timeline ? `Timeline: ${timeline}` : null,
        budgetRange ? `Budget: ${budgetRange}` : null,
      ]);
    const preferredWindow =
      sanitizeString(data.preferred_time_window, 120) ||
      [timeline, budgetRange].filter(Boolean).join(" · ").slice(0, 120) ||
      null;
    const howHeard = sanitizeString(data.how_heard, 160) || null;
    const requestedService =
      sanitizeString(data.service_type ?? data.service, 60) || "general_inquiry";
    const source = sanitizeString(data.source, 120) || "website_contact";
    const referralFromInput = sanitizeString(data.referral_from, 160);
    const referralFrom = referralFromInput || (source.startsWith("referral_") ? source : "") || null;
    const status = selectStatus(sanitizeString(data.status, 32));

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    if (!email || !validEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const requiresPhone = [
      "grad_portraits",
      "branding",
      "portrait_general",
      "family",
      "couples",
      "org",
    ].includes(requestedService);
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
        school: organization,
        session_type: sessionType,
        preferred_dates: preferredDates,
        preferred_time_window: preferredWindow,
        how_heard: howHeard,
        service_type: requestedService || "general_inquiry",
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
      `New website inquiry` +
        `\nName: ${fullName}` +
        `\nEmail: ${email}` +
        (phone ? `\nPhone: ${phone}` : "") +
        (organization ? `\nOrganization: ${organization}` : "") +
        `\nService: ${requestedService}` +
        `\nSource: ${source}` +
        (sessionType ? `\nSession type: ${sessionType}` : "") +
        (location ? `\nLocation: ${location}` : "") +
        (timeline ? `\nTimeline: ${timeline}` : "") +
        (budgetRange ? `\nBudget: ${budgetRange}` : "") +
        (howHeard ? `\nHow heard: ${howHeard}` : "") +
        (preferredDates ? `\nDetails: ${preferredDates}` : "") +
        (referralFrom ? `\nReferral: ${referralFrom}` : "")
    );

    const isGrad = requestedService === "grad_portraits";

    // Send both emails and wait for them before returning — fire-and-forget
    // causes Vercel to terminate the function before Resend receives the request.
    const notifyEmail = process.env.NOTIFY_EMAIL;
    await Promise.allSettled([
      sendEmail({
        to: email,
        subject: isGrad
          ? "Your grad session inquiry — Change Media Studio"
          : "Got your inquiry — Change Media Studio",
        text: isGrad
          ? buildGradClientEmail(fullName, sessionType)
          : buildGenericClientEmail(fullName),
        html: isGrad
          ? buildGradClientEmailHtml(fullName, sessionType)
          : buildGenericClientEmailHtml(fullName),
      }),
      notifyEmail
        ? sendEmail({
            to: notifyEmail,
            subject: `New ${isGrad ? "grad" : ""} inquiry: ${fullName}`,
            text: [
              `Name: ${fullName}`,
              `Email: ${email}`,
              phone ? `Phone: ${phone}` : null,
              organization ? `School/Org: ${organization}` : null,
              sessionType ? `Package: ${sessionType}` : null,
              timeline ? `Graduation: ${timeline}` : null,
              preferredDates ? `Details: ${preferredDates}` : null,
              `Source: ${source}`,
            ]
              .filter(Boolean)
              .join("\n"),
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ success: true, id: inserted.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

function buildGradClientEmail(name: string, packageName: string | null): string {
  const firstName = name.split(" ")[0];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://changemedia.studio";
  const bookingUrl = `${siteUrl}/book`;
  return [
    `Hey ${firstName},`,
    "",
    "Thanks for reaching out — I got your grad session inquiry and I'm excited to work with you.",
    "",
    packageName ? `You mentioned you're interested in the ${packageName} experience. Great choice.` : "",
    "",
    "Here's what happens next:",
    "",
    "1. Lock in your date — grab a time slot that works for you:",
    `   ${bookingUrl}`,
    "2. A signed contract + retainer secures your spot on my calendar.",
    "3. We'll connect beforehand to plan locations, outfits, and the vibe.",
    "",
    "In the meantime, if you have any questions, just reply to this email.",
    "",
    "Talk soon,",
    "William",
    "Change Media Studio",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

function buildGradClientEmailHtml(name: string, packageName: string | null): string {
  const firstName = name.split(" ")[0];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://changemedia.studio";
  const bookingUrl = `${siteUrl}/grad#inquire`;
  const unsubscribeUrl = `mailto:william.navarretemoreno@changemedia.studio?subject=Unsubscribe&body=Please remove me from your list.`;
  const heroImage = "https://c_cmlh427bmd6dq3e9v3ovobdktb8oaudah5_gezqwy.canva-cdn.email/208dd5669fd053fb8d94d246cbb5ce75.jpg";
  const packageLine = packageName
    ? `<tr><td dir="ltr" style="color:#0b1e1c;font-size:14.6667px;font-family:Helvetica,Arial,sans-serif;text-align:center;padding:0px 20px 16px">You mentioned you&rsquo;re interested in <strong>${packageName}</strong> &mdash; great choice.</td></tr>`
    : "";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta name="x-apple-disable-message-reformatting">
</head>
<body style="width:100%;-webkit-text-size-adjust:100%;text-size-adjust:100%;background-color:#f0f1f5;margin:0;padding:0">
<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f0f1f5">
  <tbody><tr><td style="background-color:#f0f1f5">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;min-height:600px;margin:0 auto;background-color:#ffffff">
      <tbody>
        <!-- HERO IMAGE -->
        <tr><td style="vertical-align:top">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%"><tbody><tr><td align="center">
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px"><tbody><tr>
              <td style="width:100%;padding:0">
                <img src="${heroImage}" width="600" height="627" style="display:block;width:100%;height:auto;max-width:100%" alt="Change Media Studio Grad Portraits">
              </td>
            </tr></tbody></table>
          </td></tr></tbody></table>
        </td></tr>

        <!-- BODY -->
        <tr><td style="vertical-align:top;padding:0">
          <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0">
            <tbody><tr><td style="padding:24px 0 10px 0;vertical-align:top">
              <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse">
                <tbody>
                  <tr><td dir="ltr" style="color:#0b1e1c;font-size:14.6667px;font-family:Helvetica,Arial,sans-serif;text-align:center;padding:0px 20px 8px">
                    Hey ${firstName} &mdash; got your inquiry and I&rsquo;m excited to work with you.
                  </td></tr>
                  ${packageLine}
                  <tr><td dir="ltr" style="color:#0b1e1c;font-size:14.6667px;font-family:Helvetica,Arial,sans-serif;text-align:center;padding:0px 20px 16px">
                    As promised, here&rsquo;s the full pricing guide with packages, available dates, and everything you need. Reply to this email with any questions &mdash; I&rsquo;ll get back to you same day.
                  </td></tr>
                  <tr><td style="font-size:0;height:8px" height="8">&nbsp;</td></tr>

                  <!-- CTA BUTTON: PRICING GUIDE -->
                  <tr><td style="padding:0px 20px"><table cellpadding="0" cellspacing="0" border="0" style="width:100%"><tbody><tr><td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:230px"><tbody><tr><td style="width:100%;padding:20px 0 8px">
                      <table cellpadding="0" cellspacing="0" style="width:100%;border-spacing:0;border-collapse:separate"><tbody><tr>
                        <td valign="middle" height="41" style="height:41px;vertical-align:middle;box-sizing:border-box;background-color:#378d90">
                          <a href="https://canva.link/j4wkc4mx7makl0d" target="_blank" rel="noopener" style="text-decoration:none;display:block">
                            <table cellpadding="0" cellspacing="0" style="width:100%;height:100%;border-spacing:0;border-collapse:collapse"><tbody><tr>
                              <td style="color:#ffffff;font-size:17px;font-weight:bold;font-family:Helvetica,Arial,sans-serif;text-align:center;line-height:1.1em;letter-spacing:-0.02em;vertical-align:middle;box-sizing:border-box">
                                Read the full guide
                              </td>
                            </tr></tbody></table>
                          </a>
                        </td>
                      </tr></tbody></table>
                    </td></tr></tbody></table>
                  </td></tr></tbody></table></td></tr>

                  <!-- SECONDARY: BOOK LINK -->
                  <tr><td style="text-align:center;padding:0 20px 8px">
                    <a href="${bookingUrl}" target="_blank" rel="noopener" style="color:#378d90;font-size:13px;font-family:Helvetica,Arial,sans-serif;text-decoration:underline">
                      Or book your session directly &rarr;
                    </a>
                  </td></tr>

                  <tr><td style="font-size:0;height:16px" height="16">&nbsp;</td></tr>

                  <!-- CONTACT -->
                  <tr><td dir="ltr" style="color:#0b1e1c;font-size:16px;font-family:Helvetica,Arial,sans-serif;line-height:1;text-align:center;padding:0px 20px">
                    <span style="font-weight:700;text-decoration:underline;letter-spacing:-0.01em">Contact me</span><br><br>
                    <a href="mailto:william.navarretemoreno@changemedia.studio" style="color:#0b1e1c;text-decoration:none;font-size:14.6667px">william.navarretemoreno@changemedia.studio</a>
                  </td></tr>
                  <tr><td style="font-size:0;height:8px" height="8">&nbsp;</td></tr>
                  <tr><td dir="ltr" style="color:#0b1e1c;font-size:13.3px;font-family:Helvetica,Arial,sans-serif;line-height:1;text-align:center;padding:0px 20px">
                    <a href="tel:7196638145" style="color:#0b1e1c;text-decoration:none">719-663-8145</a>
                  </td></tr>
                  <tr><td style="font-size:0;height:24px" height="24">&nbsp;</td></tr>
                </tbody>
              </table>
            </td></tr></tbody>
          </table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="vertical-align:top">
          <table border="0" cellpadding="0" cellspacing="0" align="center" style="width:100%;background-color:#0b1e1c">
            <tbody><tr><td style="text-align:center;padding:16px 20px">
              <table border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:526px;margin:0 auto">
                <tbody><tr><td style="padding:13px">
                  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse">
                    <tbody>
                      <tr><td dir="ltr" style="color:#ffffff;font-size:12px;line-height:1.14;text-align:center;white-space:pre-wrap">
                        &copy; 2026 Change Studios. All rights reserved.<br>
                        You received this because you submitted an inquiry at changemedia.studio.
                      </td></tr>
                      <tr><td style="font-size:0;height:12px" height="12">&nbsp;</td></tr>
                      <tr><td dir="ltr" style="color:#ffffff;font-size:12px;line-height:1.14;text-align:center">
                        <a href="${unsubscribeUrl}" target="_blank" rel="noopener nofollow" style="color:#ffffff;text-decoration:underline">Unsubscribe</a>
                        <span style="color:#ffffff"> &nbsp;|&nbsp; </span>
                        <a href="${siteUrl}" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:underline">Visit our site</a>
                      </td></tr>
                    </tbody>
                  </table>
                </td></tr></tbody>
              </table>
            </td></tr></tbody>
          </table>
        </td></tr>

      </tbody>
    </table>
  </td></tr></tbody>
</table>
</body></html>`;
}

function buildGenericClientEmail(name: string): string {
  const firstName = name.split(" ")[0];
  return [
    `Hey ${firstName},`,
    "",
    "Got your inquiry — thanks for reaching out to Change Media Studio.",
    "",
    "I'll be in touch within 24 hours with more details.",
    "",
    "Talk soon,",
    "William",
    "Change Media Studio",
  ].join("\n");
}

function buildGenericClientEmailHtml(name: string): string {
  const firstName = name.split(" ")[0];
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:sans-serif;color:#111;max-width:560px;margin:0 auto;padding:32px 16px;line-height:1.6">
  <p style="margin:0 0 16px">Hey ${firstName},</p>
  <p style="margin:0 0 16px">Got your inquiry — thanks for reaching out to Change Media Studio.</p>
  <p style="margin:0 0 16px">I'll be in touch within 24 hours with more details.</p>
  <p style="margin:0">Talk soon,<br /><strong>William</strong><br />Change Media Studio</p>
</body>
</html>`;
}
