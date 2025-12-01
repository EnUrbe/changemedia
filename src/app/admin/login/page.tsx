"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin/projects");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Access</h1>
          <p className="mt-2 text-sm text-white/40">Sign in to manage Change Media.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="sr-only">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-white/20 focus:border-white/20 focus:outline-none text-white"
              placeholder="name@changemedia.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="sr-only">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-white/20 focus:border-white/20 focus:outline-none text-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
