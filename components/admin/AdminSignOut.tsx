"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminSignOut() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button onClick={handleSignOut} className="text-xs font-medium text-neutral-500 hover:text-red-600">
      Sign Out
    </button>
  );
}
