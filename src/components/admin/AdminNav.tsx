"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminSignOut from "@/components/admin/AdminSignOut";

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  const links = [
    { name: "Projects", path: "/admin/projects" },
    { name: "Marketing", path: "/admin/marketing" },
    { name: "Calendar", path: "/admin/calendar" },
    { name: "Landing", path: "/admin/landing" },
    { name: "Photography", path: "/admin/photography" },
    { name: "Grad", path: "/admin/grad" },
    { name: "Studios", path: "/admin/change-studios" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--bg-elevated)] sticky top-0 z-50 shadow-2xl safe-area-pt">
      <div className="mx-auto flex max-w-[1500px] flex-col lg:flex-row lg:items-center justify-between px-6 py-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center w-full">
          
          <div className="flex items-center justify-between lg:mr-8 mb-4 lg:mb-0">
            <Link href="/admin/projects" className="font-serif text-xl tracking-tight text-white flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
              Admin
            </Link>
            <div className="flex lg:hidden items-center gap-4">
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 text-[var(--text-dim)] tracking-wide border border-white/5">
                {userEmail}
              </span>
              <AdminSignOut />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 pb-1 lg:pb-0 w-full lg:w-auto mask-fade-edges-x">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive 
                      ? "bg-[var(--accent)]/10 text-[var(--accent)] shadow-inner border border-[var(--accent)]/30" 
                      : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 shrink-0 pl-6">
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 text-[var(--text-dim)] tracking-wide border border-white/5">
            {userEmail}
          </span>
          <AdminSignOut />
        </div>

      </div>
    </nav>
  );
}
