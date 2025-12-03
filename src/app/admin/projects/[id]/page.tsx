import { getProjectById } from "@/lib/projectsStore";
import { getPhotoSelectionsByProject } from "@/lib/photoSelectionStore";
import { notFound } from "next/navigation";
import AddDeliverableForm from "./AddDeliverableForm";
import ProjectActions from "@/components/admin/ProjectActions";
import ProjectAiAssistant from "@/components/admin/ProjectAiAssistant";
import CreateSelectionGalleryForm from "@/components/admin/CreateSelectionGalleryForm";
import PhotoSelectionsAdmin from "./PhotoSelectionsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, photoSelections] = await Promise.all([
    getProjectById(id),
    getPhotoSelectionsByProject(id),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <div className="border-b border-neutral-200 bg-white px-8 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-neutral-900">{project.clientName}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${
                project.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-lg text-neutral-500">{project.projectTitle}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-neutral-400">
              <span className="font-mono">Code: {project.accessCode}</span>
              <span>•</span>
              <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
          <ProjectActions 
            projectId={project.id} 
            accessCode={project.accessCode} 
            currentStatus={project.status} 
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 p-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {/* AI Insights Display */}
          {(project.aiNotes || project.checklist.length > 0) && (
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Project Intelligence</h2>
              </div>
              <div className="p-6">
                {project.aiNotes && (
                  <div className="mb-6 rounded-lg bg-blue-50/50 p-4 text-sm text-neutral-700">
                    <p className="mb-1 font-medium text-blue-900">AI Summary</p>
                    {project.aiNotes}
                  </div>
                )}
                {project.checklist.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-neutral-900">Action Items</h3>
                    <ul className="space-y-2">
                      {project.checklist.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Deliverables List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold text-neutral-900">Deliverables</h2>
              <span className="text-sm text-neutral-500">{project.deliverables.length} items</span>
            </div>
            
            {project.deliverables.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center">
                <p className="text-neutral-500">No deliverables yet.</p>
                <p className="text-sm text-neutral-400">Use the form to add the first item.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {project.deliverables.map((d) => (
                  <div key={d.id} className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300 hover:shadow-md">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                        {d.type}
                      </span>
                      <span className={`h-2 w-2 rounded-full ${
                        d.status === 'ready' ? 'bg-green-500' : 'bg-amber-500'
                      }`} />
                    </div>
                    <h3 className="font-medium text-neutral-900">{d.title}</h3>
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-xs text-neutral-500 hover:text-blue-600 hover:underline">
                      {d.url}
                    </a>
                    {d.images && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-neutral-400">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {d.images.length} images
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photo Selections Section */}
          <PhotoSelectionsAdmin 
            projectId={project.id} 
            photoSelections={photoSelections} 
            accessCode={project.accessCode}
          />
        </div>

        <div className="space-y-6">
          <ProjectAiAssistant projectId={project.id} />

          {/* Create Photo Selection Gallery */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">📸 Photo Selection</h2>
            <p className="mb-4 text-sm text-neutral-500">Upload culled photos for client to select their favorites.</p>
            <CreateSelectionGalleryForm projectId={project.id} />
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Add Deliverable</h2>
            <AddDeliverableForm projectId={project.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
