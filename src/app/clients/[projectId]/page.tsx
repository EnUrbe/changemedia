import { notFound } from "next/navigation";
import ProjectWorkspace from "@/components/clients/ProjectWorkspace";
import { getProjectById, sanitizeProject } from "@/lib/projectsStore";

interface ClientPageProps {
  params: { projectId: string };
  searchParams?: { key?: string };
}

export default async function ClientProjectPage({ params, searchParams }: ClientPageProps) {
  const project = await getProjectById(params.projectId);
  if (!project) {
    notFound();
  }
  const accessKey = searchParams?.key;
  if (project.accessCode && project.accessCode !== accessKey) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 text-neutral-50">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
          <h1 className="text-xl font-semibold">Access code required</h1>
          <p className="mt-2 text-sm text-neutral-400">
            This workspace link needs the unique access code shared by the CHANGE Media producer.
          </p>
        </div>
      </main>
    );
  }
  const clientProject = sanitizeProject(project);
  return <ProjectWorkspace project={clientProject} accessKey={accessKey} />;
}
