import Link from "next/link";
import { SITE, NAV_LINKS } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] relative">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

      <div className="container-wide py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <Link
              href="/"
              className="font-serif text-xl leading-none tracking-[-0.05em] text-white transition-colors duration-300 hover:text-[var(--accent)]"
            >
              Change<br />Media
            </Link>
            <p className="mt-5 text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">
              {SITE.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="eyebrow mb-2">Pages</span>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors duration-300 w-fit link-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="eyebrow mb-2">Connect</span>
            <a
              href={`mailto:${SITE.email}`}
              className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors duration-300 link-underline w-fit"
            >
              {SITE.email}
            </a>
            <p className="text-sm text-[var(--text-muted)]">{SITE.city}</p>
            <div className="flex gap-4 mt-2">
              {SITE.socials.instagram && (
                <a
                  href={SITE.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300"
                >
                  Instagram
                </a>
              )}
              {SITE.socials.youtube && (
                <a
                  href={SITE.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300"
                >
                  YouTube
                </a>
              )}
              {SITE.socials.vimeo && (
                <a
                  href={SITE.socials.vimeo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300"
                >
                  Vimeo
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="divider-glow mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
          <span>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
