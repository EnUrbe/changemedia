import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#050505] text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-white/40 mb-6">
          404 Error
        </p>
        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tight mb-8">
          Lost in the<br />footage.
        </h1>
        <p className="max-w-md text-lg text-white/60 mb-10 leading-relaxed">
          The page you are looking for has been moved, deleted, or never existed. Let's get you back to the studio.
        </p>
        
        <Link 
          href="/"
          className="group relative inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-transform hover:scale-105"
        >
          <span>Return Home</span>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </main>
  );
}
