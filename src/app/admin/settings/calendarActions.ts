"use server";

import { addCalendarFeed, deleteCalendarFeed } from "@/lib/calendarStore";
import { revalidatePath } from "next/cache";

export async function addFeedAction(formData: FormData) {
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;

  if (!name || !url) return;

  await addCalendarFeed(name, url);
  revalidatePath("/admin/settings");
}

export async function deleteFeedAction(id: string) {
  await deleteCalendarFeed(id);
  revalidatePath("/admin/settings");
}
