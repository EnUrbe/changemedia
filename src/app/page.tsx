import type { Metadata } from "next";
import ChangeMediaLanding from "@/components/ChangeMediaLanding";
import { getContent } from "@/lib/contentStore";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      images: [
        {
          url: content.seo.ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.title,
      description: content.seo.description,
      images: [content.seo.ogImage],
    },
  };
}

export default async function Page() {
  const content = await getContent();
  return <ChangeMediaLanding content={content} />;
}

