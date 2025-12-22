import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  children?: ReactNode;
  maxWidth?: "lg" | "xl";
  padTop?: boolean;
};

export default function Section({
  id,
  eyebrow,
  title,
  description,
  tone = "light",
  className = "",
  children,
  maxWidth = "xl",
  padTop = true,
}: SectionProps) {
  const text = tone === "dark" ? "text-white" : "text-[var(--foreground)]";
  const muted = tone === "dark" ? "text-white/60" : "text-[var(--muted)]";
  const surface = tone === "dark" ? "bg-[var(--brand)]" : "bg-[var(--background)]";

  const widthClass = maxWidth === "xl" ? "max-w-7xl" : "max-w-5xl";

  return (
    <section
      id={id}
      className={`${surface} ${text} px-6 ${padTop ? "py-20 md:py-28" : ""} ${className}`}
    >
      <div className={`mx-auto flex flex-col gap-8 ${widthClass}`}>
        {(eyebrow || title || description) && (
          <div className="space-y-4">
            {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.32em] text-white/60">{eyebrow}</p>}
            {title && (
              <h2
                className="text-4xl leading-tight md:text-6xl"
                style={{ fontFamily: "var(--font-family-serif, 'Instrument Serif', Georgia, serif)" }}
              >
                {title}
              </h2>
            )}
            {description && <p className={`text-lg leading-relaxed ${muted}`}>{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
