import { NextRequest, NextResponse } from "next/server";
import { savePhotographyContent } from "@/lib/photographyStore";
import { photographyContentSchema } from "@/lib/photographySchema";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value || req.cookies.get('sb-auth-token')?.value || req.cookies.get('supabase-auth-token')?.value;
    
    if (!token && process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = photographyContentSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

    await savePhotographyContent(result.data, "admin");
    return NextResponse.json({ success: true, data: result.data });
  } catch (err: unknown) {
    console.error("Failed to save photography content:", err);
    return NextResponse.json(
      {
        error: "Failed to save content",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
