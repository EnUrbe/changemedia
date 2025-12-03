import Link from "next/link";
import { getProjects } from "@/lib/projectsStore";
import { getAllPendingEdits } from "@/lib/photoSelectionStore";
import Button from "@/components/ui/Button";
import QuickPhotoUpload from "./QuickPhotoUpload";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const [projects, pendingEdits] = await Promise.all([
    getProjects(),
    getAllPendingEdits(),
  ]);

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Client Projects</h1>
            <p className="mt-2 text-white/60">Manage client workspaces and deliverables.</p>
          </div>
          <Link href="/admin/projects/new">
            <Button>New Project</Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Projects List */}
          <div className="space-y-4">
            {/* Pending Edits Alert */}
            {pendingEdits.length > 0 && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📸</span>
                  <div>
                    <p className="font-medium text-amber-200">
                      {pendingEdits.length} photo selection{pendingEdits.length > 1 ? "s" : ""} ready to edit
                    </p>
                    <p className="text-sm text-amber-200/70">
                      Clients have submitted their selections
                    </p>
                  </div>
                </div>
              </div>
            )}

            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="group block rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white group-hover:text-white/90">
                      {project.clientName}
                    </h2>
                    <p className="text-sm text-white/60">{project.projectTitle}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                        project.status === "delivered"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {project.status}
                    </span>
                    <span className="font-mono text-xs text-white/40">
                      {project.accessCode}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {projects.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-white/40">
                No projects found. Create one to get started.
              </div>
            )}
          </div>

          {/* Quick Photo Upload Sidebar */}
          <div className="space-y-4">
            <QuickPhotoUpload projects={projects.map(p => ({ id: p.id, clientName: p.clientName, projectTitle: p.projectTitle }))} />
          </div>
        </div>
      </div>
    </div>
  );
}
