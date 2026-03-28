"use client";

import { useRef, useEffect, useState } from "react";

interface CounterProps {
  value: string;
  label: string;
}

export default function AnimatedCounter({ value, label }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  // Parse numeric part
  const numericMatch = value.match(/(\d+)/);
  const target = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const prefix = value.match(/^[^\d]*/)?.[0] || "";
  const suffix = value.match(/[^\d]*$/)?.[0] || "";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || target === 0) return;
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [visible, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-5xl font-serif text-white">
        {prefix}
        {target > 0 ? count : value}
        {target > 0 ? suffix : ""}
      </div>
      <div className="mt-2 text-xs font-mono uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {label}
      </div>
    </div>
  );
}
