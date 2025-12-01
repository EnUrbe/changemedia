import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AdminSignOut from "@/components/admin/AdminSignOut";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {user && (
        <nav className="border-b border-white/10 bg-[#050505] px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin/projects" className="font-semibold text-white">
                Change Media Admin
              </Link>
              <div className="flex gap-4 text-sm text-white/60">
                <Link href="/admin/projects" className="hover:text-white transition-colors">Projects</Link>
                <Link href="/admin/marketing" className="hover:text-white transition-colors">Marketing</Link>
                <Link href="/admin/calendar" className="hover:text-white transition-colors">Calendar</Link>
                <Link href="/admin/landing" className="hover:text-white transition-colors">Landing Page</Link>
                <Link href="/admin/change-studios" className="hover:text-white transition-colors">Change Studios</Link>
                <Link href="/admin/settings" className="hover:text-white transition-colors">Settings</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/40">{user.email}</span>
              <AdminSignOut />
            </div>
          </div>
        </nav>
      )}
      {children}
    </div>
  );
}
