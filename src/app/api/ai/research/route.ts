import { NextRequest, NextResponse } from "next/server";
import { researchAndGenerateSequence } from "@/lib/aiAssistant";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // Basic URL validation
    let targetUrl = url;
    if (!url.startsWith("http")) {
      targetUrl = `https://${url}`;
    }

    const result = await researchAndGenerateSequence(targetUrl);

    if (!result) {
      return NextResponse.json({ error: "Failed to analyze site" }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Research API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
