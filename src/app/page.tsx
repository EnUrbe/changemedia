import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getContent } from "@/lib/contentStore";
import { SITE } from "@/lib/data";
import HomeClient from "./HomeClient";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getContent();
    return {
      title: content.seo.title,
      description: content.seo.description,
      alternates: { canonical: "/" },
      openGraph: {
        title: content.seo.title,
        description: content.seo.description,
        url: SITE.url,
        siteName: SITE.name,
        type: "website",
        images: [{ url: content.seo.ogImage }],
      },
      twitter: {
        card: "summary_large_image",
        title: content.seo.title,
        description: content.seo.description,
        images: [content.seo.ogImage],
      },
      keywords: [
        "documentary filmmaker",
        "brand videographer",
        "executive portraits",
        "team headshots",
        "content retainer video production",
        "nonprofit video production",
        "mission-driven brand content",
      ],
    };
  } catch {
    return {
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
    };
  }
}

export default async function Page() {
  const content = await getContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    description: content.seo.description,
    url: SITE.url,
    image: [content.seo.ogImage, ...content.featuredCases.slice(0, 3).map((item) => item.imageUrl)],
    email: SITE.email,
    areaServed: "United States",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    sameAs: Object.values(SITE.socials).filter(Boolean),
    serviceType: [
      "Documentary film production",
      "Campaign video production",
      "Executive portraits",
      "Team headshots",
      "Event coverage",
      "Content retainers",
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeClient content={content} />
    </>
  );
}
