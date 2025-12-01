"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#050505] text-white">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-red-400 mb-6">
          System Error
        </p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-6">
          Something went wrong.
        </h1>
        <p className="text-white/60 mb-10 leading-relaxed">
          We encountered an unexpected issue. Our team has been notified.
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
