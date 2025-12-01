import { notFound } from "next/navigation";
import ProjectWorkspace from "@/components/clients/ProjectWorkspace";
import { getProjectById, sanitizeProject } from "@/lib/projectsStore";

const serifFont = "var(--font-family-serif, 'Instrument Serif', Georgia, serif)";

interface ClientPageProps {
  params: Promise<{ projectId: string }>;
  searchParams?: Promise<{ key?: string }>;
}

export default async function ClientProjectPage({ params, searchParams }: ClientPageProps) {
  const { projectId } = await params;
  const { key: accessKey } = (await searchParams) || {};
  
  const project = await getProjectById(projectId);
  if (!project) {
    notFound();
  }
  
  if (project.accessCode && project.accessCode !== accessKey) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 text-neutral-900">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#ffe7d9] via-[#f4edff] to-[#dff5ff] blur-[150px]" />
        </div>
        <div className="relative z-10 w-full max-w-md rounded-[32px] border border-neutral-200 bg-white/90 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Secure workspace</p>
          <h1 className="mt-4 text-3xl font-semibold" style={{ fontFamily: serifFont }}>
            Access code required
          </h1>
          <p className="mt-3 text-sm text-neutral-600">
            This workspace link needs the unique access code shared by the CHANGE Media producer.
          </p>
          <p className="mt-6 text-xs text-neutral-500">
            Paste <span className="font-mono font-semibold">?key=YOURCODE</span> at the end of the URL or resend the invite link to your team.
          </p>
        </div>
      </main>
    );
  }
  const clientProject = sanitizeProject(project);
  return <ProjectWorkspace project={clientProject} accessKey={accessKey} />;
}
