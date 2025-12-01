import { getContent } from "@/lib/contentStore";
import ChangeStudiosForm from "@/components/admin/ChangeStudiosForm";

export const dynamic = "force-dynamic";

export default async function ChangeStudiosAdminPage() {
  const content = await getContent();

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">Admin</p>
          <h1 className="text-4xl font-serif">
            Change Studios Content
          </h1>
          <p className="text-sm text-white/60">Edit the content for the Change Studios subsite.</p>
        </header>
        
        <ChangeStudiosForm initialContent={content} />
      </div>
    </main>
  );
}
