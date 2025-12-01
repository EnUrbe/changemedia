import { getCalendarFeeds } from "@/lib/calendarStore";
import PasswordForm from "@/components/admin/PasswordForm";
import CalendarFeeds from "@/components/admin/CalendarFeeds";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const feeds = await getCalendarFeeds();

  return (
    <main className="min-h-screen w-full bg-[#050505] p-8 text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="relative mx-auto max-w-3xl space-y-12 pt-10">
        <header className="space-y-2 text-center">
          <h1 className="text-4xl font-serif tracking-tight text-white drop-shadow-sm">
            Studio Settings
          </h1>
          <p className="text-white/60">Manage your digital presence and security.</p>
        </header>

        <div className="grid gap-8">
          <CalendarFeeds feeds={feeds} />
          <PasswordForm />
        </div>
      </div>
    </main>
  );
}
