import type { Metadata } from "next";
import { getPhotographyContent } from "@/lib/photographyStore";
import PhotographyExperience from "@/components/clients/PhotographyExperience";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPhotographyContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      images: [{ url: content.seo.ogImage }],
    },
  };
}

export default async function PhotographyPage() {
  const content = await getPhotographyContent();
  return <PhotographyExperience content={content} />;
}
