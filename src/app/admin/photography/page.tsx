import { getPhotographyContent } from "@/lib/photographyStore";
import PhotographyPageForm from "@/components/admin/PhotographyPageForm";

export const dynamic = "force-dynamic";

export default async function PhotographyAdminPage() {
  const content = await getPhotographyContent();

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-4 py-10 text-neutral-900">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">Admin</p>
          <h1 className="text-4xl font-serif">
            Photography Practice
          </h1>
          <p className="text-sm text-neutral-600">
            Edit the commercial photography portfolio, retainers, and services.
          </p>
        </header>

        <PhotographyPageForm initialContent={content} />
      </div>
    </main>
  );
}