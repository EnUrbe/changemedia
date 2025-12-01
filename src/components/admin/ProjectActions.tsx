"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { updateProjectStatus, deleteProject } from "@/src/app/admin/projects/actions";
import { useRouter } from "next/navigation";

interface ProjectActionsProps {
  projectId: string;
  accessCode: string;
  currentStatus: string;
}

export default function ProjectActions({ projectId, accessCode, currentStatus }: ProjectActionsProps) {
  const [copying, setCopying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleCopyLink = () => {
    const url = `${window.location.origin}/clients/${projectId}?key=${accessCode}`;
    navigator.clipboard.writeText(url);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project? This cannot be undone.")) {
      setIsDeleting(true);
      await deleteProject(projectId);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="ghost" onClick={handleCopyLink} className="h-9 text-xs">
        {copying ? "Copied!" : "Copy Link"}
      </Button>

      <form action={async (formData) => {
        const status = formData.get("status") as string;
        await updateProjectStatus(projectId, status);
      }}>
        <select 
          name="status" 
          defaultValue={currentStatus}
          onChange={(e) => e.target.form?.requestSubmit()}
          className="h-9 rounded-full border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 focus:border-neutral-900 focus:outline-none"
        >
          <option value="planning">Planning</option>
          <option value="in-production">In Production</option>
          <option value="in-review">In Review</option>
          <option value="approved">Approved</option>
          <option value="delivered">Delivered</option>
        </select>
      </form>

      <div className="h-4 w-px bg-neutral-200 mx-1" />

      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
