import PortraitInquiriesDashboard, { type PortraitInquiry } from "@/components/admin/PortraitInquiriesDashboard";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { SERVICE_DEPOSITS } from "@/lib/portraitServices";

export const dynamic = "force-dynamic";

export default async function PortraitAdminPage() {
  let inquiries: PortraitInquiry[] = [];
  
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("portrait_inquiries")
      .select(
        "id, full_name, email, phone, school, session_type, service_type, source, status, created_at, mercury_payment_id"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load portrait inquiries", error);
    } else {
      inquiries = (data as PortraitInquiry[]) || [];
    }
  } catch (error) {
    console.error("Failed to initialize Supabase admin client:", error);
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Admin</p>
          <h1 className="text-4xl" style={{ fontFamily: "var(--font-family-serif, 'Instrument Serif', Georgia, serif)" }}>
            Portrait inquiries
          </h1>
          <p className="text-sm text-white/60">See leads, track referral sources, and generate Mercury deposit links.</p>
        </header>
        <PortraitInquiriesDashboard inquiries={inquiries} serviceDepositMap={SERVICE_DEPOSITS} />
      </div>
    </main>
  );
}
