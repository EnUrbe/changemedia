"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { updatePassword } from "@/app/admin/settings/actions";

export default function PasswordForm() {
  const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    
    const result = await updatePassword(formData);
    setMessage(result);
    setLoading(false);
    
    if (result.success) {
      (document.getElementById("password-form") as HTMLFormElement).reset();
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-white">Security</h2>
            <p className="mt-1 text-sm text-white/40">
              Update your admin password.
            </p>
          </div>
          <div className="rounded-full bg-white/5 p-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
        </div>
        
        <form id="password-form" action={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/60">New Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 backdrop-blur-sm transition-all focus:border-white/20 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/60">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 backdrop-blur-sm transition-all focus:border-white/20 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
          </div>

          {message?.error && (
            <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-400 border border-red-500/20">
              {message.error}
            </div>
          )}
          {message?.success && (
            <div className="rounded-lg bg-emerald-500/20 p-3 text-sm text-emerald-400 border border-emerald-500/20">
              {message.success}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button disabled={loading} size="md" className="bg-white text-black hover:bg-white/90">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
