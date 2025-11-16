import PortraitExperiencePortal from "@/components/clients/PortraitExperiencePortal";
import { getPhotographyContent } from "@/lib/photographyStore";

export default async function PortraitExperiencePage() {
  const content = await getPhotographyContent();
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <PortraitExperiencePortal content={content} />
    </main>
  );
}
