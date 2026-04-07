import { NextRequest, NextResponse } from "next/server";
import { saveGradContent } from "@/lib/gradStore";
import { gradContentSchema } from "@/lib/gradSchema";
import { ADMIN_SESSION_COOKIE, isHardcodedAdminSession } from "@/lib/adminHardcodedAuth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value || req.cookies.get('sb-auth-token')?.value || req.cookies.get('supabase-auth-token')?.value;
    const hardcodedToken = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const hasHardcodedAdminSession = isHardcodedAdminSession(hardcodedToken);
    
    // minimal check since they are likely logged in, but ensure it exists
    if (!token && !hasHardcodedAdminSession && process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = gradContentSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

    await saveGradContent(result.data);
    return NextResponse.json({ success: true, data: result.data });
  } catch (err: unknown) {
    console.error("Failed to save grad content:", err);
    return NextResponse.json(
      {
        error: "Failed to save content",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
