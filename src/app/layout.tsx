import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import JsonLd from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = "CHANGE Media Studios";

export const metadata: Metadata = {
  title: {
    default: "CHANGE Media — Short, cinematic stories",
    template: "%s | CHANGE Media",
  },
  description:
    "Youth-led studio making micro-docs, reels, and campaign assets about health, community, and policy.",
  keywords: [
    "social impact media studio",
    "health equity storytelling",
    "documentary production for nonprofits",
    "creative studio",
    "public health media",
    "storytelling for social change",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: "CHANGE Media — Short, cinematic stories",
    description:
      "Youth-led studio making micro-docs, reels, and campaign assets about health, community, and policy.",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "CHANGE Media" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CHANGE Media — Short, cinematic stories",
    description:
      "Youth-led studio making micro-docs, reels, and campaign assets about health, community, and policy.",
    images: ["/opengraph-image"],
    creator: "@changemedia", // update if applicable
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/og-default.jpg`,
    sameAs: [
      // add social URLs when available
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <JsonLd data={org} />
        <JsonLd data={website} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
