"use server";

import { getProjectByAccessCode } from "@/lib/projectsStore";
import { redirect } from "next/navigation";

export async function loginWithAccessCode(formData: FormData) {
  const code = formData.get("accessCode") as string;
  
  if (!code) {
    return { error: "Access code is required" };
  }

  const project = await getProjectByAccessCode(code);

  if (!project) {
    return { error: "Invalid access code" };
  }

  // Redirect to the project workspace with the key
  redirect(`/clients/${project.id}?key=${code}`);
}
