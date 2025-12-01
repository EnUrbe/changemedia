import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { createPortraitDepositRequest } from "@/lib/mercuryClient";
import { SERVICE_DEPOSITS } from "@/lib/portraitServices";

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

    return NextResponse.json({ paymentUrl: payment.paymentUrl, amountCents });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
