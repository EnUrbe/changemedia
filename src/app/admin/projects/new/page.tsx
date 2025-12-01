"use client";

import Button from "@/components/ui/Button";
import { createNewProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-semibold text-neutral-900">Create New Project</h1>
        
        <form 
          action={async (formData) => {
            await createNewProject(formData);
          }} 
          className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Client Name</label>
            <input
              name="clientName"
              required
              className="w-full rounded-lg border border-neutral-200 px-4 py-2 focus:border-neutral-900 focus:outline-none"
              placeholder="Acme Corp"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Project Title</label>
            <input
              name="projectTitle"
              required
              className="w-full rounded-lg border border-neutral-200 px-4 py-2 focus:border-neutral-900 focus:outline-none"
              placeholder="Q3 Campaign"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Contact Email</label>
            <input
              name="email"
              type="email"
              className="w-full rounded-lg border border-neutral-200 px-4 py-2 focus:border-neutral-900 focus:outline-none"
              placeholder="contact@acme.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Access Code</label>
            <input
              name="accessCode"
              required
              className="w-full rounded-lg border border-neutral-200 px-4 py-2 font-mono focus:border-neutral-900 focus:outline-none"
              placeholder="SECRET123"
            />
            <p className="text-xs text-neutral-500">This is the password the client will use to log in.</p>
          </div>

          <div className="pt-4">
            <Button type="submit" fullWidth>Create Project</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
