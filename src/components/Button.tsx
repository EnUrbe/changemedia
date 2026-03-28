import Link from "next/link";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "md" | "lg";
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-sans text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 whitespace-nowrap will-change-transform";

  const variants = {
    primary:
      "bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 shadow-[0_8px_30px_rgba(0,0,0,0.28)] hover:shadow-[0_12px_40px_rgba(215,185,138,0.2)]",
    outline:
      "border border-[var(--border-hover)] text-white hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-0.5 bg-transparent hover:shadow-[0_8px_30px_rgba(215,185,138,0.08)]",
    ghost:
      "text-[var(--text-secondary)] hover:text-white px-0 underline-offset-4 hover:underline",
  };

  const sizes = {
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${
    disabled ? "opacity-40 pointer-events-none" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
