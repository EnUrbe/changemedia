import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  getHardcodedAdminEmail,
  isHardcodedAdminSession,
} from "@/lib/adminHardcodedAuth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  let hardcodedAdminEmail = "";

  const cookieStore = await cookies();
  const hardcodedSessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (isHardcodedAdminSession(hardcodedSessionToken)) {
    hardcodedAdminEmail = getHardcodedAdminEmail();
  }
  
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  } catch (error) {
    console.error("Admin layout auth error:", error);
    // Continue rendering without user - login page will still work
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {(user || hardcodedAdminEmail) && <AdminNav userEmail={user?.email || hardcodedAdminEmail} />}
      {children}
    </div>
  );
}
