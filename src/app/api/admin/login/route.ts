import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getHardcodedAdminSessionToken,
  isHardcodedAdminCredential,
} from "@/lib/adminHardcodedAuth";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginPayload | null;
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isHardcodedAdminCredential(email, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: getHardcodedAdminSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
