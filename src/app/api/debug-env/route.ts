import { NextResponse } from "next/server";

export async function GET() {
  const vars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set (starts with " + process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 8) + ")" : "MISSING",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set (starts with " + process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 5) + ")" : "MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json(vars);
}
