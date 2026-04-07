import { getGradContent } from "@/lib/gradStore";
import GradPageForm from "@/components/admin/GradPageForm";
import PortraitInquiriesDashboard, { type PortraitInquiry } from "@/components/admin/PortraitInquiriesDashboard";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { SERVICE_DEPOSITS } from "@/lib/portraitServices";

export const dynamic = "force-dynamic";

export default async function GradAdminPage() {
  const content = await getGradContent();

  let inquiries: PortraitInquiry[] = [];
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("portrait_inquiries")
      .select("id, full_name, email, phone, school, session_type, service_type, source, status, created_at, mercury_payment_id")
      .eq("service_type", "grad_portraits")
      .order("created_at", { ascending: false });

    if (!error) inquiries = (data as PortraitInquiry[]) || [];
  } catch (err) {
    console.error("Failed to load grad inquiries", err);
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-16">

        {/* Inquiries */}
        <section className="space-y-4">
          <header className="space-y-1">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Admin</p>
            <h1 className="text-4xl font-serif">Grad Inquiries</h1>
            <p className="text-sm text-white/60">All leads from the graduation page. Generate deposit links to close bookings.</p>
          </header>
          <PortraitInquiriesDashboard inquiries={inquiries} serviceDepositMap={SERVICE_DEPOSITS} />
        </section>

        {/* Page content editor */}
        <section className="space-y-4 border-t border-white/10 pt-16">
          <header className="space-y-1">
            <h2 className="text-2xl font-serif">Page Content</h2>
            <p className="text-sm text-white/60">Edit packages, add-ons, and gallery images shown on the grad page.</p>
          </header>
          <div className="rounded-2xl bg-[#f6f3ee] p-6 text-neutral-900">
            <GradPageForm initialContent={content} />
          </div>
        </section>

      </div>
    </main>
  );
}
