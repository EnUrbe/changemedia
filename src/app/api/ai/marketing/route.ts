import { NextRequest, NextResponse } from "next/server";
import { generateMarketingContent } from "@/lib/aiAssistant";

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, tone } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await generateMarketingContent(topic, platform, tone || "Professional");

    return NextResponse.json(result);
  } catch (error) {
    console.error("Marketing API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
