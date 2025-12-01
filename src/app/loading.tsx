export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-white"></div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/40 animate-pulse">Loading Studio</p>
      </div>
    </div>
  );
}
