"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "soft";
type ButtonSize = "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
};

type ButtonProps = BaseProps &
  (
    | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  );

// V3 Styles: Strict, Flat, No Scale, Monochrome
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background border border-transparent hover:opacity-80 transition-opacity",
  ghost:
    "bg-transparent text-foreground border border-border-strong hover:bg-foreground hover:text-background transition-colors",
  soft:
    "bg-muted text-foreground hover:bg-muted/70 transition-colors",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-6 text-xs uppercase tracking-widest",
  lg: "h-14 px-8 text-sm uppercase tracking-widest",
};

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
    icon,
    trailingIcon,
    fullWidth,
    ...rest
  } = props;

  const baseClasses =
    "inline-flex items-center justify-center font-mono rounded-full whitespace-nowrap outline-none focus-visible:ring-1 focus-visible:ring-foreground disabled:pointer-events-none disabled:opacity-50 gap-2";

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  if (props.href) {
    const { href: _, ...linkProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={props.href} className={classes} {...linkProps}>
        {icon && <span className="mr-1">{icon}</span>}
        {children}
        {trailingIcon && <span className="ml-1">{trailingIcon}</span>}
      </Link>
    );
  }

  const { ...btnProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...btnProps}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {trailingIcon && <span className="ml-1">{trailingIcon}</span>}
    </button>
  );
}