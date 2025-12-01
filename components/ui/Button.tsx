"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const MotionLink = motion.create(Link);

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

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-black shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:bg-neutral-200 hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.4)] focus-visible:ring-white",
  ghost:
    "border border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white focus-visible:ring-white/50",
  soft:
    "bg-white/10 text-white border border-white/20 hover:bg-white/20 focus-visible:ring-white/50",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-[11px]",
  lg: "h-12 px-6 text-[12px]",
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
    href,
    ...rest
  } = props;
  const prefersReducedMotion = useReducedMotion();

  const shared =
    `inline-flex items-center justify-center gap-2 rounded-full uppercase tracking-[0.24em] font-semibold ` +
    `transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-white ` +
    `${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  const motionProps = prefersReducedMotion
    ? {}
    : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.99 } };

  if (href) {
    return (
      <MotionLink href={href} className={shared} {...motionProps} {...(rest as any)}>
        {icon && <span className="flex h-4 w-4 items-center justify-center">{icon}</span>}
        <span>{children}</span>
        {trailingIcon && <span className="flex h-4 w-4 items-center justify-center">{trailingIcon}</span>}
      </MotionLink>
    );
  }

  return (
    <motion.button className={shared} {...motionProps} {...(rest as any)}>
      {icon && <span className="flex h-4 w-4 items-center justify-center">{icon}</span>}
      <span>{children}</span>
      {trailingIcon && <span className="flex h-4 w-4 items-center justify-center">{trailingIcon}</span>}
    </motion.button>
  );
}
