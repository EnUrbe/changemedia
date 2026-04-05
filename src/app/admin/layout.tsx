import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  
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
      {user && <AdminNav userEmail={user.email || ""} />}
      {children}
    </div>
  );
}
