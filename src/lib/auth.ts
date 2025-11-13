import { NextRequest } from "next/server";

export function getRequestToken(request: NextRequest): string | undefined {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1]?.trim();
  }
  const cookieToken = request.cookies.get("cmsToken")?.value;
  if (cookieToken) return cookieToken;
  return undefined;
}

export function isAdminRequest(request: NextRequest): boolean {
  const token = getRequestToken(request);
  const adminToken = process.env.CMS_ADMIN_TOKEN;
  if (!adminToken) {
    console.warn("CMS_ADMIN_TOKEN is not set; denying admin routes by default.");
    return false;
  }
  return token === adminToken;
}
