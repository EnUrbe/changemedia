import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { createPortraitDepositRequest } from "@/lib/mercuryClient";
import { SERVICE_DEPOSITS } from "@/lib/portraitServices";
import { sendEmail } from "@/lib/email";

function buildDepositEmailText(name: string, sessionType: string | null, paymentUrl: string, cents: number): string {
  const first = name.split(" ")[0];
  const dollars = cents / 100;
  return [
    `Hey ${first},`,
    "",
    "Your grad session is almost locked in — here's your deposit link to secure your spot:",
    "",
    `  ${paymentUrl}`,
    "",
    `Deposit amount: $${dollars}`,
    sessionType ? `Session: ${sessionType}` : "",
    "",
    "Once payment goes through, I'll send a contract and we'll start planning locations, outfits, and the vibe.",
    "",
    "Any questions? Just reply to this email.",
    "",
    "Talk soon,",
    "William",
    "Change Media Studio",
  ].filter(l => l !== undefined).join("\n");
}

function buildDepositEmailHtml(name: string, sessionType: string | null, paymentUrl: string, cents: number): string {
  const first = name.split(" ")[0];
  const dollars = cents / 100;
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="font-family:sans-serif;color:#111;max-width:560px;margin:0 auto;padding:32px 16px;line-height:1.6">
  <p style="margin:0 0 16px">Hey ${first},</p>
  <p style="margin:0 0 16px">Your grad session is almost locked in — here's your deposit link to secure your spot:</p>
  <p style="margin:0 0 20px">
    <a href="${paymentUrl}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
      Pay $${dollars} deposit &rarr;
    </a>
  </p>
  ${sessionType ? `<p style="margin:0 0 12px;color:#555;font-size:14px">Session: <strong>${sessionType}</strong></p>` : ""}
  <p style="margin:0 0 16px">Once payment goes through, I'll send a contract and we'll start planning locations, outfits, and the vibe.</p>
  <p style="margin:0 0 16px">Any questions? Just reply to this email.</p>
  <p style="margin:0">Talk soon,<br/><strong>William</strong><br/>Change Media Studio</p>
</body></html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const inquiryId = String((body as Record<string, unknown>).inquiryId || "").trim();
    const providedAmount = Number((body as Record<string, unknown>).amountCents);

    if (!inquiryId) {
      return NextResponse.json({ error: "inquiryId is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data: inquiry, error } = await supabase
      .from("portrait_inquiries")
      .select("id, full_name, email, service_type, session_type, mercury_payment_id")
      .eq("id", inquiryId)
      .single();

    if (error || !inquiry) {
      console.error("Inquiry lookup failed", error);
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    if (inquiry.mercury_payment_id) {
      return NextResponse.json({ error: "Payment already created for this inquiry." }, { status: 409 });
    }

    const serviceKey = inquiry.service_type || "portrait_general";
    const amountCents = Number.isFinite(providedAmount) && providedAmount > 0
      ? Math.round(providedAmount)
      : SERVICE_DEPOSITS[serviceKey] || 10000;

    const memo = `Deposit for ${serviceKey}${inquiry.session_type ? ` (${inquiry.session_type})` : ""}`;

    const payment = await createPortraitDepositRequest({
      inquiryId,
      amountCents,
      clientName: inquiry.full_name,
      clientEmail: inquiry.email,
      memo,
    });

    const { error: updateError } = await supabase
      .from("portrait_inquiries")
      .update({
        mercury_payment_id: payment.paymentId,
        status: "PAYMENT_PENDING",
        updated_at: new Date().toISOString(),
      })
      .eq("id", inquiryId);

    if (updateError) {
      console.error("Failed to persist payment metadata", updateError);
      return NextResponse.json({ error: "Failed to persist payment metadata" }, { status: 500 });
    }

    // Email the client their deposit link automatically
    sendEmail({
      to: inquiry.email,
      subject: "Your grad session deposit link — Change Media Studio",
      text: buildDepositEmailText(inquiry.full_name, inquiry.session_type, payment.paymentUrl, amountCents),
      html: buildDepositEmailHtml(inquiry.full_name, inquiry.session_type, payment.paymentUrl, amountCents),
    }).catch((err) => console.error("Deposit link email failed:", err));

    return NextResponse.json({ paymentUrl: payment.paymentUrl, amountCents });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
