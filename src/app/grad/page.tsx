import type { Metadata } from "next";
import GradClient from "./GradClient";
import { getGradContent } from "@/lib/gradStore";

export const metadata: Metadata = {
  title: "Graduation Portraits | Change Media Studio",
  description:
    "Professional graduation portraits for seniors and recent grads. Choose from quick sessions to full signature coverage with digital delivery, announcements, and print options.",
};

export const dynamic = "force-dynamic";

export default async function GradPage() {
  const content = await getGradContent();
  return <GradClient content={content} />;
}
