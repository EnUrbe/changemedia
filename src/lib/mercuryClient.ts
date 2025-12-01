type DepositRequestParams = {
  inquiryId: string;
  amountCents: number;
  clientName: string;
  clientEmail: string;
  memo?: string;
};

export type DepositRequestResult = {
  paymentId: string;
  paymentUrl: string;
};

const MERCURY_API_BASE = process.env.MERCURY_API_URL || "https://api.mercury.com/api/v1";
const MERCURY_API_KEY = process.env.MERCURY_API_KEY;

function buildStubResult(params: DepositRequestParams): DepositRequestResult {
  const paymentId = `stub_${params.inquiryId}_${Date.now()}`;
  const paymentUrl = `https://app.mercury.com/payments/${paymentId}`;
  return { paymentId, paymentUrl };
}

export async function createPortraitDepositRequest(params: DepositRequestParams): Promise<DepositRequestResult> {
  if (!MERCURY_API_KEY) {
    console.warn("MERCURY_API_KEY missing. Returning stubbed deposit link.");
    return buildStubResult(params);
  }

  try {
    const response = await fetch(`${MERCURY_API_BASE}/simulated/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MERCURY_API_KEY}`,
        "X-Mercury-Idempotency-Key": `${params.inquiryId}-${Date.now()}`,
      },
      body: JSON.stringify({
        customer: {
          name: params.clientName,
          email: params.clientEmail,
        },
        amount: params.amountCents,
        memo: params.memo ?? `Portrait deposit for ${params.inquiryId}`,
        metadata: {
          inquiryId: params.inquiryId,
        },
        currency: "USD",
        method: "ach",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mercury API error", response.status, errorText);
      return buildStubResult(params);
    }

    const json = (await response.json().catch(() => null)) as
      | { id?: string; links?: { hosted_payment?: string }; payment_url?: string }
      | null;

    if (!json?.id) {
      console.warn("Mercury response missing id. Falling back to stub.");
      return buildStubResult(params);
    }

    const paymentUrl = json.payment_url || json.links?.hosted_payment || buildStubResult(params).paymentUrl;

    return { paymentId: json.id, paymentUrl };
  } catch (error) {
    console.error("Mercury request failed", error);
    return buildStubResult(params);
  }
}
