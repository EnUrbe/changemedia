import MarketingAgent from "@/components/admin/MarketingAgent";

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-[#050505] p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <h1 className="font-serif text-4xl text-white">Marketing Agent</h1>
          <p className="mt-2 text-white/60">Generate social posts, newsletters, and blog content.</p>
        </header>
        <MarketingAgent />
      </div>
    </main>
  );
}
