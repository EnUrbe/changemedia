'use client';

import { useEffect, useState } from 'react';

type Section = { id: string; label: string };

export default function SectionNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50">
      <div className="mx-auto max-w-6xl px-4 overflow-x-auto">
        <nav className="flex gap-2 py-3 text-sm">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`inline-flex items-center rounded-xl px-3 py-1.5 border ${
                active === s.id
                  ? 'border-white/30 bg-white/10 text-white'
                  : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
