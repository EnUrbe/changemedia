import { getGradContent } from "@/lib/gradStore";
import GradPageForm from "@/components/admin/GradPageForm";

export const dynamic = "force-dynamic";

export default async function GradAdminPage() {
  const content = await getGradContent();

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-4 py-10 text-neutral-900">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">Admin</p>
          <h1 className="text-4xl font-serif">
            Graduation Page Content
          </h1>
          <p className="text-sm text-neutral-600">
            Edit the packages, add-ons, horizontal scroll strip gallery, and standard portfolio gallery.
          </p>
        </header>

        <GradPageForm initialContent={content} />
      </div>
    </main>
  );
}
