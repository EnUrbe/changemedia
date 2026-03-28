import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Start a Project",
  description:
    "Contact CHANGE Media about documentary films, executive portraits, team headshots, event coverage, or ongoing content support.",
};

export default function ContactPage() {
  return <ContactClient />;
}
