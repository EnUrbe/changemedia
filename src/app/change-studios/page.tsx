import { getContent } from "@/lib/contentStore";
import ChangeStudiosClient from "@/components/ChangeStudiosClient";

export const dynamic = "force-dynamic";

export default async function ChangeStudiosPage() {
  const content = await getContent();
  return <ChangeStudiosClient content={content} />;
}
