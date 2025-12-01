"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfToday } from "date-fns";
import Button from "@/components/ui/Button";
import { getAvailableSlots, submitBooking } from "./actions";

const SERVICES = [
  { id: "consultation", label: "Discovery Call", duration: "30 min", description: "Let's discuss your vision and how we can help." },
  { id: "portrait", label: "Portrait Session", duration: "1 hour", description: "Professional studio or location photography." },
  { id: "podcast", label: "Podcast Recording", duration: "1 hour", description: "High-quality audio recording in our studio." },
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [icsContent, setIcsContent] = useState<string | null>(null);

  // Generate next 14 days
  const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  useEffect(() => {
    if (date) {
      setLoading(true);
      getAvailableSlots(date.toISOString()).then((s) => {
        setSlots(s);
        setLoading(false);
      });
    }
  }, [date]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await submitBooking(formData);
    setLoading(false);
    
    if ('error' in result) {
      alert(result.error);
      return;
    }

    if (result.success) {
      setStep(5);
      if (result.ics) setIcsContent(result.ics);
    }
  }

  const downloadIcs = () => {
    if (!icsContent) return;
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "meeting.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen w-full bg-[#050505] p-4 text-white md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-[#5c7cfa]/20 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] h-[600px] w-[600px] rounded-full bg-[#5c7cfa]/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-[400px] w-[400px] rounded-full bg-white/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif tracking-tight text-white drop-shadow-sm">
            Schedule a Session
          </h1>
          <p className="mt-2 text-white/60">Book time with the CHANGE Media team.</p>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          
          <div className="relative z-10">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-white">Select Service</h2>
                <div className="grid gap-4">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setService(s.id); setStep(2); }}
                      className="group/btn flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 p-5 text-left transition-all hover:bg-black/40 hover:border-[#5c7cfa]/50 hover:scale-[1.01]"
                    >
                      <div>
                        <span className="block font-medium text-white group-hover/btn:text-[#5c7cfa] transition-colors">{s.label}</span>
                        <span className="text-sm text-white/40">{s.description}</span>
                      </div>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/60 border border-white/5">
                        {s.duration}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium text-white">Select Date</h2>
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    Back
                  </button>
                </div>
                
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
                  {days.map((d) => (
                    <button
                      key={d.toISOString()}
                      onClick={() => setDate(d)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 text-sm transition-all ${
                        date?.toDateString() === d.toDateString()
                          ? "border-[#5c7cfa] bg-[#5c7cfa] text-white shadow-[0_0_20px_-5px_rgba(92,124,250,0.5)]"
                          : "border-white/5 bg-black/20 text-white/40 hover:bg-black/40 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span className="text-xs opacity-60 uppercase tracking-wider">{format(d, "EEE")}</span>
                      <span className="text-lg font-bold">{format(d, "d")}</span>
                    </button>
                  ))}
                </div>

                {date && (
                  <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="mb-4 text-sm font-medium text-white/60">Available Times ({format(date, "MMM d")})</h3>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#5c7cfa] border-t-transparent" />
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-center">
                        <p className="text-sm text-white/40">No slots available for this date.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {slots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => { setSelectedSlot(slot); setStep(3); }}
                            className="rounded-lg border border-white/10 bg-black/20 py-2.5 text-sm text-white/80 transition-all hover:bg-[#5c7cfa]/20 hover:border-[#5c7cfa]/50 hover:text-white hover:shadow-[0_0_15px_-5px_rgba(92,124,250,0.3)]"
                          >
                            {format(new Date(slot), "h:mm a")}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <form action={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium text-white">Your Details</h2>
                  <button type="button" onClick={() => setStep(2)} className="text-sm text-white/40 hover:text-white transition-colors">Back</button>
                </div>
                
                <div className="rounded-xl border border-white/10 bg-[#5c7cfa]/10 p-5 text-sm text-white/80">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-2 w-2 rounded-full bg-[#5c7cfa] shadow-[0_0_8px_rgba(92,124,250,0.8)]" />
                    <p><span className="font-semibold text-white">Service:</span> {SERVICES.find(s => s.id === service)?.label}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    <p><span className="font-semibold text-white">Time:</span> {format(new Date(selectedSlot), "MMMM d, yyyy 'at' h:mm a")}</p>
                  </div>
                </div>

                <input type="hidden" name="serviceType" value={service} />
                <input type="hidden" name="startTime" value={selectedSlot} />

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60">Full Name *</label>
                      <input 
                        name="clientName" 
                        required 
                        placeholder="Jane Doe"
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/20 backdrop-blur-sm transition-all focus:border-[#5c7cfa]/50 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60">Email Address *</label>
                      <input 
                        name="clientEmail" 
                        type="email" 
                        required 
                        placeholder="jane@company.com"
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/20 backdrop-blur-sm transition-all focus:border-[#5c7cfa]/50 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60">Organization / Company</label>
                      <input 
                        name="organization" 
                        placeholder="Acme Inc."
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/20 backdrop-blur-sm transition-all focus:border-[#5c7cfa]/50 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60">Role / Title</label>
                      <input 
                        name="role" 
                        placeholder="Founder, Director, etc."
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/20 backdrop-blur-sm transition-all focus:border-[#5c7cfa]/50 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60">Website URL</label>
                      <input 
                        name="website" 
                        type="url"
                        placeholder="https://..."
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/20 backdrop-blur-sm transition-all focus:border-[#5c7cfa]/50 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60">Social Media (LinkedIn/IG)</label>
                      <input 
                        name="social" 
                        placeholder="@username"
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/20 backdrop-blur-sm transition-all focus:border-[#5c7cfa]/50 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/60">What are you looking to achieve?</label>
                    <textarea 
                      name="goals" 
                      placeholder="Tell us about your vision, goals, or specific requirements..."
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/20 backdrop-blur-sm transition-all focus:border-[#5c7cfa]/50 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]/20" 
                      rows={3} 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/60">Additional Notes</label>
                    <textarea 
                      name="notes" 
                      placeholder="Any other details we should know?"
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/20 backdrop-blur-sm transition-all focus:border-[#5c7cfa]/50 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa]/20" 
                      rows={2} 
                    />
                  </div>
                </div>

                <Button fullWidth disabled={loading} className="bg-white text-[#0f172a] hover:bg-neutral-200">
                  {loading ? "Confirming..." : "Confirm Booking"}
                </Button>
              </form>
            )}

            {step === 5 && (
              <div className="text-center py-8">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-400 shadow-[0_0_30px_-5px_rgba(74,222,128,0.2)] border border-green-500/20">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-serif text-white mb-2">Booking Confirmed!</h2>
                <p className="text-white/60 mb-8">We have sent a confirmation to your email.</p>
                
                {icsContent && (
                  <div className="space-y-4">
                    <Button onClick={downloadIcs} variant="ghost" className="border-white/20 hover:bg-white/10">
                      Add to Calendar
                    </Button>
                    <p className="text-xs text-white/40">
                      Works with Google, Apple, and Outlook
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
