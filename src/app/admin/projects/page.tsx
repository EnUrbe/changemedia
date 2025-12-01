import Link from "next/link";
import { getProjects } from "@/lib/projectsStore";
import Button from "@/components/ui/Button";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Client Projects</h1>
            <p className="mt-2 text-white/60">Manage client workspaces and deliverables.</p>
          </div>
          <Link href="/admin/projects/new">
            <Button>New Project</Button>
          </Link>
        </div>

        <div className="grid gap-4">
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
      </div>
    </div>
  );
}
