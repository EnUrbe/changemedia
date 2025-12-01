import { getAllUpcomingBookings } from "@/lib/bookingStore";
import { format, parseISO } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const bookings = await getAllUpcomingBookings();

  return (
    <main className="min-h-screen w-full bg-[#050505] p-8 text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="relative mx-auto max-w-5xl space-y-12 pt-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif tracking-tight text-white drop-shadow-sm">
              Studio Calendar
            </h1>
            <p className="text-white/60">Upcoming sessions and events.</p>
          </div>
          <div className="rounded-full bg-white/5 px-4 py-2 backdrop-blur-md border border-white/10">
            <span className="text-sm font-medium text-white/80">
              {bookings.length} Upcoming Sessions
            </span>
          </div>
        </header>

        <div className="grid gap-6">
          {bookings.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-center backdrop-blur-xl">
              <p className="text-lg font-medium text-white">No upcoming bookings</p>
              <p className="text-sm text-white/40">Share your booking link to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const start = parseISO(booking.startTime);
                return (
                  <div
                    key={booking.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:scale-[1.01]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    
                    <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-black/20 border border-white/10 backdrop-blur-sm">
                          <span className="text-xs font-bold uppercase text-white/60">
                            {format(start, "MMM")}
                          </span>
                          <span className="text-2xl font-bold text-white">
                            {format(start, "d")}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {booking.serviceType}
                          </h3>
                          <p className="text-white/60">
                            with {booking.clientName}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                            <span>{format(start, "h:mm a")}</span>
                            <span>•</span>
                            <span>{booking.clientEmail}</span>
                          </div>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="max-w-xs rounded-lg bg-black/20 p-3 text-xs text-white/60 border border-white/5">
                          "{booking.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
