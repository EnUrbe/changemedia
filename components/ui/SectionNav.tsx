'use client';

import { useEffect, useState } from 'react';

type Section = { id: string; label: string };
type SectionNavProps = {
  sections: Section[];
  variant?: 'dark' | 'light';
  className?: string;
};

const variantStyles = {
  dark: {
    container:
      'border-b border-white/10 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50',
    nav: 'text-sm text-neutral-200',
    active: 'border-white/30 bg-white/10 text-white',
    inactive: 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10',
  },
  light: {
    container:
      'border-b border-neutral-100 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60',
    nav: 'text-sm text-neutral-500',
    active: 'text-neutral-900 bg-neutral-100 font-medium',
    inactive: 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50',
  },
};

export default function SectionNav({ sections, variant = 'dark', className = '' }: SectionNavProps) {
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

  const styles = variantStyles[variant];

  return (
    <div className={`sticky top-0 z-30 ${styles.container} ${className}`}>
      <div className="mx-auto max-w-6xl px-4 overflow-x-auto no-scrollbar">
        <nav className={`flex gap-1 py-4 ${styles.nav}`}>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`inline-flex items-center rounded-full px-4 py-2 transition-all duration-300 text-xs uppercase tracking-widest ${
                active === s.id ? styles.active : styles.inactive
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
