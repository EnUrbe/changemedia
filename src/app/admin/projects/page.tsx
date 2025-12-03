import Link from "next/link";
import { getProjects } from "@/lib/projectsStore";
import { getAllPendingEdits } from "@/lib/photoSelectionStore";
import Button from "@/components/ui/Button";
import QuickPhotoUpload from "./QuickPhotoUpload";

export const dynamic = "force-dynamic";

const serifFont = "var(--font-family-serif, 'Instrument Serif', Georgia, serif)";

const statusConfig: Record<string, { bg: string; text: string; icon: string }> = {
  planning: { bg: "bg-amber-500/20", text: "text-amber-400", icon: "📋" },
  "in-production": { bg: "bg-blue-500/20", text: "text-blue-400", icon: "🎬" },
  "in-review": { bg: "bg-purple-500/20", text: "text-purple-400", icon: "👀" },
  approved: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "✓" },
  delivered: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "🎉" },
};

export default async function AdminProjectsPage() {
  const [projects, pendingEdits] = await Promise.all([
    getProjects(),
    getAllPendingEdits(),
  ]);

  const activeProjects = projects.filter(p => p.status !== "delivered");
  const deliveredProjects = projects.filter(p => p.status === "delivered");
  const totalDeliverables = projects.reduce((acc, p) => acc + p.deliverables.length, 0);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 px-6 py-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Admin Dashboard</p>
                <h1 className="mt-2 text-4xl text-white lg:text-5xl" style={{ fontFamily: serifFont }}>
                  Client Projects
                </h1>
              </div>
              <Link href="/admin/projects/new">
                <Button className="!bg-white !text-black hover:!bg-white/90">
                  + New Project
                </Button>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Active", value: activeProjects.length, icon: "🚀" },
                { label: "Delivered", value: deliveredProjects.length, icon: "✓" },
                { label: "Deliverables", value: totalDeliverables, icon: "📦" },
                { label: "Pending Edits", value: pendingEdits.length, icon: "📸", highlight: pendingEdits.length > 0 },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl border p-4 transition-colors ${
                    stat.highlight 
                      ? "border-amber-500/30 bg-amber-500/10" 
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{stat.icon}</span>
                    <span className="text-2xl font-semibold text-white">{stat.value}</span>
                  </div>
                  <p className={`mt-1 text-xs uppercase tracking-wider ${stat.highlight ? "text-amber-400" : "text-white/50"}`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Projects List */}
            <div className="space-y-6">
              {/* Pending Edits Alert */}
              {pendingEdits.length > 0 && (
                <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-2xl">
                      📸
                    </div>
                    <div>
                      <p className="font-semibold text-amber-200">
                        {pendingEdits.length} photo selection{pendingEdits.length > 1 ? "s" : ""} ready to edit
                      </p>
                      <p className="mt-1 text-sm text-amber-200/70">
                        Clients have submitted their favorites — time to work your magic!
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {pendingEdits.slice(0, 3).map((edit) => (
                          <span key={edit.id} className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-300">
                            {edit.title}
                          </span>
                        ))}
                        {pendingEdits.length > 3 && (
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                            +{pendingEdits.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Projects */}
              {activeProjects.length > 0 && (
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-white/50">
                    <span className="h-px flex-1 bg-white/10" />
                    <span>Active Projects</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </h2>
                  <div className="space-y-3">
                    {activeProjects.map((project) => {
                      const config = statusConfig[project.status] || statusConfig.planning;
                      return (
                        <Link
                          key={project.id}
                          href={`/admin/projects/${project.id}`}
                          className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.06]"
                        >
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{config.icon}</span>
                                  <h3 className="truncate text-lg font-semibold text-white">
                                    {project.clientName}
                                  </h3>
                                </div>
                                <p className="mt-1 truncate text-sm text-white/50">{project.projectTitle}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
                                  {project.status.replace("-", " ")}
                                </span>
                                {project.dueDate && (
                                  <span className="text-xs text-white/40">
                                    Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
                              <span className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {project.deliverables.length} deliverable{project.deliverables.length !== 1 ? "s" : ""}
                              </span>
                              <span className="font-mono">{project.accessCode}</span>
                              <span className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
                                View →
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivered Projects */}
              {deliveredProjects.length > 0 && (
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-white/50">
                    <span className="h-px flex-1 bg-white/10" />
                    <span>Delivered</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {deliveredProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/admin/projects/${project.id}`}
                        className="group rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.04]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg opacity-50">🎉</span>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-medium text-white/70">{project.clientName}</h3>
                            <p className="truncate text-xs text-white/40">{project.projectTitle}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {projects.length === 0 && (
                <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center">
                  <div className="mx-auto mb-4 text-5xl opacity-50">🎬</div>
                  <h3 className="text-xl font-semibold text-white/70">No projects yet</h3>
                  <p className="mt-2 text-sm text-white/40">Create your first project to get started</p>
                  <Link href="/admin/projects/new" className="mt-6 inline-block">
                    <Button>Create Project</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <QuickPhotoUpload projects={projects.map(p => ({ id: p.id, clientName: p.clientName, projectTitle: p.projectTitle }))} />
              
              {/* Quick Links */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/50">Quick Links</h3>
                <div className="space-y-2">
                  {[
                    { href: "/admin/portraits", label: "Portrait Inquiries", icon: "📷" },
                    { href: "/admin/calendar", label: "Calendar", icon: "📅" },
                    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-white/70 transition-all hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
