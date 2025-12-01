import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

type MercuryWebhookPayload = {
  id?: string;
  type?: string;
  event?: string;
  status?: string;
  payment_id?: string;
  data?: {
    id?: string;
    status?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

function isDepositPaid(payload: MercuryWebhookPayload) {
  const eventType = payload.type || payload.event;
  const status = payload.data?.status || payload.status;
  return eventType === "payment.completed" || eventType === "invoice.payment_succeeded" || status === "succeeded";
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
  let payload: MercuryWebhookPayload;
    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      console.error("Invalid webhook JSON", error);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const signature = request.headers.get("x-mercury-signature") || request.headers.get("mercury-signature");
    if (!signature) {
      console.warn("Missing Mercury signature header");
      // TODO: validate signature once spec is available.
    }

    const paymentId: string | undefined = payload.data?.id || payload.payment_id || payload.id;
    if (!paymentId) {
      console.warn("Webhook missing payment id", payload);
      return NextResponse.json({ error: "Missing payment id" }, { status: 400 });
    }

    if (!isDepositPaid(payload)) {
      return NextResponse.json({ received: true, ignored: true });
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("portrait_inquiries")
      .update({
        status: "DEPOSIT_PAID",
        updated_at: new Date().toISOString(),
      })
      .eq("mercury_payment_id", paymentId);

    if (error) {
      console.error("Failed to update inquiry from webhook", error);
      return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Mercury webhook error", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
