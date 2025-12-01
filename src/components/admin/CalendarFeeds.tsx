"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { addFeedAction, deleteFeedAction } from "@/app/admin/settings/calendarActions";

interface Feed {
  id: string;
  name: string;
  url: string;
}

export default function CalendarFeeds({ feeds }: { feeds: Feed[] }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-white">Availability Calendars</h2>
            <p className="mt-1 text-sm text-white/40">
              Sync your external calendars to block off busy times.
            </p>
          </div>
          <div className="rounded-full bg-white/5 p-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
        </div>

        <div className="mb-8 space-y-3">
          {feeds.map((feed) => (
            <div key={feed.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
              <div className="overflow-hidden">
                <p className="font-medium text-white">{feed.name}</p>
                <p className="truncate text-xs text-white/40">{feed.url}</p>
              </div>
              <button
                onClick={async () => await deleteFeedAction(feed.id)}
                className="ml-4 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/30 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
          {feeds.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm text-white/40">No calendars connected yet.</p>
            </div>
          )}
        </div>

        <form
          action={async (formData) => {
            setLoading(true);
            await addFeedAction(formData);
            (document.getElementById("feed-form") as HTMLFormElement).reset();
            setLoading(false);
          }}
          id="feed-form"
          className="space-y-5 border-t border-white/10 pt-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/60">Calendar Name</label>
              <input
                name="name"
                placeholder="e.g. Personal Google Cal"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 backdrop-blur-sm transition-all focus:border-white/20 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/60">iCal URL</label>
              <input
                name="url"
                placeholder="https://calendar.google.com/..."
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 backdrop-blur-sm transition-all focus:border-white/20 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button disabled={loading} size="md" className="bg-white text-black hover:bg-white/90">
              {loading ? "Connecting..." : "Connect Calendar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
